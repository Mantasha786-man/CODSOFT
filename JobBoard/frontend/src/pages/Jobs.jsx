import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Pagination, Spin, Empty, message } from 'antd';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import api from '../api/api';

const { Content } = Layout;

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...Object.fromEntries(searchParams)
      };

      const response = await api.get('/jobs', { params });
      setJobs(response.data.jobs);
      setTotalJobs(response.data.totalJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      message.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    const newParams = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />

      <Content style={{ padding: '2rem' }}>
        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Spin size="large" />
          </div>
        ) : jobs.length === 0 ? (
          <Empty
            description="No jobs found matching your criteria"
            style={{ margin: '4rem 0' }}
          />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {jobs.map(job => (
                <Col xs={24} sm={12} lg={8} key={job._id}>
                  <JobCard job={job} />
                </Col>
              ))}
            </Row>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Pagination
                current={currentPage}
                total={totalJobs}
                pageSize={12}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} jobs`
                }
              />
            </div>
          </>
        )}
      </Content>

      <Footer />
    </Layout>
  );
};

export default Jobs;
