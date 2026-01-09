const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Review controller functions
const {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

router.get('/restaurant/:restaurantId', getRestaurantReviews);

router.use(protect); // All routes below require authentication

router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;