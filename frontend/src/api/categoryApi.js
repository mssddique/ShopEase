import axiosInstance from './axios';

export const categoryApi = {
  // Get all categories
  getCategories: () => {
    return axiosInstance.get('/categories');
  },

  // Get single category
  getCategory: (id) => {
    return axiosInstance.get(`/categories/${id}`);
  },

  // Get category products
  getCategoryProducts: (id) => {
    return axiosInstance.get(`/categories/${id}/products`);
  },
};