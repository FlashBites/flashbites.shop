# FlashBites Backend

Food delivery platform backend API built with Node.js, Express, and MongoDB.

## 🚀 Deployment

### Railway (Recommended)
1. Push to GitHub
2. Connect to Railway
3. Add MongoDB database
4. Set environment variables
5. Deploy automatically

### Environment Variables Required
```
NODE_ENV=production
PORT=8080
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<generate-secure-secret>
JWT_REFRESH_SECRET=<generate-secure-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
STRIPE_SECRET_KEY=<your-stripe-key>
GOOGLE_MAPS_API_KEY=<your-google-maps-key>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-app-password>
BACKEND_URL=<your-backend-url>
FRONTEND_URL=<your-frontend-url>
SESSION_SECRET=<generate-secure-secret>
```

## 📦 Installation

```bash
npm install
```

## 🏃 Running

```bash
# Development
npm run dev

# Production
npm start
```

## 🔒 Security Features
- Helmet.js for security headers
- CORS configured
- Rate limiting
- MongoDB sanitization
- XSS protection
- JWT authentication

## 📚 API Documentation
See DEPLOYMENT_GUIDE.md for full documentation
