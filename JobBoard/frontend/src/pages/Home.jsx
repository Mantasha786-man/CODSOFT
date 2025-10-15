import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography, Button, Card, Carousel, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import api from '../api/api';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const response = await api.get('/jobs?limit=6');
      setFeaturedJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    // Navigate to jobs page with search params
    const params = new URLSearchParams(values).toString();
    window.location.href = `/jobs?${params}`;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />

      <Content>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <Title level={1} style={{ color: '#fff', marginBottom: '1rem' }}>
            Find Your Dream Job Today
          </Title>
          <Paragraph style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#e8e8e8' }}>
            Discover thousands of job opportunities from top companies around the world
          </Paragraph>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <SearchBar onSearch={handleSearch} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <Button type="primary" size="large" icon={<SearchOutlined />}>
              <Link to="/jobs" style={{ color: '#fff' }}>Browse Jobs</Link>
            </Button>
            <Button size="large" style={{ borderColor: '#fff', color: '#fff' }} icon={<UserOutlined />}>
              <Link to="/auth" style={{ color: '#fff' }}>Post a Job</Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ padding: '3rem 2rem', backgroundColor: '#f8f9fa' }}>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={8} md={6}>
              <Card style={{ textAlign: 'center', border: 'none' }}>
                <Title level={2} style={{ color: '#0B6EFD', margin: 0 }}>10,000+</Title>
                <Paragraph>Active Jobs</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Card style={{ textAlign: 'center', border: 'none' }}>
                <Title level={2} style={{ color: '#0B6EFD', margin: 0 }}>5,000+</Title>
                <Paragraph>Companies</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Card style={{ textAlign: 'center', border: 'none' }}>
                <Title level={2} style={{ color: '#0B6EFD', margin: 0 }}>50,000+</Title>
                <Paragraph>Job Seekers</Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Featured Jobs Section */}
        <div style={{ padding: '3rem 2rem' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Featured Jobs
          </Title>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {featuredJobs.map(job => (
                <Col xs={24} sm={12} lg={8} key={job._id}>
                  <JobCard job={job} />
                </Col>
              ))}
            </Row>
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Button type="primary" size="large">
              <Link to="/jobs" style={{ color: '#fff' }}>View All Jobs</Link>
            </Button>
          </div>
        </div>

        {/* How It Works Section */}
        <div style={{ padding: '3rem 2rem', backgroundColor: '#f8f9fa' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            How It Works
          </Title>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={8} md={6}>
              <Card style={{ textAlign: 'center', border: 'none' }}>
                <SearchOutlined style={{ fontSize: '3rem', color: '#0B6EFD', marginBottom: '1rem' }} />
                <Title level={4}>1. Search Jobs</Title>
                <Paragraph>Browse through thousands of job listings</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Card style={{ textAlign: 'center', border: 'none' }}>
                <UserOutlined style={{ fontSize: '3rem', color: '#0B6EFD', marginBottom: '1rem' }} />
                <Title level={4}>2. Apply Easily</Title>
                <Paragraph>Submit your application with one click</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Card style={{ textAlign: 'center', border: 'none' }}>
                <TeamOutlined style={{ fontSize: '3rem', color: '#0B6EFD', marginBottom: '1rem' }} />
                <Title level={4}>3. Get Hired</Title>
                <Paragraph>Connect with top companies and get hired</Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};

export default Home;
