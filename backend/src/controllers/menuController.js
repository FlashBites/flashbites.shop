const MenuItem = require('../models/MenuItem');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/imageUpload');

// @desc    Add menu item
// @route   POST /api/restaurants/:restaurantId/menu
// @access  Private (Owner)
exports.addMenuItem = async (req, res) => {
  try {
    console.log('===== ADD MENU ITEM DEBUG =====');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? 'File present' : 'No file');
    console.log('User:', req.user ? req.user._id : 'No user');
    
    const { name, description, price, category, subCategory, isVeg, tags, prepTime, isAvailable, hasVariants, variants } = req.body;

    // Validate required fields
    if (!name || !description || !category) {
      return errorResponse(res, 400, 'Missing required fields: name, description, category');
    }

    // Validate variants if hasVariants is true
    if (hasVariants === 'true' || hasVariants === true) {
      if (!variants) {
        return errorResponse(res, 400, 'Variants are required when hasVariants is true');
      }
    } else {
      // Price is required for non-variant items
      if (!price) {
        return errorResponse(res, 400, 'Price is required for non-variant items');
      }
    }

    // Handle image upload
    let imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer, 'flashbites/menu-items');
        console.log('Image uploaded:', imageUrl);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue with default image if upload fails
      }
    }

    const menuItemData = {
      restaurantId: req.params.restaurantId,
      name,
      description,
      category,
      image: imageUrl,
      isVeg: isVeg === 'true' || isVeg === true,
      isAvailable: isAvailable === 'true' || isAvailable === true || isAvailable === undefined,
      tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
      prepTime: prepTime ? parseInt(prepTime) : 20,
      hasVariants: hasVariants === 'true' || hasVariants === true
    };

    // Add subCategory if provided
    if (subCategory) {
      menuItemData.subCategory = subCategory;
    }

    // Handle variants or single price
    if (menuItemData.hasVariants) {
      const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      menuItemData.variants = parsedVariants;
      // Set default price to first variant's price
      if (parsedVariants && parsedVariants.length > 0) {
        menuItemData.price = parseFloat(parsedVariants[0].price);
      }
    } else {
      menuItemData.price = parseFloat(price);
    }

    console.log('Creating menu item with data:', menuItemData);
    const menuItem = await MenuItem.create(menuItemData);
    console.log('Menu item created successfully:', menuItem._id);

    successResponse(res, 201, 'Menu item added successfully', { menuItem });
  } catch (error) {
    console.error('Add menu item error:', error);
    console.error('Error stack:', error.stack);
    errorResponse(res, 500, 'Failed to add menu item', error.message);
  }
};

// @desc    Get menu items by restaurant
// @route   GET /api/restaurants/:restaurantId/menu
// @access  Public
exports.getMenuByRestaurant = async (req, res) => {
  try {
    const { category, isVeg, search } = req.query;
    let query = { restaurantId: req.params.restaurantId };

    if (category) query.category = category;
    if (isVeg) query.isVeg = isVeg === 'true';
    if (search) query.name = { $regex: search, $options: 'i' };

    const menuItems = await MenuItem.find(query).sort('category');

    successResponse(res, 200, 'Menu retrieved successfully', {
      count: menuItems.length,
      items: menuItems
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to get menu', error.message);
  }
};

// @desc    Update menu item
// @route   PUT /api/restaurants/:restaurantId/menu/:itemId
// @access  Private (Owner)
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.itemId);
    
    if (!menuItem) {
      return errorResponse(res, 404, 'Menu item not found');
    }

    // Handle image upload if new file provided
    if (req.file) {
      // Delete old image from Cloudinary if it exists and is not default
      if (menuItem.image && !menuItem.image.includes('unsplash')) {
        await deleteFromCloudinary(menuItem.image);
      }
      req.body.image = await uploadToCloudinary(req.file.buffer, 'flashbites/menu-items');
    }

    // Parse variants if it's a string
    if (req.body.variants && typeof req.body.variants === 'string') {
      req.body.variants = JSON.parse(req.body.variants);
    }

    // Handle hasVariants conversion
    if (req.body.hasVariants !== undefined) {
      req.body.hasVariants = req.body.hasVariants === 'true' || req.body.hasVariants === true;
    }

    // Handle boolean conversions
    if (req.body.isVeg !== undefined) {
      req.body.isVeg = req.body.isVeg === 'true' || req.body.isVeg === true;
    }
    if (req.body.isAvailable !== undefined) {
      req.body.isAvailable = req.body.isAvailable === 'true' || req.body.isAvailable === true;
    }

    // If hasVariants is true and variants are provided, set price to first variant
    if (req.body.hasVariants && req.body.variants && req.body.variants.length > 0) {
      req.body.price = parseFloat(req.body.variants[0].price);
    } else if (req.body.price) {
      req.body.price = parseFloat(req.body.price);
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      { new: true, runValidators: true }
    );

    successResponse(res, 200, 'Menu item updated successfully', { menuItem: updatedMenuItem });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update menu item', error.message);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/restaurants/:restaurantId/menu/:itemId
// @access  Private (Owner)
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.itemId);

    if (!menuItem) {
      return errorResponse(res, 404, 'Menu item not found');
    }

    successResponse(res, 200, 'Menu item deleted successfully');
  } catch (error) {
    errorResponse(res, 500, 'Failed to delete menu item', error.message);
  }
};

// @desc    Toggle menu item availability
// @route   PATCH /api/restaurants/:restaurantId/menu/:itemId/availability
// @access  Private (Owner)
exports.toggleMenuItemAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.itemId);
    
    if (!menuItem) {
      return errorResponse(res, 404, 'Menu item not found');
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    successResponse(res, 200, 'Menu item availability updated', { menuItem });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update availability', error.message);
  }
};