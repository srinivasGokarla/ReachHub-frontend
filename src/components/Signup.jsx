import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
   
  });

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigation('/');
    }
  }, [navigation]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://reachhub-blig.onrender.com/register', formData);

      console.log(response.data);
      alert('Registration successfully');
      navigation('/');
    } catch (error) {
      if(error.response.status === 400) {
        alert('email or phone number already registered');
      }
     
      console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
    <h2>User Register form</h2>
   <div className='login'>
    <form className="container" onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>

      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>

      <label>
        Phone:
        <input type="phone" name="phone" value={formData.phone} onChange={handleChange} required />
      </label>

      <label>
        UserName:
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
      </label>

      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </label>

   

      <button type="submit">Register</button>
      <p>
        If you have an account? <a href="/">Login here</a>.
      </p>
    </form>
    </div>
    </>
  );
};

export default Signup;

