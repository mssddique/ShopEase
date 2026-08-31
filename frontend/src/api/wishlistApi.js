import axiosInstance from './axios';

export const wishlistApi = {
  // Get wishlist items
  getWishlist: () => {
    return axiosInstance.get('/wishlist');
  },

  // Add item to wishlist
  addToWishlist: (productId) => {
    return axiosInstance.post(`/wishlist/${productId}`);
  },

  // Remove item from wishlist
  removeFromWishlist: (productId) => {
    return axiosInstance.delete(`/wishlist/${productId}`);
  },
};