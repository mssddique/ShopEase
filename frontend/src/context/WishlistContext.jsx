import React, { createContext, useState, useContext, useEffect } from 'react';
import { wishlistApi } from '../api/wishlistApi';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await wishlistApi.getWishlist();
      const items = response.data.data || [];
      setWishlistItems(items);
      setWishlistCount(items.length);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistItems([]);
      setWishlistCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      // const response = await wishlistApi.addToWishlist(productId);
      // const items = response.data.data?.items || [];
      // setWishlistItems(items);
      // setWishlistCount(items.length);
      await wishlistApi.addToWishlist(productId);
      await fetchWishlist(); 
      return { success: true, message: 'Added to wishlist!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to wishlist.';
      return { success: false, message };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistApi.removeFromWishlist(productId);
      const updatedItems = wishlistItems.filter(item => item.product_id !== productId);
      setWishlistItems(updatedItems);
      setWishlistCount(updatedItems.length);
      return { success: true, message: 'Removed from wishlist!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from wishlist.';
      return { success: false, message };
    }
  };

  const value = {
    wishlistItems,
    loading,
    wishlistCount,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};