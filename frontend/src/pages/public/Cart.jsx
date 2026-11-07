import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Loading from '../../components/common/Loading';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (itemId, currentQuantity, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    const result = await updateQuantity(itemId, newQuantity);
    if (!result.success) {
      alert(result.message);
    }
    setUpdating(false);
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      setUpdating(true);
      await removeFromCart(itemId);
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setUpdating(true);
      await clearCart();
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return <Loading message="Loading your cart..." />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-cart-x fs-1 text-muted"></i>
        <h4 className="mt-3">Your cart is empty</h4>
        <p className="text-muted">Looks like you haven't added any items yet.</p>
        <Link to="/products" className="btn btn-primary mt-3">
          <i className="bi bi-arrow-left me-2"></i>
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Calculate subtotal
  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const grandTotal = subtotal + shipping;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Shopping Cart</h2>
        <button 
          className="btn btn-outline-danger btn-sm"
          onClick={handleClearCart}
          disabled={updating}
        >
          <i className="bi bi-trash me-1"></i>
          Clear Cart
        </button>
      </div>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-0">
              {cartItems.map((item, index) => {
                const product = item.product || {};
                const price = Number(item.price) || 0;
                // const price = item.sale_price || item.price || product.sale_price || product.price || 0;
                const itemTotal = price * item.quantity;
                const image = product.image_url || '/images/no-image.svg';
                

                return (
                  <div key={item.id || index}>
                    <div className="d-flex p-3 align-items-center" style={{ borderBottom: index < cartItems.length - 1 ? '1px solid #eee' : 'none' }}>
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Link to={`/products/${product.id || item.product_id}`}>
                          <img
                            src={image}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/no-image.svg';
                            }}
                            alt={product.name || item.name}
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            className="rounded"
                          />
                        </Link>
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow-1 ms-3">
                        <Link to={`/products/${product.id || item.product_id}`} className="text-decoration-none">
                          <h6 className="mb-1 text-dark">{product.name || item.name}</h6>
                        </Link>
                        <div className="text-muted small">
                          {product.brand?.name || item.brand_name || 'No Brand'}
                        </div>
                        <div className="mt-1">
                          <span className="fw-bold">${price.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center gap-2 mx-3">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity, item.quantity - 1)}
                          disabled={updating || item.quantity <= 1}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity, item.quantity + 1)}
                          disabled={updating || (item.stock !== undefined && item.quantity >= item.stock)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-end me-3" style={{ minWidth: '80px' }}>
                        <span className="fw-bold">${itemTotal.toFixed(2)}</span>
                      </div>

                      {/* Remove Button */}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemove(item.id)}
                        disabled={updating}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-3">
            <Link to="/products" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Order Summary</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              {shipping > 0 && (
                <div className="text-success small mb-2">
                  <i className="bi bi-info-circle me-1"></i>
                  Free shipping on orders over $50
                </div>
              )}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-3">
                <h6>Grand Total</h6>
                <h6 className="text-primary">${grandTotal.toFixed(2)}</h6>
              </div>

              <button
                className="btn btn-primary w-100 btn-lg"
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || updating}
              >
                Proceed to Checkout
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;