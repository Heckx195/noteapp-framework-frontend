import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../tools/axiosInstance';

function SignUp() {
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
      await axiosInstance.post('/register', data);
      setData({ username: '', password: '' });
      toast.success('Account Created Successfully');
      navigate('/login');
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <main className="main">
      <form className="content" onSubmit={handleSubmit}>
        <h1 className="heading">Create Account</h1>
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
        <button type="submit" className="signup_btn">
          Sign Up
        </button>
        <div className="footer_desc">
          <p>Already have an account</p>
          <Link to="/login">
            <button type="button" className="footer_login_btn">
              Login
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
}

export default SignUp;
