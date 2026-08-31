import axiosInstance from './axios';

export const orderApi = {
  // Get all orders
  getOrders: () => {
    return axiosInstance.get('/orders');
  },

  // Get single order
  getOrder: (id) => {
    return axiosInstance.get(`/orders/${id}`);
  },

  // Create order (checkout)
  createOrder: (data) => {
    return axiosInstance.post('/checkout', data);
  },

  // Admin: Get all orders
  adminGetOrders: () => {
    return axiosInstance.get('/admin/orders');
  },

  // Admin: Get single order
  adminGetOrder: (id) => {
    return axiosInstance.get(`/admin/orders/${id}`);
  },

  // Admin: Update order status
  adminUpdateOrderStatus: (id, status) => {
    return axiosInstance.put(`/admin/orders/${id}/status`, { status });
  },
};