import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import CartIcon from './CartIcon';

const navClass = ({ isActive }) => `se-nav-link nav-link${isActive ? ' active' : ''}`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const initial = (user?.name || 'U').trim().charAt(0).toUpperCase();

  return (
    <header className="se-header">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="se-brand" to="/">
            <span className="se-brand-mark"><i className="bi bi-bag-check-fill"></i></span>
            ShopEase
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-lg-3 me-auto mb-2 mb-lg-0 gap-lg-1">
              <li className="nav-item"><NavLink end className={navClass} to="/">Home</NavLink></li>
              <li className="nav-item"><NavLink className={navClass} to="/products">Shop</NavLink></li>
              <li className="nav-item"><NavLink className={navClass} to="/categories">Categories</NavLink></li>
              <li className="nav-item"><NavLink className={navClass} to="/brands">Brands</NavLink></li>
            </ul>

            <form className="se-search me-lg-2" onSubmit={handleSearch} role="search">
              <i className="bi bi-search"></i>
              <input
                className="form-control"
                type="search"
                placeholder="Search products"
                aria-label="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="d-flex align-items-center gap-1">
              <Link className="se-icon-btn" to="/wishlist" aria-label={`Wishlist, ${wishlistCount} items`}>
                <i className="bi bi-heart"></i>
                {wishlistCount > 0 && <span className="se-count">{wishlistCount}</span>}
              </Link>
              <CartIcon />

              {isAuthenticated ? (
                <div className="dropdown ms-1">
                  <button
                    className="se-user-btn dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="se-avatar">{initial}</span>
                    <span className="d-none d-xl-inline">{user?.name || 'Account'}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>Profile</Link></li>
                    <li><Link className="dropdown-item" to="/orders"><i className="bi bi-box-seam me-2"></i>Orders</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Log out
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex gap-2 ms-2">
                  <Link className="btn btn-outline-secondary btn-sm" to="/login">Log in</Link>
                  <Link className="btn btn-primary btn-sm" to="/register">Sign up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
