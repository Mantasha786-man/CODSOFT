import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Button, Tag, Divider, Form, Input, Upload, message, Spin, Row, Col, List } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { EnvironmentOutlined, DollarOutlined, ClockCircleOutlined, UploadOutlined, SendOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/api';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchJobDetail();
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    }
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job detail:', error);
      message.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/me/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    } else if (min) {
      return `From $${min.toLocaleString()}`;
    } else if (max) {
      return `Up to $${max.toLocaleString()}`;
    }
    return 'Salary not specified';
  };

  const handleApply = async (values) => {
    if (!user || user.role !== 'candidate') {
      message.error('Only candidates can apply for jobs');
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', values.coverLetter || '');

      if (values.resume && values.resume[0]) {
        formData.append('resume', values.resume[0].originFileObj);
      }

      await api.post('/applications/apply/' + id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      message.success('Application submitted successfully!');
      form.resetFields();
    } catch (error) {
      console.error('Error applying for job:', error);
      message.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ padding: '2rem', textAlign: 'center' }}>
          <Spin size="large" />
        </Content>
        <Footer />
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ padding: '2rem', textAlign: 'center' }}>
          <Text>Job not found</Text>
        </Content>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />

      <Content style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <Card>
              <div style={{ marginBottom: '1rem' }}>
                <Title level={2}>{job.title}</Title>
                <Text strong style={{ fontSize: '1.1rem' }}>{job.companyId?.name || 'Company Name'}</Text>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <EnvironmentOutlined style={{ marginRight: '0.5rem' }} />
                  <Text>{job.location}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DollarOutlined style={{ marginRight: '0.5rem' }} />
                  <Text>{formatSalary(job.salaryMin, job.salaryMax)}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ClockCircleOutlined style={{ marginRight: '0.5rem' }} />
                  <Text>{job.type}</Text>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <Tag color="blue">{job.category}</Tag>
                <Tag color="green">{job.type}</Tag>
                <Text type="secondary" style={{ marginLeft: '1rem' }}>
                  Posted {new Date(job.postedAt).toLocaleDateString()}
                </Text>
              </div>

              <Divider />

              <div style={{ marginBottom: '2rem' }}>
                <Title level={4}>Job Description</Title>
                <Paragraph style={{ whiteSpace: 'pre-line' }}>{job.description}</Paragraph>
              </div>

              {job.responsibilities && job.responsibilities.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <Title level={4}>Responsibilities</Title>
                  <List
                    dataSource={job.responsibilities}
                    renderItem={item => <List.Item>• {item}</List.Item>}
                  />
                </div>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <Title level={4}>Requirements</Title>
                  <List
                    dataSource={job.requirements}
                    renderItem={item => <List.Item>• {item}</List.Item>}
                  />
                </div>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <Title level={4}>Benefits</Title>
                  <List
                    dataSource={job.benefits}
                    renderItem={item => <List.Item>• {item}</List.Item>}
                  />
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            {user?.role === 'candidate' && (
              <Card title="Apply for this job" style={{ marginBottom: '2rem' }}>
                <Form form={form} layout="vertical" onFinish={handleApply}>
                  <Form.Item
                    name="coverLetter"
                    label="Cover Letter (Optional)"
                  >
                    <TextArea
                      rows={4}
                      placeholder="Tell us why you're interested in this position..."
                    />
                  </Form.Item>

                  <Form.Item
                    name="resume"
                    label="Resume"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e.fileList}
                    rules={[{ required: true, message: 'Please upload your resume' }]}
                  >
                    <Upload
                      accept=".pdf,.doc,.docx"
                      maxCount={1}
                      beforeUpload={() => false}
                      listType="text"
                    >
                      <Button icon={<UploadOutlined />}>Select Resume</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SendOutlined />}
                      loading={applying}
                      block
                    >
                      Submit Application
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            )}

            <Card title="Company Information">
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <UserOutlined style={{ fontSize: '3rem', color: '#0B6EFD' }} />
              </div>
              <Title level={4}>{job.companyId?.name || 'Company Name'}</Title>
              {job.companyId?.company?.description && (
                <Paragraph>{job.companyId.company.description}</Paragraph>
              )}
              {job.companyId?.company?.website && (
                <div style={{ marginTop: '1rem' }}>
                  <a href={job.companyId.company.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer />
    </Layout>
  );
};

export default JobDetail;
