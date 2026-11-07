import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brandApi } from '../../api/brandApi';
import Loading from '../../components/common/Loading';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await brandApi.getBrands();
        setBrands(response.data.data || response.data || []);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return <Loading message="Loading brands..." />;
  }

  if (brands.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-building fs-1 text-muted"></i>
        <h4 className="mt-3">No brands found</h4>
        <p className="text-muted">Brands will appear here when added.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">All Brands</h2>
      <div className="row g-4">
        {brands.map(brand => (
          <div key={brand.id} className="col-6 col-md-4 col-lg-3">
            <Link to={`/brands/${brand.id}`} className="text-decoration-none">
              <div className="card h-100 text-center hover-shadow">
                <div className="card-body d-flex flex-column align-items-center">
                  <img
                    src={brand.image_url || '/images/no-image.svg'}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/no-image.svg';
                    }}
                    alt={brand.name}
                    className="img-fluid mb-3"
                    style={{ height: '100px', objectFit: 'contain' }}
                  />
                  <h5 className="card-title">{brand.name}</h5>
                  {brand.description && (
                    <p className="card-text text-muted small">{brand.description}</p>
                  )}
                  {/* <span className="badge bg-primary mt-2">
                    {brand.products_count || 0} Products
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

export default Brands;