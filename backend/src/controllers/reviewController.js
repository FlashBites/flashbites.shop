const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private (User)
exports.createReview = async (req, res) => {
  try {
    const { restaurantId, orderId, rating, comment, images } = req.body;

    // Check if order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 404, 'Order not found or unauthorized');
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return errorResponse(res, 400, 'Can only review delivered orders');
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return errorResponse(res, 400, 'Review already exists for this order');
    }

    const review = await Review.create({
      userId: req.user._id,
      restaurantId,
      orderId,
      rating,
      comment,
      images
    });

    // Update restaurant rating
    const restaurant = await Restaurant.findById(restaurantId);
    await restaurant.calculateAverageRating();

    successResponse(res, 201, 'Review created successfully', { review });
  } catch (error) {
    errorResponse(res, 500, 'Failed to create review', error.message);
  }
};

// @desc    Get restaurant reviews
// @route   GET /api/reviews/restaurant/:restaurantId
// @access  Public
exports.getRestaurantReviews = async (req, res) => {
  try {
    const { rating, sortBy = '-createdAt' } = req.query;
    let query = { restaurantId: req.params.restaurantId };

    if (rating) query.rating = parseInt(rating);

    const reviews = await Review.find(query)
      .populate('userId', 'name avatar')
      .sort(sortBy);

    successResponse(res, 200, 'Reviews retrieved successfully', {
      count: reviews.length,
      reviews
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to get reviews', error.message);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (User - own review)
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to update this review');
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Update restaurant rating
    const restaurant = await Restaurant.findById(review.restaurantId);
    await restaurant.calculateAverageRating();

    successResponse(res, 200, 'Review updated successfully', { review: updatedReview });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update review', error.message);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (User - own review)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to delete this review');
    }

    await review.deleteOne();

    // Update restaurant rating
    const restaurant = await Restaurant.findById(review.restaurantId);
    await restaurant.calculateAverageRating();

    successResponse(res, 200, 'Review deleted successfully');
  } catch (error) {
    errorResponse(res, 500, 'Failed to delete review', error.message);
  }
};