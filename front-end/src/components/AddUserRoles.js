import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddUserRoles = () => {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]); // State to store all users
  const [editingUserId, setEditingUserId] = useState(null); // State for user being edited

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data && response.data.users) {
          setUsers(response.data.users);
        } else {
          setError('No users found');
        }
      } catch (error) {
        setError('Failed to load users. Please try again later.');
      }
    };

    fetchUsers();
  }, []);

  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !role || !image) {
      setError('All fields are required');
      return;
    }
    setError(''); // Clear any previous errors

    const formData = new FormData();
    formData.append('user_name', userName);
    formData.append('role', role);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:5000/add-user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
      setUserName('');
      setRole('');
      setImage(null);

      // Refresh user list after adding
      if (response.data.new_user) {
        setUsers([...users, response.data.new_user]);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleEditRole = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:5000/edit-user/${userId}`, { role }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the role in the users list
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, role } : user
      );
      setUsers(updatedUsers);
      setEditingUserId(null);
      setRole('');
      setMessage('User role updated successfully.');
    } catch (error) {
      setError('Failed to update user role. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:5000/delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted user from the list
      setUsers(users.filter(user => user.id !== userId));
      setMessage('User deleted successfully.');
    } catch (error) {
      setError('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add User Roles</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            className="form-control"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="role">Role</label>
          <select
            className="form-control"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Team Member">Team Member</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Security Personnel">Security Personnel</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={handleImageUpload}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">Add User</button>
      </form>

      <hr className="mt-5" />

      <h2 className="mt-4">Manage Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Image</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              user && user.id ? (
                <tr key={user.id || index}>
                  <td>
                    {user.image_path ? (
                      <img
                        src={`http://127.0.0.1:5000/${user.image_path}`}
                        alt="User Image"
                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{user.user_name}</td>
                  <td>
                    {editingUserId === user.id ? (
                      <select
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="Team Member">Team Member</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Security Personnel">Security Personnel</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td>
                    {editingUserId === user.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleEditRole(user.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm ms-2"
                          onClick={() => setEditingUserId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setEditingUserId(user.id);
                            setRole(user.role); // Set the current role for editing
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td colSpan="4">Invalid user data</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AddUserRoles;
