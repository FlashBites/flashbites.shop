# Quick Setup Guide for New Features

## Prerequisites
- Node.js v22.18.0
- MongoDB running on localhost:27017
- Gmail account (for OTP emails)

## 1. Email Configuration (Required)

### Gmail Setup:
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to Security > 2-Step Verification > App passwords
4. Generate an app password for "Mail"
5. Copy the 16-character password

### Update `.env` file:
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info.flashbites.in@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
```

## 2. Google OAuth (Optional)

### Google Cloud Console Setup:
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:8080/api/auth/google/callback`
7. Copy Client ID and Client Secret

### Update `.env` file:
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 3. Start the Application

### Backend:
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:8080

### Frontend:
```bash
cd frontend
npm run dev
```
Server runs on: http://localhost:3001

## 4. Test New Features

### Test Registration with OTP:
1. Go to http://localhost:3001/register
2. Fill in all fields (name, email, phone, password)
3. Click "Continue"
4. Check your email for OTP
5. Enter OTP to complete registration
6. You'll be logged in automatically

### Test Forgot Password:
1. Go to http://localhost:3001/forgot-password
2. Enter your email
3. Check email for OTP
4. Enter OTP
5. Set new password
6. Login with new password

### Test Google Login (if configured):
1. Go to http://localhost:3001/login
2. Click "Sign in with Google"
3. Select Google account
4. Authorize FlashBites
5. Automatically logged in

### Test Location Features:
1. Go to http://localhost:3001
2. Allow location permission when prompted
3. See nearby restaurants with distance
4. Restaurants sorted by proximity

## 5. Troubleshooting

### Email Not Receiving OTP:
- Check spam folder
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Ensure Gmail App Password is used (not regular password)
- Check email service logs in backend terminal

### Google Login Not Working:
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Check authorized redirect URI matches exactly
- Restart backend server after adding credentials

### Location Not Working:
- Must use HTTPS in production
- Allow location permission in browser
- Check browser console for errors
- Ensure restaurants have valid coordinates

### Phone Validation Error:
- Must be exactly 10 digits
- No spaces or special characters
- Format: 1234567890

### Duplicate Email Error:
- Email already registered
- Try forgot password instead
- Or use different email

## 6. Database Setup

The application will automatically:
- Create indexes for email and phone
- Add OTP fields to existing users
- No manual migration needed

## 7. Production Deployment

Before deploying:

1. **Update Environment Variables:**
   ```bash
   NODE_ENV=production
   FRONTEND_URL=https://yourdomain.com
   SESSION_SECRET=generate_strong_random_secret
   ```

2. **Email Service:**
   - Consider using SendGrid, AWS SES, or Mailgun
   - Gmail has 500 emails/day limit

3. **Google OAuth:**
   - Add production redirect URI
   - Update authorized domains

4. **Location:**
   - Ensure HTTPS enabled
   - Update CORS settings

## 8. Testing Checklist

Before going live, test:
- [ ] User registration with OTP
- [ ] Email delivery (not in spam)
- [ ] OTP expiration after 10 minutes
- [ ] Duplicate email prevention
- [ ] Duplicate phone prevention
- [ ] Forgot password flow
- [ ] Password reset OTP
- [ ] Google OAuth login (if enabled)
- [ ] Location permission request
- [ ] Distance calculation
- [ ] Welcome email
- [ ] Password reset email

## Need Help?

Check `FEATURES_IMPLEMENTATION.md` for detailed documentation.

## Quick Test Commands

```bash
# Test OTP email sending
curl -X POST http://localhost:8080/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","purpose":"registration"}'

# Test OTP verification
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# Check if backend is running
curl http://localhost:8080/api/health
```

## Default Ports

- Backend API: 8080
- Frontend: 3001
- MongoDB: 27017

## Success! 🎉

You should now have:
- ✅ Forgot password working
- ✅ OTP verification on registration
- ✅ No duplicate emails
- ✅ Phone number required
- ✅ Google OAuth (if configured)
- ✅ Location-based restaurant filtering

Happy coding! 🚀
