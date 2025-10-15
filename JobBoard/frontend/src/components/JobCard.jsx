import React from 'react';
import { Card, Button, Tag, Typography } from 'antd';
import { EnvironmentOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Meta } = Card;

const JobCard = ({ job }) => {
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

  return (
    <Card
      hoverable
      style={{ marginBottom: '1rem' }}
      actions={[
        <Link to={`/jobs/${job._id}`}>
          <Button type="primary">View Details & Apply</Button>
        </Link>
      ]}
    >
      <Meta
        title={<Title level={4} style={{ margin: 0 }}>{job.title}</Title>}
        description={
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <Text strong>{job.companyId?.name || 'Company Name'}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <EnvironmentOutlined style={{ marginRight: '0.5rem' }} />
              <Text>{job.location}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <DollarOutlined style={{ marginRight: '0.5rem' }} />
              <Text>{formatSalary(job.salaryMin, job.salaryMax)}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <ClockCircleOutlined style={{ marginRight: '0.5rem' }} />
              <Text>{job.type}</Text>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <Tag color="blue">{job.category}</Tag>
              <Tag color="green">{job.type}</Tag>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <Text type="secondary">
                Posted {new Date(job.postedAt).toLocaleDateString()}
              </Text>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default JobCard;
