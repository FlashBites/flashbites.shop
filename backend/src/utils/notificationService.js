const webpush = require('web-push');
const Notification = require('../models/Notification');
const PushSubscription = require('../models/PushSubscription');

// Configure web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.EMAIL_USER || 'noreply@flashbites.com'}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn('⚠️  VAPID keys not configured. Push notifications will not work.');
}

// Create notification in database
const createNotification = async (recipientId, notificationData) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      ...notificationData
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send push notification
const sendPushNotification = async (userId, payload) => {
  try {
    const subscriptions = await PushSubscription.find({
      user: userId,
      isActive: true
    });

    if (subscriptions.length === 0) {
      console.log(`No active push subscriptions for user ${userId}`);
      return;
    }

    const pushPayload = JSON.stringify({
      title: payload.title,
      body: payload.message,
      icon: '/logo.png',
      badge: '/logo.png',
      data: payload.data || {},
      tag: payload.type,
      requireInteraction: payload.priority === 'high'
    });

    const promises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys
          },
          pushPayload
        );
        console.log(`✅ Push sent to ${subscription.deviceType} for user ${userId}`);
      } catch (error) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Subscription expired or invalid
          subscription.isActive = false;
          await subscription.save();
          console.log(`Deactivated expired subscription for user ${userId}`);
        } else {
          console.error(`Error sending push to user ${userId}:`, error.message);
        }
      }
    });

    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
  }
};

// Combined: Create notification + send push
const notifyUser = async (userId, notificationData) => {
  try {
    // Save to database
    const notification = await createNotification(userId, notificationData);

    // Send push notification
    await sendPushNotification(userId, notificationData);

    return notification;
  } catch (error) {
    console.error('Error in notifyUser:', error);
    throw error;
  }
};

// Notify multiple users
const notifyMultipleUsers = async (userIds, notificationData) => {
  try {
    const promises = userIds.map(userId => notifyUser(userId, notificationData));
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    console.log(`✅ Notified ${successful}/${userIds.length} users`);
    return results;
  } catch (error) {
    console.error('Error in notifyMultipleUsers:', error);
    throw error;
  }
};

// Order status change notifications
const notifyOrderStatus = async (order, status) => {
  try {
    console.log('📧 [notifyOrderStatus] Start - Status:', status, 'OrderID:', order._id);
    
    // Use _id as fallback for orderNumber if it's undefined
    const orderRef = order.orderNumber || order._id.toString().slice(-8);
    
    const messages = {
      confirmed: {
        title: '✅ Order Confirmed',
        message: `Your order #${orderRef} has been confirmed by ${order.restaurantId?.name || 'the restaurant'}`,
        type: 'order_confirmed'
      },
      preparing: {
        title: '👨‍🍳 Preparing Your Order',
        message: `Your order #${orderRef} is being prepared`,
        type: 'order_preparing'
      },
      ready: {
        title: '✨ Order Ready',
        message: `Your order #${orderRef} is ready for pickup`,
        type: 'order_ready'
      },
      picked_up: {
        title: '🚴 On the Way',
        message: `Your order #${orderRef} has been picked up and is on the way`,
        type: 'order_picked_up'
      },
      delivered: {
        title: '🎉 Order Delivered',
        message: `Your order #${orderRef} has been delivered. Enjoy your meal!`,
        type: 'order_delivered'
      },
      cancelled: {
        title: '❌ Order Cancelled',
        message: `Your order #${orderRef} has been cancelled`,
        type: 'order_cancelled',
        priority: 'high'
      }
    };

    const notificationData = messages[status];
    if (!notificationData) {
      console.log('⚠️ [notifyOrderStatus] No message template for status:', status);
      return;
    }

    notificationData.data = {
      orderId: order._id,
      orderNumber: orderRef,
      restaurantId: order.restaurantId?._id
    };

    // Notify customer (use userId instead of user)
    if (order.userId) {
      console.log('✓ [notifyOrderStatus] Notifying customer:', order.userId._id || order.userId);
      await notifyUser(order.userId._id || order.userId, notificationData);
    }

    // Notify restaurant owner if new order
    if (status === 'confirmed' && order.restaurantId?.ownerId) {
      console.log('✓ [notifyOrderStatus] Notifying restaurant owner');
      await notifyUser(order.restaurantId.ownerId, {
        title: '🔔 New Order Received',
        message: `New order #${orderRef} - ₹${order.total || order.totalAmount}`,
        type: 'order_placed',
        priority: 'high',
        data: {
          orderId: order._id,
          orderNumber: orderRef
        }
      });
    }
    
    console.log('✅ [notifyOrderStatus] Complete');
  } catch (error) {
    console.error('❌ [notifyOrderStatus] Error:', error.message);
    console.error(error.stack);
    // Don't throw - let the request continue even if notification fails
  }
};

// Coupon notification
const notifyCouponAvailable = async (userIds, coupon) => {
  const notificationData = {
    title: '🎁 Special Discount Available!',
    message: `Use code ${coupon.code} and get ${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : '₹' + coupon.discountValue} off`,
    type: 'coupon_available',
    priority: 'medium',
    data: {
      couponId: coupon._id,
      couponCode: coupon.code
    }
  };

  await notifyMultipleUsers(userIds, notificationData);
};

module.exports = {
  createNotification,
  sendPushNotification,
  notifyUser,
  notifyMultipleUsers,
  notifyOrderStatus,
  notifyCouponAvailable
};
