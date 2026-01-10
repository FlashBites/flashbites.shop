# SendGrid Email Setup Guide

## Why SendGrid?
- ✅ **100 emails/day FREE forever** (perfect for OTP, welcome emails, etc.)
- ✅ Works reliably on Railway, Vercel, Render, etc.
- ✅ No SMTP timeout issues
- ✅ Better deliverability than Gmail SMTP
- ✅ Real-time analytics and tracking

## Quick Setup (5 minutes)

### Step 1: Create SendGrid Account
1. Go to https://sendgrid.com/
2. Click "Start for Free"
3. Sign up with your email
4. Verify your email address

### Step 2: Create API Key
1. After login, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name: `FlashBites Production`
4. Permissions: **Full Access** (or Mail Send if you prefer restricted)
5. Click **Create & View**
6. **COPY THE API KEY NOW** (you won't see it again!)
   - Example: `SG.xxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`

### Step 3: Verify Sender Identity

**Option A: Single Sender Verification (Recommended for testing)**
1. Go to **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Click **Create New Sender**
3. Fill in:
   - From Name: `FlashBites`
   - From Email: `your-email@gmail.com` (use your real email)
   - Reply To: Same as above
   - Company Address: Any valid address
4. Click **Create**
5. Check your email and verify the sender

**Option B: Domain Authentication (For production - Optional)**
- Go to **Settings** → **Sender Authentication** → **Authenticate Your Domain**
- Follow steps to add DNS records to your domain
- Recommended once you have a custom domain

### Step 4: Add to Railway
1. Go to Railway Dashboard → Your Project → Variables
2. Add these two variables:
```
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=your-verified-email@gmail.com
```

### Step 5: Test It!
```bash
# Railway will auto-deploy after you add the variables
# Check logs for: "✅ SendGrid initialized successfully"
# Test registration with any email address
```

## Environment Variables Summary

Add these to Railway:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
SENDGRID_FROM_EMAIL=your-verified-email@gmail.com

# Other required variables (if not already set)
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
BACKEND_URL=https://flashbites-backend.up.railway.app
FRONTEND_URL=https://flashbites.vercel.app

# VAPID Keys for Push Notifications
VAPID_PUBLIC_KEY=BLtMIszEVonY2KW3DxIWZMgYPx_Myj8Zx4UYTd1ZcgvqD7f5d7EJpTx2gLFfmwXuEPjGKCPWRLFFrHGYK3n6T18
VAPID_PRIVATE_KEY=weaou9AD6rcRzOv9k6dIYVIgP-cm2HTE0gtiEGcFtwA
```

## Testing Locally

1. Add to your `.env` file:
```bash
SENDGRID_API_KEY=SG.your_api_key
SENDGRID_FROM_EMAIL=your-verified-email@gmail.com
```

2. Test:
```bash
cd backend
npm install
npm start
```

3. Try registration/OTP:
```bash
curl -X POST http://localhost:8080/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","purpose":"verification"}'
```

## SendGrid Free Tier Limits
- **100 emails per day** - FREE forever
- 2,000 contacts
- 1 teammate
- Email support

**Need more?** Upgrade later:
- Essentials: $19.95/mo → 50,000 emails/month
- Pro: $89.95/mo → 100,000 emails/month

## Troubleshooting

### "Forbidden: You do not have authorization"
- ✅ Make sure sender email is verified in SendGrid
- ✅ Check API key has Mail Send permissions
- ✅ Verify SENDGRID_FROM_EMAIL matches verified sender

### "The from address does not match a verified Sender Identity"
- ✅ Go to Settings → Sender Authentication
- ✅ Verify the email address you're using
- ✅ Update SENDGRID_FROM_EMAIL in Railway to match

### Still not working?
Check Railway logs for:
- ✅ "SendGrid initialized successfully"
- ✅ "Using SendGrid API..."
- ✅ "Email sent to [email] via SendGrid"
- ❌ Any error messages

OTPs are always logged to Railway logs as backup:
```
📧 Sending OTP to user@example.com: 123456 (verification)
```

## Email Templates

All emails use FlashBites branding:
- 🔐 **OTP Verification** - For account verification and password reset
- 👋 **Welcome Email** - Sent after successful registration
- ✅ **Password Reset Success** - Confirmation after password change

Templates include:
- Responsive HTML design
- FlashBites orange branding (#f97316)
- Professional layout
- Clear call-to-actions

## Migration Complete

✅ Migrated from: Gmail SMTP (unreliable in production)
✅ Migrated to: SendGrid (reliable, free, production-ready)
✅ Changes: Installed `@sendgrid/mail`, updated `emailService.js`
✅ Backup: OTPs always logged to console for debugging

## Next Steps

1. ✅ Set up SendGrid account
2. ✅ Get API key
3. ✅ Verify sender email
4. ✅ Add to Railway variables
5. ✅ Test registration flow
6. ✅ Add VAPID keys for push notifications
7. ⏳ Implement frontend notification UI

---

**Ready to deploy!** After adding the SendGrid variables to Railway, your email system will work perfectly for any user worldwide. 🚀
