const express = require('express');
const router = express.Router();
const {
  addMenuItem,
  getMenuByRestaurant,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const { checkRestaurantOwnership } = require('../middleware/roleAuth');

router.get('/:restaurantId', getMenuByRestaurant);

router.use(protect); // All routes below require authentication

router.post('/:restaurantId', checkRestaurantOwnership, addMenuItem);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);
router.patch('/:id/availability', toggleMenuItemAvailability);

module.exports = router;