import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartApi.getCart();
      const items = response.data.data?.items  || [];
      setCartItems(items);
      updateCartSummary(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const updateCartSummary = (items) => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const total = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      // const price = item.sale_price || item.price;
      return sum + (price * item.quantity);
    }, 0);
    setCartCount(count);
    setCartTotal(total);
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartApi.addToCart({
        product_id: productId,
        quantity: quantity,
      });
      
      const updatedCart = response.data.data?.items  || [];
      setCartItems(updatedCart);
      updateCartSummary(updatedCart);
      
      return { success: true, message: 'Product added to cart successfully!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart.';
      return { success: false, message };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      if (quantity <= 0) {
        return await removeFromCart(cartItemId);
      }
      
      const response = await cartApi.updateCartItem(cartItemId, quantity);
      const updatedCart = response.data.data?.items  || [];
      setCartItems(updatedCart);
      updateCartSummary(updatedCart);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity.';
      return { success: false, message };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartApi.removeFromCart(cartItemId);
      const updatedItems = cartItems.filter(item => item.id !== cartItemId);
      setCartItems(updatedItems);
      updateCartSummary(updatedItems);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item.';
      return { success: false, message };
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart.';
      return { success: false, message };
    }
  };

  const value = {
    cartItems,
    loading,
    cartCount,
    cartTotal,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};