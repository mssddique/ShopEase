import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/common/Loading';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getProducts();

      //temporiarly 
      console.log('FULL PRODUCT RESPONSE:', response.data);
      console.log('FIRST PRODUCT:', response.data.data.data?.[0]);
      
      setProducts(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setDeleting(id);
    try {
      await adminApi.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <Loading message="Loading products..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>
        <Link to="/admin/products/create" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add Product
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {products.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={ product.image ? `http://127.0.0.1:8000/storage/${product.image}`: '/no-image.png'}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="rounded"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category?.name || 'N/A'}</td>
                      <td>{product.brand?.name || 'N/A'}</td>
                      <td>
                        {product.sale_price ? (
                          <>
                            <span className="text-danger">${product.sale_price}</span>
                            <span className="text-muted text-decoration-line-through ms-1 small">${product.price}</span>
                          </>
                        ) : (
                          `$${product.price}`
                        )}
                      </td>
                      <td>
                        <span className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${product.status ? 'bg-success' : 'bg-secondary'}`}>
                          {product.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link to={`/admin/products/edit/${product.id}`} className="btn btn-sm btn-primary">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                          >
                            {deleting === product.id ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              <i className="bi bi-trash"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-box fs-1 text-muted"></i>
              <h5 className="mt-3">No products found</h5>
              <Link to="/admin/products/create" className="btn btn-primary mt-2">
                Add Your First Product
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;