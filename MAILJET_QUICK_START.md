# 🚀 Quick Setup: Mailjet Email for FlashBites

## ⚡ 3-Minute Setup

### 1️⃣ Create Account
```
https://www.mailjet.com/
→ Sign Up Free
→ Verify email
```

### 2️⃣ Get API Keys
```
Account Settings (top right)
→ REST API
→ API Key Management
→ Copy both keys
```

### 3️⃣ Add to Railway
```
MAILJET_API_KEY=your_api_key_here
MAILJET_SECRET_KEY=your_secret_key_here
MAILJET_FROM_EMAIL=noreply@flashbites.shop
```

### 4️⃣ Done! ✅
Railway will auto-deploy. Emails will work for **ANY user** immediately!

---

## 🎯 Why Mailjet?

✅ **200 emails/day FREE**
✅ **Send to ANY email** - No verification needed!
✅ No "test mode" restrictions
✅ Works on Railway instantly
✅ No SMTP timeouts

---

## 📝 Full Guide

See `MAILJET_SETUP_GUIDE.md` for detailed instructions.

---

## 🧪 Test Locally

```bash
cd backend
npm install
node test-mailjet.js your-email@example.com
```

---

## ✅ Production Checklist

- [ ] Mailjet account created
- [ ] API keys copied
- [ ] Added to Railway variables
- [ ] Code pushed (already done ✅)
- [ ] Railway redeployed
- [ ] Tested OTP flow

---

## 🌐 URLs

- **Frontend**: https://flashbites.shop
- **Backend**: https://flashbites-backend.up.railway.app
- **Mailjet**: https://www.mailjet.com/

---

**That's it!** 🎉 Your email system will work for any user worldwide!
