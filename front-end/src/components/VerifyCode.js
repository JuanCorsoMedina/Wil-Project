// src/components/VerifyCode.js
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyCode = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword || !verificationCode) {
      setError('Please fill in all fields');
    } else if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
    } else {
      setError('');
      try {
        const response = await axios.post('http://127.0.0.1:5000/reset-password', {
          email,
          verification_code: verificationCode,
          new_password: newPassword
        });
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data.message);
        } else {
          setError('An error occurred during password reset. Please try again.');
        }
      }
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}>
        <h2 className="text-center mb-4">Verify Code & Reset Password</h2>
        {message && <div className="alert alert-info">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              type="text"
              className="form-control"
              id="verificationCode"
              placeholder="Enter the code you received"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-4">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;
