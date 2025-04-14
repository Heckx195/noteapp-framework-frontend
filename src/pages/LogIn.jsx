import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../tools/axiosInstance';

function LogIn() {
  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/login', data);
      setData({ username: '', password: '' });
      toast.success('Logged In Successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <main className="main">
      <form className="content" onSubmit={handleSubmit}>
        <h1 className="heading">Welcome Back</h1>
        <input
          type="text"
          className="input"
          placeholder="username"
          name="username"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="input"
          placeholder="password"
          name="password"
          onChange={handleChange}
          required
        />
        <button type="submit" className="login">
          Log In
        </button>
        <div className="footer_desc">
          <p>Not a member?</p>
          <Link to="/signup">
            <button type="button" className="footer_signup_btn">
              Sign up
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
}

export default LogIn;
