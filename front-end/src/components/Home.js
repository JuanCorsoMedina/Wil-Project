// src/components/Home.js
import React from "react";

const Home = () => {
  return (
    <div className="hero-section">
      <div className="hero-content text-center text-dark">
        <h1 className="display-3 mb-4">
          Welcome to the Face Detection Security System
        </h1>
        <p className="lead mb-4">
          Enhancing security with cutting-edge facial recognition technology.
        </p>
        <a className="btn btn-accent btn-lg mr-3" href="/signup" role="button">
          Get Started
        </a>
        <a className="btn btn-outline-dark btn-lg" href="/login" role="button">
          Login
        </a>
      </div>
    </div>
  );
};

export default Home;
