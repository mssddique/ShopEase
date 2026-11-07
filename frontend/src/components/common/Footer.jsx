import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="se-footer mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <Link className="se-brand mb-3" to="/">
              <span className="se-brand-mark"><i className="bi bi-bag-check-fill"></i></span>
              ShopEase
            </Link>
            <p className="mb-0" style={{ maxWidth: '34ch' }}>
              Browse by category or brand, save what you like, and check out securely.
            </p>
          </div>
          <div className="col-6 col-md-3 offset-md-1">
            <h5>Shop</h5>
            <ul>
              <li><Link to="/products">All products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/brands">Brands</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h5>Contact</h5>
            <ul>
              <li>info@shopease.com</li>
              <li>+1 234 567 890</li>
            </ul>
          </div>
        </div>
        <div className="se-footer-bottom">
          &copy; 2026 ShopEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
