import React from 'react';
import { Input, Button, Select, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const SearchBar = ({ onSearch, loading = false }) => {
  const [form] = Form.useForm();

  const handleSearch = (values) => {
    onSearch(values);
  };

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote'];
  const categories = [
    'Technology', 'Marketing', 'Sales', 'Finance', 'Healthcare',
    'Education', 'Engineering', 'Design', 'Customer Service', 'Other'
  ];

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '2rem',
      borderRadius: '8px',
      marginBottom: '2rem'
    }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'end'
        }}
      >
        <Form.Item
          name="keyword"
          label="Job Title or Keywords"
        >
          <Input
            placeholder="e.g. Software Engineer"
            size="large"
            prefix={<SearchOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
        >
          <Input
            placeholder="e.g. New York"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
        >
          <Select
            placeholder="Select category"
            size="large"
            allowClear
          >
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="Job Type"
        >
          <Select
            placeholder="Select job type"
            size="large"
            allowClear
          >
            {jobTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            style={{ width: '100%' }}
          >
            Search Jobs
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchBar;
