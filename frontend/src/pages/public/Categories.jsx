import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../../api/categoryApi';
import Loading from '../../components/common/Loading';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await categoryApi.getCategories();
        setCategories(response.data.data || response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Loading message="Loading categories..." />;
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-grid fs-1 text-muted"></i>
        <h4 className="mt-3">No categories found</h4>
        <p className="text-muted">Categories will appear here when added.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">All Categories</h2>
      <div className="row g-4">
        {categories.map(category => (
          <div key={category.id} className="col-6 col-md-4 col-lg-3">
            <Link to={`/categories/${category.id}`} className="text-decoration-none">
              <div className="card h-100 text-center hover-shadow">
                <div className="card-body d-flex flex-column align-items-center">
                  <img
                    src={category.image_url || '/images/no-image.svg'}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/no-image.svg';
                    }}
                    alt={category.name}
                    className="img-fluid mb-3"
                    style={{ height: '120px', objectFit: 'contain' }}
                  />
                  <h5 className="card-title">{category.name}</h5>
                  {category.description && (
                    <p className="card-text text-muted small">{category.description}</p>
                  )}
                  {/* <span className="badge bg-primary mt-2">
                    {category.products_count || 0} Products
                  </span> */}
                  <button className="btn btn-outline-primary btn-sm mt-3 w-100">
                    View Products
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;