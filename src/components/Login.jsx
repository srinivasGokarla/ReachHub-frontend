import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
const Login = () => {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigation('/dashboard');
    }
  }, [navigation]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://backend-uvlx.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        alert('Invalid credentials');
        throw new Error('Invalid credentials');
      }
      const data = await response.json();
      const { token, userId } = data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      alert('Login successfully');
      navigation('/dashboard');
    } catch (error) {
      console.error('Error:', error.message);
      alert('Invalid credentials');
    }
  };

  return (
    <>
     <h2>User Login</h2>
    <div className='login'>
     
      <form className="container" onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/signup">Sign up here</a>.
        </p>
      </form>
    </div>
    </>
  );
};

export default Login;
