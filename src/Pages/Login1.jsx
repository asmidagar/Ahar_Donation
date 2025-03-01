import React, { useState } from 'react';
import './CSS/Login1.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login1 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRestaurant, setIsRestaurant] = useState(false); // Toggle for restaurant login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Logging in with:', email, password);

    try {
      const endpoint = isRestaurant 
        ? 'http://localhost:5000/api/restaurant-login' 
        : 'http://localhost:3000/api/auth/login-user';
      
      const response = await axios.post(endpoint, { email, password });

      const { success, token, restaurant_id, redirectUrl, message } = response.data;
      
      if (response.status === 200) {
        toast.success(message || 'Login Successful');

        localStorage.setItem('token', token);
        if (restaurant_id) localStorage.setItem('restaurant_id', restaurant_id);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        navigate(redirectUrl || '/');
      } else {
        toast.error(message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <h1>Welcome to Ahar</h1>
        <p>Providing food to those in need.</p>
      </div>
      <div className="right-panel">
        <form onSubmit={handleSubmit} className="login-box">
          <h2>{isRestaurant ? 'Restaurant Login' : 'User Login'}</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="fas fa-user"></i>
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="fas fa-lock"></i>
          </div>
          <div className="options">
            <label>
              <input type="checkbox" onChange={() => setIsRestaurant(!isRestaurant)} /> Login as Restaurant
            </label>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login1;
