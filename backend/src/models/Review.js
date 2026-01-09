const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  images: [String],
  helpful: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

reviewSchema.index({ restaurantId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ orderId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);