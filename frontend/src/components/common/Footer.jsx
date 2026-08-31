import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>ShopEase</h5>
            <p className="text-white">Your one-stop shop for all your needs.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/products" className="text-white text-decoration-none">Products</Link></li>
              <li><Link to="/categories" className="text-white text-decoration-none">Categories</Link></li>
              <li><Link to="/brands" className="text-white text-decoration-none">Brands</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contact</h5>
            <p className="text-white">Email: info@shopease.com</p>
            <p className="text-white">Phone: +1 234 567 890</p>
          </div>
        </div>
        <hr className="border-secondary" />
        <div className="text-center text-white">
          <small>&copy; 2026 ShopEase. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;