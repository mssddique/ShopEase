import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { brandApi } from '../../api/brandApi';
import { productApi } from '../../api/productApi';
import ProductCard from '../../components/common/ProductCard';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';

const BrandProducts = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchBrandProducts = async () => {
      setLoading(true);
      try {
        // Fetch brand details
        const brandRes = await brandApi.getBrand(id);
        setBrand(brandRes.data.data);

        // Fetch products by this brand
        const productsRes = await productApi.getProducts({
          brand: id,
          page: pagination.currentPage,
          limit: 12,
        });
        const data = productsRes.data.data;
        setProducts(data.data || []);
        setPagination({
          currentPage: data.current_page || 1,
          lastPage: data.last_page || 1,
          total: data.total || 0,
        });
      } catch (error) {
        console.error('Error fetching brand products:', error);
        setBrand(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProducts();
  }, [id, pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loading message="Loading products..." />;
  }

  if (!brand) {
    return (
      <div className="text-center py-5">
        <h4>Brand not found</h4>
        <Link to="/brands" className="btn btn-primary mt-3">
          Back to Brands
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Brand Header */}
      <div className="card bg-light mb-4 p-4">
        <div className="row align-items-center">
          <div className="col-md-2 text-center">
            <img
              src={brand.image_url || '/images/no-image.svg'}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/no-image.svg';
              }}
              alt={brand.name}
              className="img-fluid"
              style={{ height: '100px', objectFit: 'contain' }}
            />
          </div>
          <div className="col-md-10">
            <h2>{brand.name}</h2>
            {brand.description && (
              <p className="text-muted">{brand.description}</p>
            )}
            <span className="badge bg-primary">
              {pagination.total} Products
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="row g-3">
            {products.map(product => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {pagination.lastPage > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              lastPage={pagination.lastPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-box fs-1 text-muted"></i>
          <h4 className="mt-3">No products from this brand</h4>
          <p className="text-muted">Check back later for new arrivals.</p>
          <Link to="/brands" className="btn btn-primary mt-3">
            Browse Brands
          </Link>
        </div>
      )}
    </div>
  );
};

export default BrandProducts;