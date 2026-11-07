import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import Loading from '../../components/common/Loading';
import ProductCard from '../../components/common/ProductCard';

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [processing, setProcessing] = useState(false);

  const handleRemove = async (productId) => {
    setProcessing(true);
    await removeFromWishlist(productId);
    setProcessing(false);
  };

  const handleAddToCart = async (productId) => {
    setProcessing(true);
    const result = await addToCart(productId, 1);
    if (result.success) {
      alert(result.message);
      // Optionally remove from wishlist after adding to cart
      // await removeFromWishlist(productId);
    } else {
      alert(result.message);
    }
    setProcessing(false);
  };

  if (loading) {
    return <Loading message="Loading wishlist..." />;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-heart fs-1 text-muted"></i>
        <h4 className="mt-3">Your wishlist is empty</h4>
        <p className="text-muted">Start adding your favorite products!</p>
        <Link to="/products" className="btn btn-primary mt-3">
          <i className="bi bi-arrow-left me-2"></i>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Wishlist</h2>
        <span className="text-muted">{wishlistItems.length} items</span>
      </div>

      <div className="row g-3">
        {wishlistItems.map((item) => {
          const product = item.product || item;
          const isInWishlist = true;

          return (
            <div key={item.id || product.id} className="col-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image_url || '/images/no-image.svg'}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/no-image.svg';
                      }}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </Link>
                  <button
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                    onClick={() => handleRemove(product.id)}
                    disabled={processing}
                    style={{ width: '32px', height: '32px', padding: 0 }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <div className="card-body d-flex flex-column">
                  <Link to={`/products/${product.id}`} className="text-decoration-none">
                    <h6 className="card-title text-dark text-truncate-2">{product.name}</h6>
                  </Link>

                  <div className="mt-auto">
                    <div className="d-flex align-items-center gap-2">
                      {product.sale_price ? (
                        <>
                          <span className="text-danger fw-bold">${product.sale_price}</span>
                          <span className="text-muted text-decoration-line-through small">${product.price}</span>
                        </>
                      ) : (
                        <span className="fw-bold">${product.price}</span>
                      )}
                    </div>

                    <div className="mt-2 d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm flex-grow-1"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={processing || product.stock === 0}
                      >
                        <i className="bi bi-cart-plus me-1"></i>
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      <Link
                        to={`/products/${product.id}`}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <i className="bi bi-eye"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;