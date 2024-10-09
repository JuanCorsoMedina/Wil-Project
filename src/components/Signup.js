// src/components/Signup.js
import React from 'react';

const Signup = () => {
  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px', backgroundColor: '#ffffff' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Choose a username" 
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              placeholder="Enter your email" 
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Create a password" 
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="confirmPassword" 
              placeholder="Confirm your password" 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-4">Sign Up</button>
          <div className="text-center mt-3">
            <small>Already have an account? <a href="/login">Login</a></small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
