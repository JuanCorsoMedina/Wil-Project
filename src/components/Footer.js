// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-3">
      <div className="container text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} Face Detection Security System. All rights reserved.</p>
        <p className="small">
          <a href="/privacy-policy" className="text-light mr-3">Privacy Policy</a> | 
          <a href="/terms-of-service" className="text-light ml-3">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
