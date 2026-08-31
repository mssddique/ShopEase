import axiosInstance from './axios';

export const paymentApi = {
  createStripeIntent: () => {
    return axiosInstance.post('/payments/stripe/create-intent');
  },
};