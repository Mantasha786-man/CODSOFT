import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Badge, Button, message } from 'antd';
import { UserOutlined, LogoutOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import api from '../api/api';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
      if (localStorage.getItem('role') === 'candidate') {
        fetchAppliedJobsCount();
      }
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/me/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchAppliedJobsCount = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      setAppliedJobsCount(response.data.length);
    } catch (error) {
      console.error('Error fetching applied jobs count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    message.success('Logged out successfully');
    window.location.href = '/auth';
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      {user?.role === 'employer' && (
        <Menu.Item key="post-job" icon={<PlusOutlined />}>
          <Link to="/employer-dashboard">Post Job</Link>
        </Menu.Item>
      )}
      {user?.role === 'candidate' && (
        <Menu.Item key="applied-jobs" icon={<FileTextOutlined />}>
          <Link to="/candidate-dashboard">
            Applied Jobs
            {appliedJobsCount > 0 && <Badge count={appliedJobsCount} style={{ marginLeft: 8 }} />}
          </Link>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0B6EFD', textDecoration: 'none' }}>
        JobBoard
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/jobs" style={{ color: '#333', textDecoration: 'none' }}>Jobs</Link>

        {user ? (
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Button type="text" icon={<UserOutlined />}>
              {user.name}
            </Button>
          </Dropdown>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button type="link">
              <Link to="/auth" style={{ color: '#0B6EFD' }}>Login</Link>
            </Button>
            <Button type="primary">
              <Link to="/auth" style={{ color: '#fff' }}>Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
