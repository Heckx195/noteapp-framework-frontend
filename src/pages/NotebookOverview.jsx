import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Typography, Layout, Spin, Button, Modal, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../tools/axiosInstance';
import '../css/NotebookOverview.css';
import NoteAppHeader from '../components/NoteAppHeader';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const NotebookPreview = lazy(() => import('../components/NotebookPreview'));

function NotebookOverview() {
  const [notebooks, setNotebooks] = useState([]);
  const [notebookCount, setNotebookCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotebooks();
    getNotebookCount();
  }, []);
  
  const fetchNotebooks = async () => {
    try {
      const response = await axiosInstance.get('/notebooks');
      const sortedNotebooks = response.data.data.sort((a, b) => a.id - b.id); // Sort by id
      setNotebooks(sortedNotebooks);
    } catch (error) {
      console.error('Error fetching notebooks:', error);
      message.error('Failed to load notebooks.');
    }
  };

  const showCreateNotebookModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateNotebook = async () => {
    if (!newNotebookName.trim()) {
      message.error('Notebook name cannot be empty!');
      return;
    }

    try {
      const response = await axiosInstance.post('/notebooks', {
        name: newNotebookName,
      });

      setNotebooks((prev) => (Array.isArray(prev) ? [...prev, response.data] : [response.data]));

      message.success('Notebook created successfully!');
      getNotebookCount(); // Refresh notebook count

      setIsModalVisible(false);
      setNewNotebookName('');
    } catch (error) {
      console.error('Error creating notebook:', error);
      message.error('Failed to create notebook.');
    }
  };

  const getNotebookCount = async () => {
    try {
      const response = await axiosInstance.get('/notebookscount/');
      setNotebookCount(response.data.notebook_count);
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch notebook count.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewNotebookName('');
  };

  const handleNotebookClick = (notebookId) => {
    navigate(`/notebookeditor/${notebookId}`);
  };

  return (
    <Layout className="main">
      <NoteAppHeader title="Notebook Overview" />
      <Content style={{ padding: '20px', textAlign: 'center' }}>
        <Title level={1}>Notebook Overview</Title>
        <Paragraph className='notebook-count'>
          Notebook Count: {notebookCount}
        </Paragraph>
        <Button
          type="primary"
          style={{ marginBottom: '20px' }}
          onClick={showCreateNotebookModal}
        >
          Create New Notebook
        </Button>
        <Suspense fallback={<Spin size="large" />}>
          {notebooks?.length > 0 ? (
            <div className="notebooks-container">
              {notebooks.map((notebook) => (
                <NotebookPreview
                  key={notebook.id}
                  notebook={notebook}
                  onCardClick={() => handleNotebookClick(notebook.id)}
                  refreshNotebooks={fetchNotebooks}
                  refreshCounter={getNotebookCount}
                />
              ))}
            </div>
          ) : (
            <Paragraph>No notes available.</Paragraph>
          )}
        </Suspense>
      </Content>

      <Modal
        title="Create New Notebook"
        open={isModalVisible}
        onOk={handleCreateNotebook}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter notebook name"
          value={newNotebookName}
          onChange={(e) => setNewNotebookName(e.target.value)}
        />
      </Modal>
    </Layout>
  );
}

export default NotebookOverview;
