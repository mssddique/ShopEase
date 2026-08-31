import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="bg-dark text-white vh-100 p-3 position-fixed" style={{ width: '250px' }}>
      <h4 className="mb-4">Admin Panel</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/admin">
            Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/admin/products">
            Products
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/admin/categories">
            Categories
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/admin/brands">
            Brands
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/admin/customers">
            Customers
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/admin/orders">
            Orders
          </Link>
        </li>
        <li className="nav-item mt-4">
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;