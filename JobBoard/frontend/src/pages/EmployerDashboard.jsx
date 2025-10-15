import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Button, Table, Tag, Space, Modal, Form, Input, Select, message, Tabs, List, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/api';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/employer/my-jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      message.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      const response = await api.get(`/applications/job/${jobId}/applicants`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      message.error('Failed to load applications');
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    form.setFieldsValue({
      title: job.title,
      location: job.location,
      type: job.type,
      category: job.category,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      description: job.description,
      responsibilities: job.responsibilities?.join('\n') || '',
      requirements: job.requirements?.join('\n') || '',
      benefits: job.benefits?.join('\n') || ''
    });
    setModalVisible(true);
  };

  const handleDeleteJob = async (jobId) => {
    Modal.confirm({
      title: 'Delete Job',
      content: 'Are you sure you want to delete this job?',
      onOk: async () => {
        try {
          await api.delete(`/jobs/${jobId}`);
          message.success('Job deleted successfully');
          fetchJobs();
        } catch (error) {
          console.error('Error deleting job:', error);
          message.error('Failed to delete job');
        }
      }
    });
  };

  const handleSubmitJob = async (values) => {
    try {
      const jobData = {
        ...values,
        responsibilities: values.responsibilities ? values.responsibilities.split('\n').filter(item => item.trim()) : [],
        requirements: values.requirements ? values.requirements.split('\n').filter(item => item.trim()) : [],
        benefits: values.benefits ? values.benefits.split('\n').filter(item => item.trim()) : []
      };

      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, jobData);
        message.success('Job updated successfully');
      } else {
        await api.post('/jobs', jobData);
        message.success('Job created successfully');
      }

      setModalVisible(false);
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      message.error('Failed to save job');
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status });
      message.success('Application status updated');
      // Refresh applications if viewing them
      if (applications.length > 0) {
        const currentJobId = applications[0].jobId;
        fetchApplications(currentJobId);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      message.error('Failed to update application status');
    }
  };

  const jobColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'open' ? 'green' : 'red'}>{status}</Tag>
    },
    {
      title: 'Applications',
      dataIndex: 'applicantsCount',
      key: 'applicantsCount',
      render: (count) => <Text>{count}</Text>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => fetchApplications(record._id)}
            size="small"
          >
            View Apps
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditJob(record)}
            size="small"
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteJob(record._id)}
            size="small"
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const applicationColumns = [
    {
      title: 'Candidate',
      dataIndex: 'candidateId',
      key: 'candidate',
      render: (candidate) => (
        <div>
          <Text strong>{candidate.name}</Text>
          <br />
          <Text type="secondary">{candidate.email}</Text>
        </div>
      ),
    },
    {
      title: 'Applied Date',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          submitted: 'blue',
          reviewed: 'orange',
          shortlisted: 'purple',
          rejected: 'red',
          accepted: 'green'
        };
        return <Tag color={colors[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Select
            defaultValue={record.status}
            onChange={(value) => updateApplicationStatus(record._id, value)}
            size="small"
            style={{ width: 120 }}
          >
            <Option value="submitted">Submitted</Option>
            <Option value="reviewed">Reviewed</Option>
            <Option value="shortlisted">Shortlisted</Option>
            <Option value="rejected">Rejected</Option>
            <Option value="accepted">Accepted</Option>
          </Select>
          <Button size="small">
            <a href={`http://localhost:5000/uploads/${record.resumeUrl}`} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />

      <Content style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>Employer Dashboard</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateJob}>
            Post New Job
          </Button>
        </div>

        <Tabs defaultActiveKey="jobs">
          <TabPane tab="My Jobs" key="jobs">
            <Card>
              <Table
                columns={jobColumns}
                dataSource={jobs}
                loading={loading}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </TabPane>

          <TabPane tab="Applications" key="applications">
            <Card>
              {applications.length > 0 ? (
                <Table
                  columns={applicationColumns}
                  dataSource={applications}
                  rowKey="_id"
                  pagination={{ pageSize: 10 }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Text type="secondary">Select a job to view applications</Text>
                </div>
              )}
            </Card>
          </TabPane>
        </Tabs>

        <Modal
          title={editingJob ? 'Edit Job' : 'Post New Job'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitJob}
          >
            <Form.Item
              name="title"
              label="Job Title"
              rules={[{ required: true, message: 'Please enter job title' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: 'Please enter location' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="type"
              label="Job Type"
              rules={[{ required: true, message: 'Please select job type' }]}
            >
              <Select>
                <Option value="Full-time">Full-time</Option>
                <Option value="Part-time">Part-time</Option>
                <Option value="Contract">Contract</Option>
                <Option value="Remote">Remote</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please enter category' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="salaryMin"
              label="Minimum Salary"
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="salaryMax"
              label="Maximum Salary"
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Job Description"
              rules={[{ required: true, message: 'Please enter job description' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="responsibilities"
              label="Responsibilities (one per line)"
            >
              <TextArea rows={4} placeholder="Enter each responsibility on a new line" />
            </Form.Item>

            <Form.Item
              name="requirements"
              label="Requirements (one per line)"
            >
              <TextArea rows={4} placeholder="Enter each requirement on a new line" />
            </Form.Item>

            <Form.Item
              name="benefits"
              label="Benefits (one per line)"
            >
              <TextArea rows={4} placeholder="Enter each benefit on a new line" />
            </Form.Item>

            <Form.Item style={{ marginTop: '2rem' }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingJob ? 'Update Job' : 'Post Job'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>

      <Footer />
    </Layout>
  );
};

export default EmployerDashboard;
