import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';
import Loading from '../../components/common/Loading';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';

const Home = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
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

        setFeaturedProducts(featuredRes.data.data?.data || featuredRes.data.data || []);
        setLatestProducts(latestRes.data.data?.data || latestRes.data.data || []);
        setCategories(categoriesRes.data.data?.data || categoriesRes.data.data || []);
        setBrands(brandsRes.data.data?.data || brandsRes.data.data || []);
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
      <div className="text-center py-5">
        <i className="bi bi-wifi-off fs-1 text-muted"></i>
        <h4 className="mt-3">We couldn't load the shop</h4>
        <p className="text-muted">{error}</p>
        <button className="btn btn-primary mt-2" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  const fallback = '/images/no-image.svg';
  const swapFallback = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  };
  const heroProducts = (featuredProducts.length ? featuredProducts : latestProducts).slice(0, 3);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const q = heroSearch.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
  };

  return (
    <div>
      {/* Hero */}
      <section className="se-hero">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <h1>Find it, add it, done.</h1>
            <p className="lead mt-3 mb-4">
              Browse by category or brand, save what you like and check out securely.
            </p>
            <form className="se-hero-search mb-3" onSubmit={handleHeroSearch} role="search">
              <input
                type="search"
                placeholder="What are you looking for?"
                aria-label="Search products"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-warning">Search</button>
            </form>
            <Link to="/categories" className="text-white fw-semibold">
              Or browse categories <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="col-lg-6">
            <div className="se-mosaic">
              {heroProducts.length > 0 ? (
                heroProducts.map((p) => (
                  <Link key={p.id} to={`/products/${p.id}`} className="se-tile">
                    <img src={p.image_url || fallback} onError={swapFallback} alt={p.name} />
                    <div className="se-tile-label">
                      <span>{p.name}</span>
                      <span>${p.sale_price || p.price}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="se-mosaic-empty" aria-hidden="true">
                  <i className="bi bi-bag-heart"></i>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="se-section">
          <div className="se-section-head">
            <h2>Shop by category</h2>
            <Link to="/categories" className="se-link-all">View all</Link>
          </div>
          <div className="row g-3">
            {categories.slice(0, 4).map((category) => (
              <div key={category.id} className="col-6 col-md-3">
                <Link to={`/categories/${category.id}`} className="se-category">
                  <img
                    src={category.image_url || fallback}
                    onError={swapFallback}
                    className="se-category-img"
                    alt=""
                    loading="lazy"
                  />
                  <div className="se-category-body">
                    <h3>{category.name}</h3>
                    <small>{category.products_count || 0} products</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featuredProducts.length > 0 && (
        <section className="se-section">
          <div className="se-section-head">
            <h2>Featured products</h2>
            <Link to="/products" className="se-link-all">View all</Link>
          </div>
          <div className="row g-3">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sale strip */}
      <section className="se-sale">
        <div>
          <h3>Summer sale: up to 50% off</h3>
          <p>Selected items, for a limited time.</p>
        </div>
        <Link to="/products" className="btn btn-dark btn-lg">Shop the sale</Link>
      </section>

      {/* Latest */}
      {latestProducts.length > 0 && (
        <section className="se-section">
          <div className="se-section-head">
            <h2>Just in</h2>
            <Link to="/products" className="se-link-all">View all</Link>
          </div>
          <div className="row g-3">
            {latestProducts.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <section className="se-section">
          <div className="se-section-head">
            <h2>Top brands</h2>
            <Link to="/brands" className="se-link-all">View all</Link>
          </div>
          <div className="row g-3">
            {brands.slice(0, 6).map((brand) => (
              <div key={brand.id} className="col-4 col-md-2">
                <Link to={`/brands/${brand.id}`} className="se-brand-tile">
                  <img
                    src={brand.image_url || fallback}
                    onError={swapFallback}
                    alt=""
                    loading="lazy"
                  />
                  <span className="text-truncate w-100 text-center">{brand.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Promises */}
      <section className="se-promises mb-4">
        <div className="se-promise">
          <i className="bi bi-truck"></i>
          <div><h3>Free shipping</h3><p>On orders over $50</p></div>
        </div>
        <div className="se-promise">
          <i className="bi bi-shield-check"></i>
          <div><h3>Secure payment</h3><p>Pay by card, protected by Stripe</p></div>
        </div>
        <div className="se-promise">
          <i className="bi bi-arrow-repeat"></i>
          <div><h3>Easy returns</h3><p>30-day money-back guarantee</p></div>
        </div>
        <div className="se-promise">
          <i className="bi bi-headset"></i>
          <div><h3>Help when you need it</h3><p>Support around the clock</p></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
