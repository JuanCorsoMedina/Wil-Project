// src/components/About.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const About = () => {
  return (
    <div className="container my-5">
      <div className="about-section p-5 shadow-lg rounded" style={{ backgroundColor: '#ffffff' }}>
        <h2 className="text-center mb-4">About Us</h2>
        <p>
          Our Face Detection Security System provides advanced solutions for secure and convenient access control using facial recognition technology.
          It’s ideal for securing homes, offices, and large facilities with real-time monitoring and customizable access controls.
        </p>
        <p>
          We prioritize security and convenience, offering integration features like email alerts and comprehensive access logs for utmost safety.
        </p>
        <h4 className="mt-4">Why Choose Us?</h4>
        <ul className="mt-3">
          <li>Advanced facial recognition technology</li>
          <li>Real-time monitoring and instant notifications</li>
          <li>Scalable solutions for various applications</li>
          <li>User-friendly and intuitive interface</li>
        </ul>
        <hr className="my-4" />
        <h5 className="text-center mb-3">Connect with us on Social Media</h5>
        <div className="d-flex justify-content-center">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="mx-3">
            <FontAwesomeIcon icon={faFacebook} size="2x" style={{ color: '#4267B2' }} />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="mx-3">
            <FontAwesomeIcon icon={faTwitter} size="2x" style={{ color: '#1DA1F2' }} />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="mx-3">
            <FontAwesomeIcon icon={faLinkedin} size="2x" style={{ color: '#2867B2' }} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
