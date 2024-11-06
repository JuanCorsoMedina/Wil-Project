// src/components/FaceDetection.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000', {
  reconnectionAttempts: 5, // Retry connection 5 times
  timeout: 5000,           // Set a 5 second timeout for connection attempts
});

const FaceDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [detectedRole, setDetectedRole] = useState("No face detected yet.");
  const [error, setError] = useState(null); // New state for error handling

  useEffect(() => {
    // Handle socket connection errors
    socket.on('connect_error', (err) => {
      setError("Unable to connect to the server. Please try again later.");
      console.error("Socket connection error:", err);
    });

    socket.on('video_frame', (data) => {
      setVideoSrc(`data:image/jpeg;base64,${data.frame}`);
      if (data.roles && data.roles.length > 0) {
        setDetectedRole(data.roles.join(', '));
      }
    });

    socket.on('stop_detection', () => {
      setIsDetecting(false);
      setDetectedRole("Detection stopped.");
    });

    return () => {
      socket.off('connect_error');
      socket.off('video_frame');
      socket.off('stop_detection');
    };
  }, []);

  const startDetection = () => {
    setError(null); // Reset error state before attempting to start detection
    socket.emit('start_live_detection');
    setIsDetecting(true);
  };

  const stopDetection = () => {
    socket.emit('stop_live_detection');
    setIsDetecting(false); // Update detection state after stopping
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Face Detection Control</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="mt-4">
        {!isDetecting ? (
          <button onClick={startDetection} className="btn btn-success">
            Start Detection
          </button>
        ) : (
          <button onClick={stopDetection} className="btn btn-danger">
            Stop Detection
          </button>
        )}
      </div>
      <div className="mt-3">
        <h4>Live Video Feed:</h4>
        {videoSrc ? (
          <img src={videoSrc} alt="Live Video Feed" style={{ width: '80%', height: 'auto', border: '2px solid #ccc' }} />
        ) : (
          <p>No video feed available</p>
        )}
      </div>
      <div className="mt-3">
        <h4>Detected Role:</h4>
        <p>{detectedRole}</p>
      </div>
    </div>
  );
};

export default FaceDetection;
