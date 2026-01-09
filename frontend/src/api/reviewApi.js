import axios from './axios';

// Create review
export const createReview = async (reviewData) => {
  const response = await axios.post('/reviews', reviewData);
  return response.data;
};

// Get restaurant reviews
export const getRestaurantReviews = async (restaurantId, params = {}) => {
  const response = await axios.get(`/reviews/restaurant/${restaurantId}`, { params });
  return response.data;
};

// Get user reviews
export const getUserReviews = async () => {
  const response = await axios.get('/reviews/my-reviews');
  return response.data;
};

// Update review
export const updateReview = async (id, reviewData) => {
  const response = await axios.put(`/reviews/${id}`, reviewData);
  return response.data;
};

// Delete review
export const deleteReview = async (id) => {
  const response = await axios.delete(`/reviews/${id}`);
  return response.data;
};
