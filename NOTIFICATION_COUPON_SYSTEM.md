# 🔔 Notification & Coupon System - FlashBites

## Features Implemented

### 1. Push Notifications (Desktop & Mobile)
Real-time notifications for all users, restaurant owners, and admins.

### 2. Enhanced Coupon System
Admin can create special discount coupons with advanced targeting options.

---

## 🔔 Notification System

### Features:
- ✅ **Push Notifications** - Desktop & Mobile support
- ✅ **In-App Notifications** - Persistent notification center
- ✅ **Order Status Updates** - Real-time order tracking
- ✅ **Coupon Alerts** - Special offer notifications
- ✅ **Multi-Device Support** - Subscribe multiple devices per user

### Notification Types:
1. **Order Events**: placed, confirmed, preparing, ready, picked_up, delivered, cancelled
2. **Restaurant Events**: new_restaurant, restaurant_approved, restaurant_rejected
3. **Promotional**: special_offer, coupon_available
4. **Payment**: payment_received, refund_processed

### Backend APIs:

#### Get Notifications
```http
GET /api/notifications
Authorization: Bearer {token}

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 20)
- unreadOnly: true/false (default: false)

Response:
{
  "success": true,
  "data": {
    "notifications": [...],
    "pagination": { "total": 50, "page": 1, "pages": 3 },
    "unreadCount": 5
  }
}
```

#### Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer {token}
```

#### Mark All as Read
```http
PUT /api/notifications/read-all
Authorization: Bearer {token}
```

#### Delete Notification
```http
DELETE /api/notifications/:id
Authorization: Bearer {token}
```

#### Subscribe to Push
```http
POST /api/notifications/subscribe
Authorization: Bearer {token}

Body:
{
  "endpoint": "https://fcm.googleapis.com/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  },
  "deviceType": "desktop|mobile|tablet",
  "browser": "Chrome"
}
```

#### Unsubscribe from Push
```http
POST /api/notifications/unsubscribe
Authorization: Bearer {token}

Body:
{
  "endpoint": "https://fcm.googleapis.com/..."
}
```

#### Get VAPID Public Key
```http
GET /api/notifications/vapid-public-key

Response:
{
  "success": true,
  "data": {
    "publicKey": "BEY..."
  }
}
```

---

## 🎁 Enhanced Coupon System

### New Features:
- ✅ **User-Specific Coupons** - Target specific users
- ✅ **Restaurant-Specific** - Apply to specific restaurants
- ✅ **Auto-Apply** - Automatically apply best coupon
- ✅ **Usage Limits** - Set max redemptions
- ✅ **Date Ranges** - Valid from/till dates
- ✅ **Notification Integration** - Auto-notify users

### Backend APIs:

#### Create Coupon (Admin Only)
```http
POST /api/admin/coupons
Authorization: Bearer {admin_token}

Body:
{
  "code": "FLASH50",
  "description": "Get 50% off on your first order",
  "discountType": "percentage|fixed",
  "discountValue": 50,
  "minOrderValue": 200,
  "maxDiscount": 100,
  "validFrom": "2026-01-01",
  "validTill": "2026-12-31",
  "usageLimit": 1000,
  "applicableRestaurants": ["restaurant_id_1", "restaurant_id_2"],
  "userSpecific": false,
  "applicableUsers": [],
  "autoApply": true
}

Response:
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "coupon": {...}
  }
}

Note: Creates notification for applicable users automatically!
```

#### Get All Coupons (Admin)
```http
GET /api/admin/coupons
Authorization: Bearer {admin_token}

Query Parameters:
- page: Page number
- limit: Items per page
- status: active|expired|inactive

Response:
{
  "success": true,
  "data": {
    "coupons": [...],
    "pagination": {...}
  }
}
```

#### Update Coupon (Admin)
```http
PUT /api/admin/coupons/:id
Authorization: Bearer {admin_token}

Body: {any coupon fields to update}
```

#### Delete Coupon (Admin)
```http
DELETE /api/admin/coupons/:id
Authorization: Bearer {admin_token}
```

---

## 🔐 Environment Variables

Add these to Railway backend:

```env
# Push Notifications (Required)
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

### Generate VAPID Keys:
```bash
cd backend
npm install -g web-push
web-push generate-vapid-keys
```

Copy the output and add to Railway environment variables.

---

## 📊 Database Models

### Notification Model
```javascript
{
  recipient: ObjectId (ref: User),
  type: String (enum: order_placed, order_confirmed, etc.),
  title: String,
  message: String,
  data: {
    orderId: ObjectId,
    restaurantId: ObjectId,
    couponId: ObjectId,
    amount: Number,
    metadata: Mixed
  },
  read: Boolean (default: false),
  priority: String (enum: low, medium, high),
  expiresAt: Date (default: 30 days),
  timestamps: true
}
```

### PushSubscription Model
```javascript
{
  user: ObjectId (ref: User),
  endpoint: String (unique),
  keys: {
    p256dh: String,
    auth: String
  },
  deviceType: String (enum: desktop, mobile, tablet),
  browser: String,
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Enhanced Coupon Model
```javascript
{
  code: String (unique, uppercase),
  description: String,
  discountType: String (enum: percentage, fixed),
  discountValue: Number,
  minOrderValue: Number,
  maxDiscount: Number,
  validFrom: Date,
  validTill: Date,
  usageLimit: Number,
  usedCount: Number (default: 0),
  isActive: Boolean (default: true),
  applicableRestaurants: [ObjectId],
  createdBy: ObjectId (ref: User) - NEW,
  userSpecific: Boolean - NEW,
  applicableUsers: [ObjectId] - NEW,
  autoApply: Boolean - NEW,
  timestamps: true
}
```

---

## 🎯 Auto-Notification Triggers

Notifications are automatically sent when:

1. **Order Status Changes**:
   - confirmed → Notifies customer & restaurant owner
   - preparing → Notifies customer
   - ready → Notifies customer
   - picked_up → Notifies customer
   - delivered → Notifies customer
   - cancelled → Notifies customer (high priority)

2. **Coupon Created**:
   - User-specific → Notifies target users
   - Global → Notifies all active users

3. **Restaurant Approved/Rejected** (if you add this):
   - Notifies restaurant owner

---

## 🚀 Frontend Integration (To Be Implemented)

### 1. Request Notification Permission
```javascript
// Check if browser supports notifications
if ('Notification' in window && 'serviceWorker' in navigator) {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    // Subscribe to push notifications
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey
    });
    
    // Send subscription to backend
    await api.post('/notifications/subscribe', {
      endpoint: subscription.endpoint,
      keys: subscription.toJSON().keys,
      deviceType: 'desktop',
      browser: navigator.userAgent
    });
  }
}
```

### 2. Service Worker (public/sw.js)
```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      data: data.data,
      tag: data.tag,
      requireInteraction: data.requireInteraction
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Navigate to order page if order notification
  if (event.notification.data.orderId) {
    event.waitUntil(
      clients.openWindow(`/orders/${event.notification.data.orderId}`)
    );
  }
});
```

### 3. Notification Center Component
```jsx
import { useState, useEffect } from 'react';
import { getNotifications, markAsRead } from '../api/notificationApi';

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await getNotifications();
    setNotifications(res.data.notifications);
    setUnreadCount(res.data.unreadCount);
  };

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };

  return (
    <div className="notification-center">
      <div className="header">
        Notifications ({unreadCount})
      </div>
      {notifications.map(notif => (
        <div 
          key={notif._id}
          className={!notif.read ? 'unread' : ''}
          onClick={() => handleMarkAsRead(notif._id)}
        >
          <h4>{notif.title}</h4>
          <p>{notif.message}</p>
          <span>{new Date(notif.createdAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## 📱 Testing

### Test Push Notifications:
1. Generate VAPID keys and add to Railway
2. Subscribe from frontend
3. Create test order and update status
4. Check browser notifications

### Test Coupons:
1. Login as admin
2. Create coupon with user-specific targeting
3. Check notifications for target users
4. Apply coupon at checkout

---

## 🎉 Summary

✅ **Backend Complete** - All APIs implemented
✅ **Auto-Notifications** - Order status & coupons
✅ **Multi-Device** - Desktop & mobile support
✅ **Admin Panel Ready** - Coupon management
🔄 **Frontend Pending** - Need to implement UI components

**Next Steps:**
1. Generate and add VAPID keys to Railway
2. Install web-push package: `cd backend && npm install`
3. Railway will auto-redeploy
4. Implement frontend notification UI
5. Test end-to-end flow

---

**Created**: January 10, 2026
**Status**: Backend ✅ | Frontend 🔄
