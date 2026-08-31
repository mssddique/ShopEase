import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';
import Loading from '../../components/common/Loading';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [featuredRes, latestRes, categoriesRes, brandsRes] = await Promise.all([
          productApi.getFeaturedProducts(),
          productApi.getLatestProducts(),
          categoryApi.getCategories(),
          brandApi.getBrands(),
        ]);

        setFeaturedProducts(featuredRes.data.data.data || []);
        setLatestProducts(latestRes.data.data.data || []);
        setCategories(categoriesRes.data.data.data || []);
        setBrands(brandsRes.data.data.data || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setError('Failed to load data. Please refresh the page.');
        setFeaturedProducts([]);
        setLatestProducts([]);
        setCategories([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <Loading message="Loading homepage..." />;
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center py-5">
        <i className="bi bi-exclamation-triangle fs-1"></i>
        <h4 className="mt-3">{error}</h4>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-light text-dark py-5 rounded-3 mb-4">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold">Welcome to ShopEase</h1>
            <p className="lead">Discover amazing products at the best prices.</p>
            <Link to="/products" className="btn btn-light btn-lg">
              Start Shopping <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="col-lg-6 text-center">
            <i className="bi bi-bag fs-1"></i>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Shop by Categories</h2>
            <Link to="/categories" className="btn btn-outline-primary btn-sm">
              View All
            </Link>
          </div>
          <div className="row g-3">
            {categories.slice(0, 4).map((category) => (
              <div key={category.id} className="col-6 col-md-3">
                <Link to={`/categories/${category.id}`} className="text-decoration-none">
                  <div className="card h-100 text-center hover-shadow">
                    <div className="card-body">
                      <img
                      //  src={category.image ? `http://127.0.0.1:8000/storage/${category.image}`: '/no-image.png'}
                        src={category.image_url || 'https://via.placeholder.com/300x300/eee/999?text=No+Image'}
                        className="card-img-top"
                        alt={category.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <h6 className="card-title mb-0">{category.name}</h6>
                      <small className="text-muted">{category.products_count || 0} products</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Featured Products</h2>
            <Link to="/products" className="btn btn-outline-primary btn-sm">
              View All
            </Link>
          </div>
          <div className="row g-3">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-6 col-md-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Promotional Banner */}
      <section className="bg-warning text-dark py-4 rounded-3 mb-5 text-center">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h3 className="fw-bold">Summer Sale!</h3>
            <p className="mb-0">Get up to 50% off on selected items. Limited time offer!</p>
          </div>
          <div className="col-md-4">
            <Link to="/products" className="btn btn-dark btn-lg">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Products */}
      {latestProducts.length > 0 && (
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Latest Products</h2>
            <Link to="/products" className="btn btn-outline-primary btn-sm">
              View All
            </Link>
          </div>
          <div className="row g-3">
            {latestProducts.map((product) => (
              <div key={product.id} className="col-6 col-md-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brands Section */}
      {brands.length > 0 && (
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Top Brands</h2>
            <Link to="/brands" className="btn btn-outline-primary btn-sm">
              View All
            </Link>
          </div>
          <div className="row g-3">
            {brands.slice(0, 6).map((brand) => (
              <div key={brand.id} className="col-4 col-md-2">
                <Link to={`/brands/${brand.id}`} className="text-decoration-none">
                  <div className="card h-100 text-center hover-shadow">
                    <div className="card-body">
                      <img
                        // src={brand.image ? `http://127.0.0.1:8000/storage/${brand.image}`: '/no-image.png'}
                        src={brand.image_url || 'https://via.placeholder.com/300x300/eee/999?text=No+Image'}
                        className="card-img-top"
                        alt={brand.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <small className="d-block text-truncate">{brand.name}</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="bg-light py-5 rounded-3 mb-4">
        <h2 className="text-center mb-4">Why Choose Us</h2>
        <div className="row g-4">
          <div className="col-md-3 text-center">
            <i className="bi bi-truck fs-1 text-primary"></i>
            <h5>Free Shipping</h5>
            <p className="text-muted small">Free shipping on orders over $50</p>
          </div>
          <div className="col-md-3 text-center">
            <i className="bi bi-shield-check fs-1 text-primary"></i>
            <h5>Secure Payment</h5>
            <p className="text-muted small">100% secure payment methods</p>
          </div>
          <div className="col-md-3 text-center">
            <i className="bi bi-arrow-repeat fs-1 text-primary"></i>
            <h5>Easy Returns</h5>
            <p className="text-muted small">30-day money-back guarantee</p>
          </div>
          <div className="col-md-3 text-center">
            <i className="bi bi-headset fs-1 text-primary"></i>
            <h5>24/7 Support</h5>
            <p className="text-muted small">Dedicated customer support</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;