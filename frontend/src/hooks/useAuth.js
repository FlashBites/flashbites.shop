import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  
  const isUser = user?.role === 'user';
  const isRestaurantOwner = user?.role === 'restaurant_owner';
  const isAdmin = user?.role === 'admin';
  
  return {
    user,
    isAuthenticated,
    loading,
    isUser,
    isRestaurantOwner,
    isAdmin,
  };
};