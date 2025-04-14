import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Layout, Typography } from 'antd';
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
      console.log("Error: Redirect to / because of empty cookieInfo")
      navigate('/');
    }

    getUserDetails();
  }, []);

  const goToNoteOverview = () => {
    navigate('/notebookoverview');
  };

  return (
    <Layout className="main">
      <NoteAppHeader title="Dashboard" />
      <Content style={{ padding: '20px', textAlign: 'center' }}>
        <Title level={1} className="dashboard_name">
          Hello <span>{data.username}!</span>
        </Title>
        <Title level={2}>Notebook Overview:</Title>
        <Button type="primary" onClick={goToNoteOverview}>
          Go to Note Overview
        </Button>
      </Content>
    </Layout>
  );
}

export default Dashboard;
