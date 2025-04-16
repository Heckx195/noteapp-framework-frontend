import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, message, Modal, Input } from 'antd';
import axiosInstance from '../tools/axiosInstance';
import '../css/NotebookPreview.css';

const { Title, Text } = Typography;

const NotebookPreview = ({ notebook, refreshNotebooks }) => {
  const [noteCount, setNoteCount] = useState(0);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    getNoteCount();
  }, [notebook]);

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/notebooks/${notebook.id}`);
      if (response.status === 200) {
        message.success('Notebook deleted successfully!');
        refreshNotebooks(); // Refresh the notebook list
      } else {
        message.error('Failed to delete the notebook.');
      }
    } catch (error) {
      console.error('Error deleting notebook:', error);
      message.error('An error occurred while deleting the notebook.');
    }
  };

  const handleRename = async () => {
    try {
      const response = await axiosInstance.put(`/notebooks/${notebook.id}`, { name: newName });
      if (response.status === 200) {
        message.success('Notebook renamed successfully!');
        refreshNotebooks(); // Refresh the notebook list
        setIsRenameModalVisible(false);
      } else {
        message.error('Failed to rename the notebook.');
      }
    } catch (error) {
      console.error('Error renaming notebook:', error);
      message.error('An error occurred while renaming the notebook.');
    }
  };

  const getNoteCount = async () => {
    try {
      const response = await axiosInstance.get(`/notebookscount/${notebook.id}`);
      setNoteCount(response.data.note_count);
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch note count.');
    }
  };

  return (
    <>
      <Card
        hoverable
        className="notebook-card notebook-card-body"
      >
        <Title level={4} className="notebook-title">
          {notebook.name}
        </Title>
        <Text className="notebook-text">
          <strong>Notes:</strong> {noteCount || 0}
        </Text>
        <Button
          type="default"
          className="notebook-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsRenameModalVisible(true);
          }}
        >
          Rename
        </Button>
        <Button
          type="primary"
          danger
          className="notebook-button"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          Delete
        </Button>
      </Card>

      <Modal
        title="Rename Notebook"
        open={isRenameModalVisible}
        onOk={(e) => {
          e.stopPropagation();
          handleRename;
        }}
        onCancel={(e) => {
          e.stopPropagation();
          setIsRenameModalVisible(false);
        }}
      >
        <Input
          placeholder="Enter new notebook name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default NotebookPreview;
