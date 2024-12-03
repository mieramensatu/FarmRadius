import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

function Footer() {
  return (
    <>
      <footer className="footer">
        <p>&copy; 2024 AyamTernakKu. All rights reserved.</p>
        <div className="social-media">
          <Link to="/" className="link">
            <i><Facebook/></i>
          </Link>
          <Link to="/" className="link">
            <i><Twitter/></i>
          </Link>
          <Link to="/" className="link">
            <i><Instagram/></i>
          </Link>
          <Link to="/" className="link">
            <i><Linkedin/></i>
          </Link>
        </div>
      </footer>
    </>
  );
}

export default Footer;
