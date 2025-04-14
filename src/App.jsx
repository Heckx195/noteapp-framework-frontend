import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LogIn from './pages/LogIn';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import NotebookOverview from './pages/NotebookOverview';
import NotebookEditor from './pages/NotebookEditor';

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notebookoverview" element={<NotebookOverview />} />
          <Route path="/notebookeditor/:id" element={<NotebookEditor />} />
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </>
    </Router>
  );
}

export default App;