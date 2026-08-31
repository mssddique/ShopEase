import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';
import Loading from '../../components/common/Loading';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: '',
    brand_id: '',
    description: '',
    price: '',
    sale_price: '',
    stock: '',
    status: true,
    featured: false,
    main_image: null,
    additional_images: [],
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          categoryApi.getCategories(),
          brandApi.getBrands(),
        ]);
        setCategories(categoriesRes.data.data || categoriesRes.data || []);
        setBrands(brandsRes.data.data || brandsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

    if (isEdit) {
      fetchProduct();
    }
  }, [isEdit]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getProduct(id);
      const product = response.data.data;
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category_id: product.category_id || '',
        brand_id: product.brand_id || '',
        description: product.description || '',
        price: product.price || '',
        sale_price: product.sale_price || '',
        stock: product.stock || '',
        status: product.status || true,
        featured: product.featured || false,
        main_image: null,
        additional_images: [],
      });
      if (product.main_image) {
        setImagePreview(product.main_image);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product.');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        main_image: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setErrors({});

  try {
    const data = new FormData();

    data.append('name', formData.name);
    data.append('sku', formData.sku);
    data.append('category_id', formData.category_id);
    data.append('brand_id', formData.brand_id);
    data.append('description', formData.description || '');
    data.append('price', formData.price);
    if (formData.sale_price) {
      data.append('sale_price', formData.sale_price);
    }
    data.append('stock', formData.stock);
    data.append('status', formData.status ? '1' : '0');
    data.append('featured', formData.featured ? '1' : '0');

    if (formData.main_image) {
      data.append('image', formData.main_image);
    }

    if (isEdit) {
      data.append('_method', 'PUT');
      await adminApi.updateProduct(id, data);
      alert('Product updated successfully!');
    } else {
      const createResponse = await adminApi.createProduct(data);
      const newProductId = createResponse.data.data.id;

      if (formData.additional_images.length > 0) {
        const galleryData = new FormData();
        formData.additional_images.forEach(file => {
          galleryData.append('images[]', file);
        });
        await adminApi.uploadProductImages(newProductId, galleryData);
      }

      alert('Product created successfully!');
    }
    navigate('/admin/products');
  } catch (error) {
    console.error('Error saving product:', error);
    if (error.response?.data?.errors) {
      setErrors(error.response.data.errors);
    } else {
      alert(error.response?.data?.message || 'Failed to save product.');
    }
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return <Loading message={isEdit ? 'Loading product...' : 'Loading...'} />;
  }

  return (
    <div>
      <h2 className="mb-4">{isEdit ? 'Edit Product' : 'Create Product'}</h2>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">Product Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="sku" className="form-label">SKU</label>
                <input
                  type="text"
                  className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                />
                {errors.sku && <div className="invalid-feedback">{errors.sku}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="category_id" className="form-label">Category</label>
                <select
                  className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <div className="invalid-feedback">{errors.category_id}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="brand_id" className="form-label">Brand</label>
                <select
                  className={`form-select ${errors.brand_id ? 'is-invalid' : ''}`}
                  id="brand_id"
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleChange}
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brand_id && <div className="invalid-feedback">{errors.brand_id}</div>}
              </div>

              <div className="col-12 mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="price" className="form-label">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="sale_price" className="form-label">Sale Price</label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${errors.sale_price ? 'is-invalid' : ''}`}
                  id="sale_price"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleChange}
                />
                {errors.sale_price && <div className="invalid-feedback">{errors.sale_price}</div>}
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="stock" className="form-label">Stock *</label>
                <input
                  type="number"
                  className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
                {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                  >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="featured">
                    Featured Product
                  </label>
                </div>
              </div>

              <div className="col-12 mb-3">
                <label htmlFor="main_image" className="form-label">Main Image</label>
                <input
                  type="file"
                  className={`form-control ${errors.main_image ? 'is-invalid' : ''}`}
                  id="main_image"
                  name="main_image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {errors.main_image && <div className="invalid-feedback">{errors.main_image}</div>}
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" style={{ height: '100px', objectFit: 'contain' }} />
                  </div>
                )}
              </div>
              

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    isEdit ? 'Update Product' : 'Create Product'
                  )}
                </button>
                <Link to="/admin/products" className="btn btn-secondary ms-2">
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;