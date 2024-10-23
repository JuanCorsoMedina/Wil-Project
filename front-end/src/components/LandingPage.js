// src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaUserPlus, FaHistory, FaCamera } from 'react-icons/fa'; // Importing icons
// import './LandingPage.css'; // Import CSS

const LandingPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Welcome to the Face Detection Security System</h1>
      <div className="row justify-content-center">
        {/* Card for User Profile */}
        <div className="col-md-3 col-sm-6 mb-4">
          <div className="card text-center shadow-sm card-hover">
            <div className="card-body">
              <FaUserCircle size={50} className="mb-3 icon-hover" />
              <h5 className="card-title">User Profile</h5>
              <p className="card-text">View and edit your profile information.</p>
              <Link to="/profile" className="btn btn-primary">Go to Profile</Link>
            </div>
          </div>
        </div>

        {/* Card for Add Users & Access Roles */}
        <div className="col-md-3 col-sm-6 mb-4">
          <div className="card text-center shadow-sm card-hover">
            <div className="card-body">
              <FaUserPlus size={50} className="mb-3 icon-hover" />
              <h5 className="card-title">Add Users & Access Roles</h5>
              <p className="card-text">Manage user access and roles.</p>
              <Link to="/add-user-roles" className="btn btn-primary">Add Users</Link>
            </div>
          </div>
        </div>

        {/* Card for Access Logs & History */}
        <div className="col-md-3 col-sm-6 mb-4">
          <div className="card text-center shadow-sm card-hover">
            <div className="card-body">
              <FaHistory size={50} className="mb-3 icon-hover" />
              <h5 className="card-title">Access Logs & History</h5>
              <p className="card-text">View logs and history of access attempts.</p>
              <Link to="/access-logs" className="btn btn-primary">View Logs</Link>
            </div>
          </div>
        </div>

        {/* Card for Start Face Detection */}
        <div className="col-md-3 col-sm-6 mb-4">
          <div className="card text-center shadow-sm card-hover">
            <div className="card-body">
              <FaCamera size={50} className="mb-3 icon-hover" />
              <h5 className="card-title">Start Face Detection</h5>
              <p className="card-text">Begin real-time face detection.</p>
              <Link to="/face-detection" className="btn btn-primary">Start Detection</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
