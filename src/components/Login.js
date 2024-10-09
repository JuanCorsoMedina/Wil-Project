// src/components/Login.js
import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Enter your username" 
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Enter your password" 
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
