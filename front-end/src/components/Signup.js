// src/components/Signup.js
import React, { useState } from 'react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      // Perform signup logic here
      console.log('Signup submitted:', { username, email, password });
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px', backgroundColor: '#ffffff' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Choose a username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Create a password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="confirmPassword" 
              placeholder="Confirm your password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
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
