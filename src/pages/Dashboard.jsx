import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Layout, Typography, Modal, Input, message } from 'antd';
import axiosInstance from '../tools/axiosInstance';
import '../css/Dashboard.css';
import NoteAppHeader from '../components/NoteAppHeader';

const { Content } = Layout;
const { Title } = Typography;

function Dashboard() {
  const [data, setData] = useState({
    username: 'ERROR',
    email: '',
    password: '',
  });
  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const navigate = useNavigate();

  const getUserDetails = async () => {
    try {
      const response = await axiosInstance.get('/me');
      setData(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Access Denied');
      navigate('/');
    }
  };

  useEffect(() => {
    const cookieInfo = Cookies.get('refresh_token');

    if (!cookieInfo) {
      console.log('Error: Redirect to / because of empty cookieInfo');
      navigate('/');
    }

    getUserDetails();
  }, []);

  const goToNoteOverview = () => {
    navigate('/notebookoverview');
  };

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) {
      message.error('Username cannot be empty!');
      return;
    }

    try {
      await axiosInstance.post('/changeusername', {
        new_username: newUsername,
      });
      message.success('Username updated successfully!');

      setIsUsernameModalVisible(false);
      setNewUsername('');
      getUserDetails(); // Refresh user details
    } catch (err) {
      console.error('Error updating username:', err);

      if (err.response && err.response.status === 409) {
        toast.error(err.response.data.error); // Display custom error
      } else {
        message.error('Failed to update username');
      }
    }
  };

  return (
    <Layout className="main">
      <NoteAppHeader title="Dashboard" />
      <Content style={{ padding: '20px', textAlign: 'center' }}>
        <Title level={1} className="dashboard_name">
          Hello <span>{data.username}!</span>
        </Title>
        <Title level={2}>Profil Settings:</Title>
        <Button
          type="primary"
          style={{ marginBottom: '20px' }}
          onClick={() => setIsUsernameModalVisible(true)}
        >
          Change Username
        </Button>

        <Title level={2}>Notebook Overview:</Title>
        <Button type="primary" onClick={goToNoteOverview}>
          Go to Note Overview
        </Button>
      </Content>
      <Modal
        title="Change Username"
        open={isUsernameModalVisible}
        onOk={handleUsernameChange}
        onCancel={() => setIsUsernameModalVisible(false)}
        okText="Change"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter new username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </Modal>
    </Layout>
  );
}

export default Dashboard;