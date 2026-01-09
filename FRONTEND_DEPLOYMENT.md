# 🚀 Frontend Deployment Guide - Vercel

## Your Frontend is Ready to Deploy!

Your frontend code is now on GitHub in the `frontend` branch:
- Repository: https://github.com/amanazads/flashbites
- Branch: `frontend`

---

## 📦 Deploy to Vercel (Recommended)

### Method 1: Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository: `amanazads/flashbites`
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Set Branch**
   - In "Git Branch" section, select: `frontend`

5. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_API_URL = https://your-railway-backend-url.railway.app/api
   VITE_RAZORPAY_KEY_ID = your_razorpay_key_id
   ```
   
   **Important:** Replace with your actual Railway backend URL!

6. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at: `https://your-app-name.vercel.app`

---

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? Select your account
# - Link to existing project? N
# - Project name? flashbites-frontend
# - Directory? ./
# - Override settings? N
```

---

## ⚙️ Post-Deployment Configuration

### 1. Update Backend CORS

After deployment, update your Railway backend environment variables:

```env
FRONTEND_URL=https://your-app-name.vercel.app
```

Then redeploy backend:
```bash
cd backend
railway up
```

### 2. Test Your Deployment

✅ Visit your Vercel URL
✅ Test login/registration
✅ Browse restaurants
✅ Add items to cart
✅ Test checkout (use test mode)

---

## 🔧 Environment Variables Reference

### Required Variables in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Your backend API URL | `https://flashbites-backend.railway.app/api` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key for payments | `rzp_test_xxxxx` or `rzp_live_xxxxx` |

---

## 🎯 Alternative: Deploy to Netlify

If you prefer Netlify:

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select `amanazads/flashbites` repository
5. Select `frontend` branch
6. Configure:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
7. Add environment variables (same as Vercel)
8. Click "Deploy site"

---

## 📋 Deployment Checklist

- [ ] Frontend pushed to GitHub `frontend` branch
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] Backend FRONTEND_URL updated with Vercel URL
- [ ] Backend redeployed with new CORS settings
- [ ] Frontend deployed successfully
- [ ] Test login functionality
- [ ] Test restaurant browsing
- [ ] Test order placement
- [ ] Test payment flow (test mode)

---

## 🐛 Troubleshooting

### API Connection Errors
- Check `VITE_API_URL` is correct in Vercel
- Ensure backend `FRONTEND_URL` includes your Vercel domain
- Check Railway logs for CORS errors

### Payment Not Working
- Verify `VITE_RAZORPAY_KEY_ID` is set correctly
- Check if using test or live keys consistently
- Test with Razorpay test cards first

### Build Failures
- Check all dependencies are in package.json
- Ensure Node version compatibility (18+)
- Review build logs in Vercel dashboard

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Frontend on Vercel: `https://your-app.vercel.app`
- ✅ Backend on Railway: `https://your-backend.railway.app`
- ✅ Database on MongoDB Atlas
- ✅ Images on Cloudinary
- ✅ Payments via Razorpay

Total deployment time: ~10-15 minutes
Monthly cost: $5-10 (Railway backend only, everything else free!)

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Check your logs if something goes wrong!

Happy Deploying! 🚀
