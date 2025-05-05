import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, List, Input, Button, message, Modal, Pagination } from 'antd';
import axiosInstance from '../tools/axiosInstance';
import '../css/NotebookEditor.css';
import NoteAppHeader from '../components/NoteAppHeader';

const { Sider, Content } = Layout;
const { Title } = Typography;

function NotebookEditor() {
  const { id: notebookId } = useParams();
  const [notebookName, setNotebookName] = useState("ERROR")
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalNotes, setTotalNotes] = useState(0);

  const getNotebookName = async () => {
    try {
      const response = await axiosInstance.get(`/notebookname/${notebookId}`);
      setNotebookName(response.data.notebook_name);
    } catch (error) {
      console.error('Error deleting note:', error);
      message.error('Failed to delete note.');
    }
  };

  const fetchNotes = async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(`/notes/${notebookId}/pagination`, {
        params: { page, limit },
      });

      const sortedNotes = response.data.data.sort((a, b) => a.id - b.id);

      setNotes(sortedNotes);
      setTotalNotes(response.data.total);
    } catch (error) {
      console.error('Error fetching notes: ', error);
      message.error('Failed to load notes.');
    }
  };

  useEffect(() => {
    fetchNotes(currentPage, limit);
  }, [notebookId, currentPage, limit]);

  useEffect(() => {
    getNotebookName();
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
          notebook_Id: Number(notebookId),
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

  const handleDelete = async () => {
    if (!selectedNote) {
      message.error('No note selected.');
      return;
    }

    try {
      await axiosInstance.delete(`/notes/${selectedNote.id}`);
      message.success('Note deleted successfully!');
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== selectedNote.id));
      setSelectedNote(null);
      setNoteTitle('');
      setNoteContent('');
    } catch (error) {
      console.error('Error deleting note:', error);
      message.error('Failed to delete note.');
    }
  };

  const handleNotebookExport = async () => {
    try {
      const response = await axiosInstance.post(
        `/notebooks/${notebookId}/export`,
        {},
        { responseType: 'blob' }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Set the filename for the download
      link.setAttribute('download', `${notebookName || 'notebook'}.pdf`);
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up the URL object
      link.parentNode.removeChild(link)

      message.success('Notebook exported successfully!');
    } catch (error) {
      console.error('Error exporting notebook:', error);
      message.error('Failed to export notebook.');
    }
  };

  const handleNoteExport = async () => {
    if (!selectedNote) {
      message.error('No note selected.');
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/notes/${selectedNote.id}/export`,
        {},
        { responseType: 'blob' }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Set the filename for the download
      link.setAttribute('download', `${selectedNote.title || 'note'}.pdf`);
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up the URL object
      link.parentNode.removeChild(link)
      
      message.success('Note exported successfully!');
    } catch (error) {
      console.error('Error exporting note:', error);
      message.error('Failed to export note.');
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    if (!isNaN(newLimit) && newLimit > 0) {
      setLimit(newLimit);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <NoteAppHeader title="Notebook Editor" className="note-app-header" />
      <Layout className="notebook-editor">
        <Sider width={360} className="note-list-sider">
          <div className="button-container">
            <Button
              type="primary"
              className="export-notebook-button"
              onClick={() => handleNotebookExport()}
            >
              Export Notebook
            </Button>
            <Button
              type="primary"
              className="create-note-button"
              onClick={() => setIsModalVisible(true)}
            >
              Create New Note
            </Button>
          </div>
          <div className="pagination-container">
            <Input
              type="number"
              min="1"
              placeholder="Results per page"
              value={limit}
              onChange={handleLimitChange}
              className="results-per-page-input"
            />
            <Pagination
              current={currentPage}
              pageSize={limit}
              total={totalNotes}
              onChange={handlePageChange}
              className="pagination"
            />
          </div>
          <List
            header={<Title level={3}>Notebook <em>{notebookName}</em></Title>}
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
                className="note-title-input"
              />
              <Input.TextArea
                rows={15}
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="note-content-textarea"
              />
              <div className="button-group">
                <Button type="primary" onClick={handleSave}>
                  Save
                </Button>
                <Button type="primary" onClick={() => handleNoteExport()}>
                  Export
                </Button>
                <Button type="primary" danger onClick={() => handleDelete()}>
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <div>Select a note to view and edit its content.</div>
          )}
        </Content>

        <Modal
          title="Create New Note"
          open={isModalVisible}
          onOk={() => handleCreateNote()}
          onCancel={() => handleCancel()}
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
