import React, { useState } from 'react';
import { Form, Input, Button, Card, Tabs, message, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import api from '../api/api';

const { Title } = Typography;

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (activeTab === 'register') {
        const response = await api.post('/auth/register', values);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        message.success('Registration successful!');
        window.location.href = '/';
      } else {
        const response = await api.post('/auth/login', values);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        message.success('Login successful!');
        window.location.href = '/';
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    form.resetFields();
  };

  const loginForm = (
    <div style={{ padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Welcome Back</Title>
        <p>Sign in to your account</p>
      </div>

      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ height: '50px', fontSize: '16px' }}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const registerForm = (
    <div style={{ padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Create Account</Title>
        <p>Join our job board community</p>
      </div>

      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Full Name"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          name="role"
          initialValue="candidate"
          hidden
        >
          <Input value="candidate" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ height: '50px', fontSize: '16px' }}
          >
            Create Account
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '2rem'
    }}>
      <Row gutter={0} style={{ minHeight: '100vh' }}>
        {/* Left side - Image/Illustration */}
        <Col xs={0} md={12} style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <Title level={1} style={{ color: 'white', marginBottom: '1rem' }}>
              Find Your Dream Job
            </Title>
            <p style={{ fontSize: '18px', marginBottom: '2rem' }}>
              Connect with top employers and discover opportunities that match your skills and aspirations.
            </p>
            <div style={{
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserOutlined style={{ fontSize: '80px', color: 'white' }} />
            </div>
          </div>
        </Col>

        {/* Right side - Auth Forms */}
        <Col xs={24} md={12} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Card
            style={{
              width: '100%',
              maxWidth: '450px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              borderRadius: '10px'
            }}
          >
            <Tabs activeKey={activeTab} onChange={handleTabChange} centered>
              <Tabs.TabPane tab="Login" key="login">
                {loginForm}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Register" key="register">
                {registerForm}
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Auth;
