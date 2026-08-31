import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <Link className="nav-link text-white position-relative" to="/cart">
      <i className="bi bi-cart"></i> Cart
      {cartCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;