import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Row, Col, Avatar, Upload } from 'antd';
import { UserOutlined, MailOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../api/api';

const { Title } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me/profile');
      setProfile(response.data);
      form.setFieldsValue(response.data);
    } catch {
      message.error('Failed to fetch profile');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.put('/users/me/profile', values);
      setProfile(response.data);
      setEditing(false);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue(profile);
    setEditing(false);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        My Profile
      </Title>

      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <Avatar size={100} icon={<UserOutlined />} style={{ marginBottom: '1rem' }} />
            <Title level={4}>{profile.name}</Title>
            <p>{profile.email}</p>
            <p style={{ textTransform: 'capitalize' }}>{profile.role}</p>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            title="Profile Information"
            extra={
              !editing ? (
                <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              ) : null
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              disabled={!editing}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input prefix={<MailOutlined />} disabled />
              </Form.Item>

              {editing && (
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '1rem' }}>
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel}>
                    Cancel
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
