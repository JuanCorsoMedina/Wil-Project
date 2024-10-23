import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        setError('Failed to load profile. Please try again later.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token on logout
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true); // Allow user to edit profile information
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://127.0.0.1:5000/update-profile',
        { username, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile. Please try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">User Profile</h2>
      <div className="card mt-4 p-4 shadow-lg">
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            disabled={!isEditing}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group mt-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            disabled={!isEditing}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {isEditing ? (
          <button onClick={handleSave} className="btn btn-success mt-4">Save Changes</button>
        ) : (
          <button onClick={handleEdit} className="btn btn-primary mt-4">Edit Profile</button>
        )}

        <button onClick={handleLogout} className="btn btn-danger mt-4 ms-3">Logout</button>
      </div>
    </div>
  );
};

export default UserProfile;
