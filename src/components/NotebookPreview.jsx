import React from 'react';
import { Card } from 'antd';

const NotebookPreview = ({ notebook }) => {
  return (
    <Card>
      <p>My preview of notebook: {notebook.name}</p>
    </Card>
  );
};

export default NotebookPreview;
