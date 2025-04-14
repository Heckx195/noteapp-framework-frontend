import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, List, Input, Button, message, Modal } from 'antd';
import axiosInstance from '../tools/axiosInstance';
import '../css/NotebookEditor.css';
import NoteAppHeader from '../components/NoteAppHeader';

const { Sider, Content } = Layout;
const { Title } = Typography;

function NotebookEditor() {
  const { id: notebookId } = useParams();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get(`/notes/${notebookId}`);
      console.log("Received notes:", response.data.data)
      setNotes(response.data.data);
    } catch (error) {
      console.error('Error fetching notes: ', error);
      message.error('Failed to load notes.');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [notebookId]);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  const handleSave = async () => {
    if (!selectedNote) {
      message.error('No note selected.');
      return;
    }

    try {
      await axiosInstance.put(
        `/notes/${selectedNote.id}`,
        {
          title: noteTitle,
          content: noteContent,
          notebook_Id: Number(notebookId)
        }
      );
      message.success('Note updated successfully!');
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === selectedNote.id
            ? { ...note, title: noteTitle, content: noteContent }
            : note
        )
      );
    } catch (error) {
      console.error('Error updating note:', error);
      message.error('Failed to update note.');
    }
  };

  const showCreateNoteModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) {
      message.error('Note title cannot be empty!');
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/notes`,
        {
          title: newNoteTitle,
          content: 'Empty',
          notebook_Id: Number(notebookId)
        }
      );
      setNotes((prevNotes) => (Array.isArray(prevNotes) ? [...prevNotes, response.data] : [response.data]));
      message.success('Note created successfully!');
      setIsModalVisible(false);
      setNewNoteTitle('');

      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
      message.error('Failed to create note.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewNoteTitle('');
  };

  return (
    <>
      <NoteAppHeader title="Notebook Editor" className="note-app-header" />
      <Layout className="notebook-editor">
        <Sider width={300} className="note-list-sider">
          <Button
            type="primary"
            style={{ marginBottom: '10px', width: '100%' }}
            onClick={showCreateNoteModal}
          >
            Create New Note
          </Button>
          <List
            header={<Title level={3}>Notes:</Title>}
            bordered
            dataSource={notes}
            renderItem={(note) => (
              <List.Item
                onClick={() => handleNoteSelect(note)}
                className="note-item"
              >
                {note.title}
              </List.Item>
            )}
          />
        </Sider>
        <Content className="note-content">
          {selectedNote ? (
            <>
              <Input
                placeholder="Note Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <Input.TextArea
                rows={15}
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <div>Select a note to view and edit its content.</div>
          )}
        </Content>

        <Modal
          title="Create New Note"
          open={isModalVisible}
          onOk={handleCreateNote}
          onCancel={handleCancel}
          okText="Create"
          cancelText="Cancel"
        >
          <Input
            placeholder="Enter note title"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
          />
        </Modal>
      </Layout>
    </>
  );
}

export default NotebookEditor;
