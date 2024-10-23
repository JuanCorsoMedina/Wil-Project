// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import ForgotPassword from './components/ForgotPassword';
import VerifyCode from './components/VerifyCode';
import FaceDetection from './components/FaceDetection'; // Import the component
import UserProfile from './components/UserProfile'; // Import the user profile component
import AddUserRoles from './components/AddUserRoles'; // Import AddUserRoles component
import AccessLogs from './components/AccessLogs'; // Import AccessLogs component
import LandingPage from './components/LandingPage'; // Import the LandingPage component

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-code" element={<VerifyCode />} />

            {/* Protected Routes */}
            <Route 
              path="/landing" 
              element={
                <ProtectedRoute>
                  <LandingPage /> {/* Landing page after successful login */}
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/face-detection" 
              element={
                <ProtectedRoute>
                  <FaceDetection />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-user-roles" 
              element={
                <ProtectedRoute>
                  <AddUserRoles />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/access-logs" 
              element={
                <ProtectedRoute>
                  <AccessLogs />
                </ProtectedRoute>
              } 
            />
            {/* Redirect all unknown routes to login for now */}
            <Route path="*" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
