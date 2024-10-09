// src/components/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
    } else {
      setError('');
      // Perform login logic here
      console.log('Login submitted:', { username, password });
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-4">Login</button>
          <div className="text-center mt-3">
            <small>Forgot Password? <Link to="/forgot-password" className="no-underline">Reset Password</Link></small>
          </div>
          <div className="text-center mt-3">
            <small>Don't have an account? <Link to="/signup" className="no-underline">Sign Up</Link></small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
