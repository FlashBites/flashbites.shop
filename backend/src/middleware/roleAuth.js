exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Check if user is restaurant owner and owns the restaurant
exports.checkRestaurantOwnership = async (req, res, next) => {
  try {
    const Restaurant = require('../models/Restaurant');
    const restaurantId = req.params.restaurantId || req.params.id;
    
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Admin can access any restaurant
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns this restaurant
    if (restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to manage this restaurant'
      });
    }

    req.restaurant = restaurant;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed',
      error: error.message
    });
  }
};