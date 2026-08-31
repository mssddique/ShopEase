import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort: searchParams.get('sort') || 'latest',
  });
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    lastPage: 1,
    total: 0,
    perPage: 12,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.perPage,
        ...filters,
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await productApi.getProducts(params);
      const data = response.data.data;
      
      setProducts(data.data || []);
      setPagination({
        currentPage: data.current_page || 1,
        lastPage: data.last_page || 1,
        total: data.total || 0,
        perPage: data.per_page || 12,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and brands for filters
  const fetchFiltersData = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        categoryApi.getCategories(),
        brandApi.getBrands(),
      ]);
      setCategories(categoriesRes.data.data || categoriesRes.data || []);
      setBrands(brandsRes.data.data || brandsRes.data || []);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    // Update URL params
    const params = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params[key] = filters[key];
      }
    });
    if (pagination.currentPage > 1) {
      params.page = pagination.currentPage;
    }
    setSearchParams(params);
    
    fetchProducts();
  }, [filters, pagination.currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      min_price: '',
      max_price: '',
      sort: 'latest',
    });
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
    }));
  };

  if (loading && products.length === 0) {
    return <Loading message="Loading products..." />;
  }

  return (
    <div className="row">
      {/* Filter Sidebar - Desktop */}
      <div className="col-lg-3 d-none d-lg-block">
        <div className="card shadow-sm p-3">
          <h5 className="mb-3">Filters</h5>
          
          {/* Search */}
          <div className="mb-3">
            <label className="form-label">Search</label>
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-select"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div className="mb-3">
            <label className="form-label">Brand</label>
            <select
              name="brand"
              className="form-select"
              value={filters.brand}
              onChange={handleFilterChange}
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-3">
            <label className="form-label">Price Range</label>
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="number"
                  name="min_price"
                  className="form-control"
                  placeholder="Min"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  name="max_price"
                  className="form-control"
                  placeholder="Max"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="mb-3">
            <label className="form-label">Sort By</label>
            <select
              name="sort"
              className="form-select"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="latest">Latest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="col-lg-9">
        {/* Mobile Filter Toggle */}
        <div className="d-block d-lg-none mb-3">
          <button
            className="btn btn-outline-primary w-100"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <i className="bi bi-funnel me-2"></i>
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="card shadow-sm p-3 mb-3 d-lg-none">
            <h5 className="mb-3">Filters</h5>
            
            <div className="mb-3">
              <label className="form-label">Search</label>
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Brand</label>
              <select
                name="brand"
                className="form-select"
                value={filters.brand}
                onChange={handleFilterChange}
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Price Range</label>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    type="number"
                    name="min_price"
                    className="form-control"
                    placeholder="Min"
                    value={filters.min_price}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    name="max_price"
                    className="form-control"
                    placeholder="Max"
                    value={filters.max_price}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Sort By</label>
              <select
                name="sort"
                className="form-select"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <option value="latest">Latest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted">
            {pagination.total} product{pagination.total !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="row g-3">
            {products.map(product => (
              <div key={product.id} className="col-6 col-md-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-box fs-1 text-muted"></i>
            <h4 className="mt-3">No products found</h4>
            <p className="text-muted">Try adjusting your filters or search terms.</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination.lastPage > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Products;