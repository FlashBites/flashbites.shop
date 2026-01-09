import axios from './axios';

// Get menu items by restaurant
export const getMenuByRestaurant = async (restaurantId) => {
  const response = await axios.get(`/menu/${restaurantId}`);
  return response.data;
};

// Add menu item
export const addMenuItem = async (restaurantId, menuItemData) => {
  const response = await axios.post(`/menu/${restaurantId}`, menuItemData);
  return response.data;
};

// Update menu item
export const updateMenuItem = async (id, menuItemData) => {
  const response = await axios.put(`/menu/${id}`, menuItemData);
  return response.data;
};

// Delete menu item
export const deleteMenuItem = async (id) => {
  const response = await axios.delete(`/menu/${id}`);
  return response.data;
};

// Toggle menu item availability
export const toggleMenuItemAvailability = async (id) => {
  const response = await axios.patch(`/menu/${id}/availability`);
  return response.data;
};
