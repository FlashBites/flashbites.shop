# FlashBites - Deployment Guide

## 🚀 Production Deployment Checklist

### ✅ Pre-Deployment Fixes Applied

1. **Environment Variables Setup** ✓
2. **CORS Configuration** ✓
3. **Payment Gateway Integration** ✓
4. **Error Handling** ✓
5. **Security Middleware** ✓

---

## 📦 Frontend Deployment (Vercel)

### Recommended: ⭐ **Vercel** (Best for React/Vite)

#### Why Vercel?
- ✅ Zero configuration for Vite projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier sufficient for most apps
- ✅ Automatic deployments from Git
- ✅ Environment variables management
- ✅ Built-in analytics

#### Deployment Steps:

1. **Push to GitHub**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Select `frontend` folder as root directory

3. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables** (in Vercel Dashboard)
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
   VITE_GOOGLE_MAPS_API_KEY=your_key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

---

## 🖥️ Backend Deployment

### Recommended: ⭐ **Railway** or **Render**

### Option 1: Railway (Recommended - Best Overall)

#### Why Railway?
- ✅ Extremely easy setup
- ✅ Free $5/month credit
- ✅ PostgreSQL/MongoDB support
- ✅ Automatic HTTPS
- ✅ Environment variables
- ✅ GitHub auto-deploy
- ✅ Affordable pricing: ~$5-10/month
- ✅ Great for Node.js + MongoDB

#### Deployment Steps:

1. **Create railway.json** (already configured below)

2. **Push to GitHub**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Backend deployment"
   git branch -M main
   git remote add origin <your-backend-repo>
   git push -u origin main
   ```

3. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your backend repository

4. **Add MongoDB Database**
   - In Railway dashboard, click "+ New"
   - Select "Database" → "MongoDB"
   - Copy the connection string

5. **Configure Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add all variables from `.env` file

6. **Deploy**
   - Railway will auto-deploy
   - Your API will be live at `https://your-app.up.railway.app`

---

### Option 2: Render (Great Free Tier)

#### Why Render?
- ✅ Generous free tier
- ✅ Free SSL
- ✅ Auto-deploy from Git
- ✅ Managed MongoDB available
- ✅ Easy scaling

#### Deployment Steps:

1. **Push to GitHub** (same as Railway)

2. **Create Web Service on Render**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New +" → "Web Service"
   - Connect your backend repository

3. **Configure Service**
   ```
   Name: flashbites-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   - In Render dashboard → Environment
   - Add all variables from `.env`
   - Important: Update `MONGO_URI` with Render's MongoDB or MongoDB Atlas

5. **Deploy**
   - Render will build and deploy
   - Your API: `https://flashbites-backend.onrender.com`

---

### Option 3: DigitalOcean App Platform

#### Why DigitalOcean?
- ✅ Reliable infrastructure
- ✅ $200 free credit (60 days)
- ✅ Easy MongoDB setup
- ✅ Professional grade
- ✅ Great documentation
- ✅ Cost: ~$5-12/month after free tier

---

### Option 4: Heroku (Still Good, But Paid)

#### Why Heroku?
- ✅ Very popular
- ✅ Good documentation
- ✅ Easy add-ons (MongoDB Atlas)
- ❌ No free tier anymore
- 💰 Cost: ~$7/month minimum

---

## 🗄️ Database Options

### Recommended: **MongoDB Atlas** (Best for MongoDB)

#### Why MongoDB Atlas?
- ✅ Free tier: 512MB storage
- ✅ Global deployment
- ✅ Automatic backups
- ✅ Built-in monitoring
- ✅ Works with all platforms

#### Setup:
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Create database user
4. Whitelist all IPs: `0.0.0.0/0` (for production, restrict this)
5. Get connection string
6. Update `MONGO_URI` in your deployment platform

---

## 🔐 Production Environment Variables

### Backend (.env for production)

```env
NODE_ENV=production
PORT=8080

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/flashbites?retryWrites=true&w=majority

# JWT (Generate new secrets!)
JWT_SECRET=<generate-long-random-string>
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=<generate-another-long-random-string>
JWT_REFRESH_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateways (LIVE keys)
STRIPE_SECRET_KEY=sk_live_xxxxx
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_live_secret

# Google APIs
GOOGLE_MAPS_API_KEY=your_key
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Email (Gmail or SendGrid)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# URLs (Update with your domains)
BACKEND_URL=https://your-backend.railway.app
FRONTEND_URL=https://your-app.vercel.app

# Session
SESSION_SECRET=<generate-long-random-string>
```

### Generate Secure Secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📋 Deployment Comparison

| Platform | Best For | Free Tier | Cost (Paid) | Ease | Speed |
|----------|----------|-----------|-------------|------|-------|
| **Railway** | Backend + DB | $5 credit | $5-10/mo | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ |
| **Render** | Backend | ✅ 750hrs/mo | $7/mo | ⭐⭐⭐⭐⭐ | ⚡⚡ |
| **Vercel** | Frontend | ✅ Generous | Free | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ |
| **DigitalOcean** | Full Stack | $200 (60d) | $5-12/mo | ⭐⭐⭐⭐ | ⚡⚡⚡ |
| **MongoDB Atlas** | Database | ✅ 512MB | $9/mo | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ |

---

## 🎯 Recommended Stack for FlashBites

### Best Combination:
```
Frontend: Vercel (Free)
Backend: Railway ($5-10/month)
Database: MongoDB Atlas (Free tier)
Total Cost: $5-10/month
```

### Alternative (Fully Free):
```
Frontend: Vercel (Free)
Backend: Render Free Tier
Database: MongoDB Atlas (Free)
Total Cost: $0/month
Note: Render free tier sleeps after inactivity
```

---

## 🚨 Important Production Updates Needed

### 1. Update CORS Origins
In `backend/server.js`, update allowed origins:
```javascript
const allowedOrigins = [
  'https://your-app.vercel.app',
  'https://your-custom-domain.com'
];
```

### 2. Update Frontend API URL
In `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

### 3. Razorpay Live Keys
Replace test keys with live keys in:
- Backend `.env`: `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`
- Frontend `.env`: `VITE_RAZORPAY_KEY_ID`

### 4. Enable HTTPS Only
Ensure all URLs use `https://` in production

---

## 📊 Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test restaurant creation and management
- [ ] Test menu item CRUD operations
- [ ] Test order placement (all payment methods)
- [ ] Test Razorpay payment with ₹1
- [ ] Test order status updates
- [ ] Test admin panel access
- [ ] Verify email notifications
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Verify all images load correctly
- [ ] Test Google Maps integration
- [ ] Monitor server logs for errors

---

## 🔧 Maintenance & Monitoring

### Recommended Tools:
- **Error Tracking**: Sentry (free tier)
- **Uptime Monitoring**: UptimeRobot (free)
- **Analytics**: Google Analytics / Vercel Analytics
- **Logging**: Built-in platform logs

---

## 💡 Performance Optimization Tips

1. **Enable Gzip Compression** ✅ (Already enabled)
2. **Add Rate Limiting** ✅ (Already enabled)
3. **Use CDN for Images** ✅ (Cloudinary)
4. **Enable Caching Headers**
5. **Minify Assets** ✅ (Vite does this)
6. **Lazy Load Images**
7. **Optimize Database Queries**

---

## 🎉 You're Ready to Deploy!

### Quick Start:
1. ✅ Fix any remaining console errors (optional)
2. ✅ Set up MongoDB Atlas
3. ✅ Deploy backend to Railway
4. ✅ Deploy frontend to Vercel
5. ✅ Update environment variables
6. ✅ Test thoroughly
7. ✅ Go live! 🚀

### Need Help?
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

Good luck with your launch! 🎊
