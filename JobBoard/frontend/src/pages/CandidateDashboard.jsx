import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Button, Table, Tag, Space, Avatar, Divider, List, message } from 'antd';
import { UserOutlined, FileTextOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/api';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
    fetchProfile();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      message.error('Failed to load applications');
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const applicationColumns = [
    {
      title: 'Job Title',
      dataIndex: 'jobId',
      key: 'job',
      render: (job) => (
        <div>
          <Text strong>{job.title}</Text>
          <br />
          <Text type="secondary">{job.companyId?.name || 'Company'}</Text>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'jobId',
      key: 'location',
      render: (job) => job.location,
    },
    {
      title: 'Type',
      dataIndex: 'jobId',
      key: 'type',
      render: (job) => <Tag color="blue">{job.type}</Tag>,
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
          <Button size="small">
            <Link to={`/jobs/${record.jobId._id}`}>
              <EyeOutlined /> View Job
            </Link>
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ padding: '2rem', textAlign: 'center' }}>
          Loading dashboard...
        </Content>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />

      <Content style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: '2rem' }}>Candidate Dashboard</Title>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Profile Summary */}
          <Card title="Profile Summary" style={{ height: 'fit-content' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <Avatar size={80} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                {profile?.name}
              </Title>
              <Text type="secondary">{profile?.email}</Text>
            </div>

            <Divider />

            <div style={{ marginBottom: '1rem' }}>
              <Text strong>Phone:</Text>
              <br />
              <Text>{profile?.profile?.phone || 'Not provided'}</Text>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <Text strong>Location:</Text>
              <br />
              <Text>{profile?.profile?.city || 'Not provided'}</Text>
            </div>

            {profile?.profile?.skills && profile.profile.skills.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <Text strong>Skills:</Text>
                <div style={{ marginTop: '0.5rem' }}>
                  {profile.profile.skills.map((skill, index) => (
                    <Tag key={index} style={{ marginBottom: '0.25rem' }}>{skill}</Tag>
                  ))}
                </div>
              </div>
            )}

            <Button type="primary" block style={{ marginTop: '1rem' }}>
              <Link to="/profile" style={{ color: '#fff' }}>
                <EditOutlined /> Edit Profile
              </Link>
            </Button>
          </Card>

          {/* Applications */}
          <Card title={`My Applications (${applications.length})`}>
            <Table
              columns={applicationColumns}
              dataSource={applications}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              locale={{
                emptyText: 'You haven\'t applied to any jobs yet.'
              }}
            />

            {applications.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <FileTextOutlined style={{ fontSize: '3rem', color: '#d9d9d9', marginBottom: '1rem' }} />
                <Paragraph type="secondary">
                  You haven't applied to any jobs yet. Start browsing jobs to find your next opportunity!
                </Paragraph>
                <Button type="primary">
                  <Link to="/jobs" style={{ color: '#fff' }}>Browse Jobs</Link>
                </Button>
              </div>
            )}
          </Card>
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};

export default CandidateDashboard;
