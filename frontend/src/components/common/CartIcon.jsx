import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <Link className="se-icon-btn" to="/cart" aria-label={`Cart, ${cartCount} items`}>
      <i className="bi bi-bag"></i>
      {cartCount > 0 && <span className="se-count">{cartCount}</span>}
    </Link>
  );
};

export default CartIcon;
