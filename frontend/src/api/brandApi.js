import axiosInstance from './axios';

export const brandApi = {
  // Get all brands
  getBrands: () => {
    return axiosInstance.get('/brands');
  },

  // Get single brand
  getBrand: (id) => {
    return axiosInstance.get(`/brands/${id}`);
  },

  // Get brand products
  getBrandProducts: (id) => {
    return axiosInstance.get(`/brands/${id}/products`);
  },
};