import React from 'react';
import { Layout, Row, Col, Typography, Input, Button, Space } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ backgroundColor: '#001529', color: '#fff', padding: '3rem 2rem 1rem' }}>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: '#fff', marginBottom: '1rem' }}>JobBoard</Title>
          <Text style={{ color: '#ccc' }}>
            Connecting talented individuals with amazing career opportunities.
            Find your dream job or discover the perfect candidate for your team.
          </Text>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: '#fff', marginBottom: '1rem' }}>For Job Seekers</Title>
          <Space direction="vertical" size="small">
            <Link href="#" style={{ color: '#ccc' }}>Browse Jobs</Link>
            <Link href="#" style={{ color: '#ccc' }}>Career Advice</Link>
            <Link href="#" style={{ color: '#ccc' }}>Resume Tips</Link>
            <Link href="#" style={{ color: '#ccc' }}>Interview Prep</Link>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: '#fff', marginBottom: '1rem' }}>For Employers</Title>
          <Space direction="vertical" size="small">
            <Link href="#" style={{ color: '#ccc' }}>Post a Job</Link>
            <Link href="#" style={{ color: '#ccc' }}>Find Candidates</Link>
            <Link href="#" style={{ color: '#ccc' }}>Pricing</Link>
            <Link href="#" style={{ color: '#ccc' }}>Employer Resources</Link>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: '#fff', marginBottom: '1rem' }}>Contact Us</Title>
          <Space direction="vertical" size="small">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MailOutlined style={{ marginRight: '0.5rem' }} />
              <Text style={{ color: '#ccc' }}>support@jobboard.com</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <PhoneOutlined style={{ marginRight: '0.5rem' }} />
              <Text style={{ color: '#ccc' }}>+1 (555) 123-4567</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <EnvironmentOutlined style={{ marginRight: '0.5rem' }} />
              <Text style={{ color: '#ccc' }}>123 Job Street, Career City, CC 12345</Text>
            </div>
          </Space>

          <div style={{ marginTop: '1rem' }}>
            <Title level={5} style={{ color: '#fff', marginBottom: '0.5rem' }}>Newsletter</Title>
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 80px)' }}
                placeholder="Your email"
              />
              <Button type="primary">Subscribe</Button>
            </Input.Group>
          </div>
        </Col>
      </Row>

      <Row style={{ marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Space size="large">
            <FacebookOutlined style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
            <TwitterOutlined style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
            <InstagramOutlined style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
            <LinkedinOutlined style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
          </Space>
        </Col>
      </Row>

      <Row style={{ marginTop: '1rem' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Text style={{ color: '#ccc' }}>
            © 2024 JobBoard. All rights reserved. |
            <Link href="#" style={{ color: '#ccc', marginLeft: '0.5rem' }}>Privacy Policy</Link> |
            <Link href="#" style={{ color: '#ccc', marginLeft: '0.5rem' }}>Terms of Service</Link>
          </Text>
        </Col>
      </Row>
    </AntFooter>
  );
};

export default Footer;
