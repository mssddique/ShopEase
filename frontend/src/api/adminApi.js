import axiosInstance from './axios';

export const adminApi = {
  // Dashboard
  getDashboard: () => {
    return axiosInstance.get('/admin/dashboard');
  },

  // Products
  getProducts: (params = {}) => {
    // console.log('main_image value:', formData.main_image);
    // console.log('main_image type:', formData.main_image?.constructor?.name);
    return axiosInstance.get('/admin/products', { params });
  },
  createProduct: (data) => {
    return axiosInstance.post('/admin/products', data);
  },
  getProduct: (id) => {
    return axiosInstance.get(`/admin/products/${id}`);
  },
  updateProduct: (id, data) => {
    return axiosInstance.post(`/admin/products/${id}`, data);
  },
  deleteProduct: (id) => {
    return axiosInstance.delete(`/admin/products/${id}`);
  },

  // Categories
  getCategories: () => {
    return axiosInstance.get('/admin/categories');
  },
  createCategory: (data) => {
    return axiosInstance.post('/admin/categories', data);
  },
  updateCategory: (id, data) => {
    return axiosInstance.post(`/admin/categories/${id}`, data);
  },
  deleteCategory: (id) => {
    return axiosInstance.delete(`/admin/categories/${id}`);
  },

  // Brands
  getBrands: () => {
    return axiosInstance.get('/admin/brands');
  },
  createBrand: (data) => {
    return axiosInstance.post('/admin/brands', data);
  },
  updateBrand: (id, data) => {
    return axiosInstance.post(`/admin/brands/${id}`, data);
  },
  deleteBrand: (id) => {
    return axiosInstance.delete(`/admin/brands/${id}`);
  },

  // Customers
  getCustomers: () => {
    return axiosInstance.get('/admin/customers');
  },

  // Orders
  getOrders: () => {
    return axiosInstance.get('/admin/orders');
  },
  getOrder: (id) => {
    return axiosInstance.get(`/admin/orders/${id}`);
  },
  updateOrderStatus: (id, status) => {
    return axiosInstance.put(`/admin/orders/${id}/status`, { status });
  },
};