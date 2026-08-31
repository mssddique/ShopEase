import axiosInstance from './axios';

export const cartApi = {
  // Get cart items
  getCart: () => {
    return axiosInstance.get('/cart');
  },

  // Add item to cart
  addToCart: (data) => {
    return axiosInstance.post('/cart', data);
  },

  // Update cart item quantity
  updateCartItem: (id, quantity) => {
    return axiosInstance.put(`/cart/${id}`, { quantity });
  },

  // Remove item from cart
  removeFromCart: (id) => {
    return axiosInstance.delete(`/cart/${id}`);
  },

  // Clear entire cart
  clearCart: () => {
    return axiosInstance.delete('/cart');
  },
};
