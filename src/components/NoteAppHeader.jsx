import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Layout, Typography } from 'antd';
import axiosInstance from '../tools/axiosInstance';
import '../css/NoteAppHeader.css';

const { Header } = Layout;
const { Title } = Typography;

const NoteAppHeader = ({ title }) => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const cookieInfo = Cookies.get('refresh_token');
      
      if (!cookieInfo) navigate('/');

      await axiosInstance.post('/logout', {
        refreshToken: cookieInfo.refreshToken,
      });
      toast.success('Logged Out Successfully');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Something Went Wrong!');
    }
  };

  const goToHome = () => {
    navigate('/dashboard');
  };

  const goToNotebookOverview = () => {
    navigate('/notebookoverview');
  }

  return (
    <Header className="note-app-header">
      <Title level={2} className="note-app-title" style={{ color: 'white' }}>{title}</Title>
      <div>
        <Button
          type="default"
          onClick={goToHome}
          style={{ marginRight: '10px' }}
        >
          Dashboard
        </Button>
        <Button
          type="default"
          onClick={goToNotebookOverview}
          style={{ marginRight: '10px' }}
        >
          Notebook Overview
        </Button>
        <Button
          type="primary"
          danger
          onClick={handleLogOut}
          className="footer_signout_btn"
        >
          Log Out
        </Button>
      </div>
    </Header>
  );
};

export default NoteAppHeader;
