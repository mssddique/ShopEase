import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const {
    id,
    name,
    price,
    sale_price,
    stock,
    image_url,
    brand,
    category
  } = product;

  const discount = sale_price ? Math.round(((price - sale_price) / price) * 100) : 0;
  const hasStock = stock > 0;
  const isInWishlist = wishlistItems.some(item => item.id === id || item.product_id === id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!hasStock || adding) return;
    
    setAdding(true);
    const result = await addToCart(id, 1);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
    setAdding(false);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (wishlistLoading) return;
    
    setWishlistLoading(true);
    let result;
    if (isInWishlist) {
      result = await removeFromWishlist(id);
    } else {
      result = await addToWishlist(id);
    }
    if (!result.success) {
      alert(result.message);
    }
    setWishlistLoading(false);
  };

  return (
    <div className="card h-100 shadow-sm hover-shadow">
      <div className="position-relative">
        <Link to={`/products/${id}`}>
          <img
            //  src={ product.image ? `http://127.0.0.1:8000/storage/${product.image}`: '/no-image.png'}
            src={image_url || 'https://via.placeholder.com/300x300/eee/999?text=No+Image'}
            // onError={(e) => {
            //   e.target.src = 'https://via.placeholder.com/300x300/eee/999?text=No+Image';
            // }}
            className="card-img-top"
            alt={name}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        </Link>

        {sale_price && (
          <span className="badge bg-danger position-absolute top-0 end-0 m-2">
            -{discount}%
          </span>
        )}

        <span className={`badge ${hasStock ? 'bg-success' : 'bg-danger'} position-absolute bottom-0 start-0 m-2`}>
          {hasStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small className="text-muted">{brand?.name || 'No Brand'}</small>
          <small className="text-muted">{category?.name || 'No Category'}</small>
        </div>

        <Link to={`/products/${id}`} className="text-decoration-none">
          <h6 className="card-title text-dark text-truncate-2">{name}</h6>
        </Link>

        <div className="mt-auto">
          <div className="d-flex align-items-center gap-2">
            {sale_price ? (
              <>
                <span className="text-danger fw-bold fs-5">${sale_price}</span>
                <span className="text-muted text-decoration-line-through">${price}</span>
              </>
            ) : (
              <span className="fw-bold fs-5">${price}</span>
            )}
          </div>

          <div className="mt-2 d-flex gap-2">
            <button
              className="btn btn-primary btn-sm flex-grow-1"
              disabled={!hasStock || adding}
              onClick={handleAddToCart}
            >
              {adding ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1"></span>
                  Adding...
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus me-1"></i>
                  {hasStock ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </button>
            <button
              className={`btn btn-sm ${isInWishlist ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              <i className={`bi ${isInWishlist ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            </button>
          </div>

          <Link
            to={`/products/${id}`}
            className="btn btn-outline-secondary btn-sm w-100 mt-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;