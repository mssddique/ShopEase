import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
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
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
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

  const fallback = '/images/no-image.svg';

  return (
    <div className={`se-product${hasStock ? '' : ' is-out'}`}>
      <div className="se-product-media">
        <Link to={`/products/${id}`} className="d-block h-100" aria-label={name}>
          <img
            src={image_url || fallback}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallback;
            }}
            alt={name}
            loading="lazy"
          />
        </Link>

        {sale_price && <span className="se-flag">-{discount}%</span>}
        {!hasStock && <span className="se-soldout">Sold out</span>}

        <button
          type="button"
          className={`se-wish${isInWishlist ? ' is-on' : ''}`}
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isInWishlist}
        >
          <i className={`bi ${isInWishlist ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
      </div>

      <div className="se-product-body">
        <span className="se-product-brand">{brand?.name || category?.name || ''}</span>
        <Link to={`/products/${id}`}>
          <h3 className="se-product-name text-truncate-2">{name}</h3>
        </Link>

        <div className="se-price-row">
          {sale_price ? (
            <>
              <span className="se-price is-sale">${sale_price}</span>
              <span className="se-price-old">${price}</span>
            </>
          ) : (
            <span className="se-price">${price}</span>
          )}
        </div>

        <button
          className="btn btn-primary btn-sm w-100"
          disabled={!hasStock || adding}
          onClick={handleAddToCart}
        >
          {adding ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
              Adding
            </>
          ) : justAdded ? (
            <>
              <i className="bi bi-check2 me-1"></i>Added
            </>
          ) : hasStock ? (
            <>
              <i className="bi bi-bag-plus me-1"></i>Add to cart
            </>
          ) : (
            'Sold out'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
