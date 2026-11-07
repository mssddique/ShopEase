import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryApi } from '../../api/categoryApi';
import { productApi } from '../../api/productApi';
import ProductCard from '../../components/common/ProductCard';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';

const CategoryProducts = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        // Fetch category details
        const categoryRes = await categoryApi.getCategory(id);
        setCategory(categoryRes.data.data);

        // Fetch products in this category
        const productsRes = await productApi.getProducts({
          category: id,
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
        console.error('Error fetching category products:', error);
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
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

  if (!category) {
    return (
      <div className="text-center py-5">
        <h4>Category not found</h4>
        <Link to="/categories" className="btn btn-primary mt-3">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Category Header */}
      <div className="card bg-light mb-4 p-4">
        <div className="row align-items-center">
          <div className="col-md-2 text-center">
            <img
              src={category.image_url || '/images/no-image.svg'}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/no-image.svg';
              }}
              alt={category.name}
              className="img-fluid"
              style={{ height: '100px', objectFit: 'contain' }}
            />
          </div>
          <div className="col-md-10">
            <h2>{category.name}</h2>
            {category.description && (
              <p className="text-muted">{category.description}</p>
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
          <h4 className="mt-3">No products in this category</h4>
          <p className="text-muted">Check back later for new arrivals.</p>
          <Link to="/categories" className="btn btn-primary mt-3">
            Browse Categories
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;