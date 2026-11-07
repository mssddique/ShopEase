import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', icon: 'bi-speedometer2', end: true },
  { to: '/admin/products', label: 'Products', icon: 'bi-box-seam' },
  { to: '/admin/categories', label: 'Categories', icon: 'bi-grid' },
  { to: '/admin/brands', label: 'Brands', icon: 'bi-award' },
  { to: '/admin/customers', label: 'Customers', icon: 'bi-people' },
  { to: '/admin/orders', label: 'Orders', icon: 'bi-receipt' },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="se-admin-sidebar">
      <Link className="se-brand" to="/admin">
        <span className="se-brand-mark"><i className="bi bi-bag-check-fill"></i></span>
        ShopEase
      </Link>
      <div className="sub">Admin panel</div>
      <nav className="d-flex flex-column gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `se-admin-link${isActive ? ' active' : ''}`}
          >
            <i className={`bi ${l.icon}`}></i>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <button className="btn btn-outline-light w-100 mt-4" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-2"></i>Log out
      </button>
    </aside>
  );
};

export default AdminSidebar;
