import React from 'react';
import { Link } from 'react-router-dom';

const Brand = () => (
  <Link className="se-brand" to="/">
    <span className="se-brand-mark"><i className="bi bi-bag-check-fill"></i></span>
    ShopEase
  </Link>
);

const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="se-auth">
    <aside className="se-auth-side">
      <Brand />
      <div>
        <h2>Shopping that stays out of your way.</h2>
        <p>Save favourites, track orders and check out in a few taps.</p>
      </div>
      <small style={{ color: '#a9b8af' }}>&copy; 2026 ShopEase</small>
    </aside>
    <main className="se-auth-main">
      <div className="se-auth-form">
        <div className="se-auth-mobile-brand"><Brand /></div>
        <h1>{title}</h1>
        <p className="sub">{subtitle}</p>
        {children}
        <p className="text-center mt-4 mb-0">{footer}</p>
      </div>
    </main>
  </div>
);

export default AuthShell;
