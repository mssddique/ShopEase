import axiosInstance from './axios';

export const productApi = {
  // Get all products with filters
  getProducts: (params = {}) => {
    return axiosInstance.get('/products', { params });
  },

  // Get single product
  getProduct: (id) => {
    return axiosInstance.get(`/products/${id}`);
  },

  // Get featured products
  getFeaturedProducts: () => {
    return axiosInstance.get('/products', { 
      params: { featured: 1, limit: 8 } 
    });
  },

  // Get latest products
  getLatestProducts: () => {
    return axiosInstance.get('/products', { 
      params: { latest: 1, limit: 8 } 
    });
  },

  // Search products
  searchProducts: (keyword) => {
    return axiosInstance.get('/products', { 
      params: { search: keyword } 
    });
  },
};