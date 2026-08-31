import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { useCart } from '../../context/CartContext';
import Loading from '../../components/common/Loading';
import ProductCard from '../../components/common/ProductCard';
import { useWishlist } from '../../context/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const isInWishlist = wishlistItems.some(item => item.id === product?.id || item.product_id === product?.id);
  

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProduct(id);
        const data = response.data.data;
        setProduct(data);
        
        if (data.image_url) {
          setSelectedImage(data.image_url);
        }

        if (data.category_id) {
          const relatedRes = await productApi.getProducts({
            category: data.category_id,
            limit: 4,
            exclude: id,
          });
          setRelatedProducts(relatedRes.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    const result = await addToCart(product.id, quantity);
    setAddingToCart(false);
    
    if (result.success) {
      navigate('/checkout');
    } else {
      alert(result.message);
    }
  };

  const handleWishlistToggle = async () => {
  if (!product || wishlistLoading) return;
  
  setWishlistLoading(true);
  let result;
  if (isInWishlist) {
    result = await removeFromWishlist(product.id);
  } else {
    result = await addToWishlist(product.id);
  }
  if (!result.success) {
    alert(result.message);
  }
  setWishlistLoading(false);
};

  if (loading) {
    return <Loading message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="text-center py-5">
        <h4>Product not found</h4>
        <Link to="/products" className="btn btn-primary mt-3">
          Back to Products
        </Link>
      </div>
    );
  }

  const hasStock = product.stock > 0;
  const discount = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100) 
    : 0;

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          {product.category && (
            <li className="breadcrumb-item">
              <Link to={`/categories/${product.category_id}`}>
                {product.category.name}
              </Link>
            </li>
          )}
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product Main Section */}
      <div className="row g-4 mb-5">
        {/* Images */}
        <div className="col-md-6">
          <div className="card">
            <div className="position-relative">
              <img
                src={selectedImage || 'https://via.placeholder.com/600x600/eee/999?text=No+Image'}
                alt={product.name}
                className="img-fluid rounded"
                style={{ width: '100%', height: '400px', objectFit: 'contain' }}
              />
              {discount > 0 && (
                <span className="badge bg-danger position-absolute top-0 end-0 m-3 fs-6">
                  -{discount}%
                </span>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="d-flex gap-2 p-3 overflow-auto">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt="Main"
                  className={`img-thumbnail ${selectedImage === product.image_url ? 'border-primary' : ''}`}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => setSelectedImage(product.image_url)}
                />
              )}
              {product.images && product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`img-thumbnail ${selectedImage === image ? 'border-primary' : ''}`}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h2 className="mb-2">{product.name}</h2>
          
          <div className="mb-3">
            <span className="text-muted">Brand: </span>
            {product.brand ? (
              <Link to={`/brands/${product.brand_id}`} className="text-decoration-none">
                {product.brand.name}
              </Link>
            ) : (
              <span className="text-muted">No Brand</span>
            )}
            <span className="mx-2">|</span>
            <span className="text-muted">SKU: </span>
            <span>{product.sku || 'N/A'}</span>
          </div>

          <div className="mb-3">
            {product.sale_price ? (
              <>
                <span className="text-danger fw-bold fs-2">${product.sale_price}</span>
                <span className="text-muted text-decoration-line-through ms-2 fs-5">
                  ${product.price}
                </span>
                <span className="text-success ms-2">You save ${(product.price - product.sale_price).toFixed(2)}</span>
              </>
            ) : (
              <span className="fw-bold fs-2">${product.price}</span>
            )}
          </div>

          <div className="mb-3">
            <span className={`badge ${hasStock ? 'bg-success' : 'bg-danger'} fs-6 p-2`}>
              {hasStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <div className="mb-4">
            <h6>Description</h6>
            <p className="text-muted">{product.description || 'No description available.'}</p>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Quantity:</label>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <i className="bi bi-dash"></i>
              </button>
              <input
                type="number"
                className="form-control text-center"
                value={quantity}
                onChange={handleQuantityChange}
                style={{ width: '80px' }}
                min="1"
                max={product.stock || 10}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <i className="bi bi-plus"></i>
              </button>
              <span className="text-muted ms-2 small">
                Max: {product.stock || 0}
              </span>
            </div>
          </div>

          <div className="d-flex gap-2 mb-3 flex-wrap">
            <button
              className="btn btn-primary btn-lg flex-grow-1"
              onClick={handleAddToCart}
              disabled={!hasStock || addingToCart}
            >
              {addingToCart ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Adding...
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart
                </>
              )}
            </button>
            <button
              className="btn btn-success btn-lg"
              onClick={handleBuyNow}
              disabled={!hasStock || addingToCart}
            >
              <i className="bi bi-lightning me-2"></i>
              Buy Now
            </button>
            
             {/* Replace the wishlist button with: */}
            <button
            className={`btn ${isInWishlist ? 'btn-danger' : 'btn-outline-danger'} btn-lg`}
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            >
            <i className={`bi ${isInWishlist ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            {isInWishlist ? ' Remove from Wishlist' : ' Add to Wishlist'}
            </button>
          </div>

          <div className="border-top pt-3 mt-3">
            <small className="text-muted d-block">
              <i className="bi bi-shield-check me-1"></i>
              Secure transaction
            </small>
            <small className="text-muted d-block">
              <i className="bi bi-truck me-1"></i>
              Free shipping on orders over $50
            </small>
            <small className="text-muted d-block">
              <i className="bi bi-arrow-repeat me-1"></i>
              30-day return policy
            </small>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h3 className="mb-3">Related Products</h3>
          <div className="row g-3">
            {relatedProducts.map(product => (
              <div key={product.id} className="col-6 col-md-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails; 