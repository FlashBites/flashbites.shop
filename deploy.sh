#!/bin/bash

# FlashBites Deployment Script
# This script helps you deploy FlashBites to production

echo "🚀 FlashBites Deployment Helper"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - FlashBites v1.0"
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "📋 Pre-Deployment Checklist:"
echo ""
echo "Backend:"
echo "  [ ] MongoDB Atlas cluster created?"
echo "  [ ] Environment variables ready?"
echo "  [ ] Razorpay live keys obtained?"
echo "  [ ] Cloudinary account set up?"
echo ""
echo "Frontend:"
echo "  [ ] Updated VITE_API_URL with backend URL?"
echo "  [ ] Razorpay live key added?"
echo "  [ ] Google Maps API key added?"
echo ""

read -p "Have you completed the checklist? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please complete the checklist first!"
    exit 1
fi

echo ""
echo "🎯 Choose deployment option:"
echo "1) Deploy Backend to Railway"
echo "2) Deploy Frontend to Vercel"
echo "3) Both (recommended)"
echo ""

read -p "Enter choice (1-3): " choice

case $choice in
    1|3)
        echo ""
        echo "📦 Backend Deployment Steps:"
        echo "1. Go to https://railway.app"
        echo "2. Sign in with GitHub"
        echo "3. Click 'New Project'"
        echo "4. Select 'Deploy from GitHub repo'"
        echo "5. Choose your backend repository"
        echo "6. Add MongoDB database (+ New → Database → MongoDB)"
        echo "7. Add all environment variables from backend/.env"
        echo "8. Railway will auto-deploy!"
        echo ""
        read -p "Press Enter when backend is deployed..."
        ;;
esac

case $choice in
    2|3)
        echo ""
        echo "🌐 Frontend Deployment Steps:"
        echo "1. Go to https://vercel.com"
        echo "2. Sign in with GitHub"
        echo "3. Click 'New Project'"
        echo "4. Import your frontend repository"
        echo "5. Set Root Directory to: frontend"
        echo "6. Framework Preset: Vite"
        echo "7. Add environment variables:"
        echo "   - VITE_API_URL (your Railway backend URL)"
        echo "   - VITE_RAZORPAY_KEY_ID"
        echo "   - VITE_GOOGLE_MAPS_API_KEY"
        echo "8. Click Deploy!"
        echo ""
        read -p "Press Enter when frontend is deployed..."
        ;;
esac

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🧪 Post-Deployment Testing:"
echo "1. Test user registration and login"
echo "2. Test restaurant creation"
echo "3. Test menu item addition"
echo "4. Test order placement (COD)"
echo "5. Test payment with Razorpay"
echo "6. Test on mobile device"
echo ""
echo "📊 Monitor your deployment:"
echo "- Backend logs: Railway dashboard"
echo "- Frontend logs: Vercel dashboard"
echo "- Database: MongoDB Atlas dashboard"
echo ""
echo "🎉 Your FlashBites app is now live!"
echo ""
echo "Need help? Check DEPLOYMENT_GUIDE.md for detailed instructions."
