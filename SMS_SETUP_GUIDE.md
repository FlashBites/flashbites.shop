# SMS Notifications Setup Guide

FlashBites now supports SMS notifications for all critical order updates. This guide will help you configure SMS services.

## 📱 SMS Notifications

SMS notifications are sent for the following events:

1. **Order Confirmation** - When order is placed (includes OTP)
2. **Order Ready** - When restaurant marks order as ready
3. **Out for Delivery** - When delivery partner picks up the order
4. **Order Delivered** - When order is successfully delivered
5. **Order Cancelled** - When order is cancelled

## 🔧 Configuration Options

FlashBites supports multiple SMS providers. Choose one based on your region and requirements:

### Option 1: Twilio (Global)

**Best for:** Global reach, reliable delivery

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your credentials from the Twilio Console
3. Add to `.env`:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

4. Install Twilio SDK:
```bash
npm install twilio
```

**Pricing:** Pay-as-you-go, ~$0.0075 per SMS

---

### Option 2: MSG91 (India)

**Best for:** India-specific, cost-effective

1. Sign up at [MSG91](https://msg91.com/)
2. Get your Auth Key and Sender ID
3. Add to `.env`:

```env
MSG91_AUTH_KEY=your_auth_key
MSG91_SENDER_ID=FLSHBT
```

**Pricing:** ₹0.15 - ₹0.25 per SMS

---

### Option 3: AWS SNS (Global)

**Best for:** AWS ecosystem, high volume

1. Configure AWS credentials
2. Add to `.env`:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

3. Install AWS SDK:
```bash
npm install aws-sdk
```

**Pricing:** $0.00645 per SMS (US)

---

## 🚀 Quick Start

### Development Mode

Without any SMS provider configured, all SMS messages are **logged to console**:

```
📱 SMS to +919876543210: FlashBites Order Confirmed!

Order #12345678
Restaurant: Pizza Palace
Total: ₹450

Your Delivery OTP: 1234

Track your order in the app.
```

This allows you to:
- Test the complete flow
- See exact SMS content
- Develop without SMS costs

### Production Mode

1. Choose a provider (Twilio recommended for global, MSG91 for India)
2. Add credentials to `.env`
3. Install required SDK if needed
4. Restart backend server
5. SMS will be sent automatically

## 📋 SMS Templates

### Order Confirmation
```
FlashBites Order Confirmed!

Order #12345678
Restaurant: Pizza Palace
Total: ₹450

Your Delivery OTP: 1234

Track your order in the app.
```

### Out for Delivery
```
Your FlashBites order #12345678 is out for delivery!

Delivery Partner: Rajesh Kumar
Contact: +919876543210

Please keep your OTP ready.
```

### Order Delivered
```
Your FlashBites order #12345678 has been delivered successfully!

Thank you for ordering with us. Enjoy your meal! 😊
```

### Order Cancelled
```
Your FlashBites order #12345678 has been cancelled.

Reason: Restaurant not available

Refund will be processed within 5-7 business days.
```

## 🔐 Security Best Practices

1. **Never commit** SMS credentials to Git
2. **Use environment variables** for all sensitive data
3. **Rotate credentials** periodically
4. **Monitor usage** to detect anomalies
5. **Rate limit** SMS to prevent abuse

## 💰 Cost Optimization

1. **Batch notifications** when possible
2. **Use transactional routes** (cheaper than promotional)
3. **Monitor failed deliveries** to avoid wastage
4. **Set daily limits** in provider dashboard
5. **Use DND-compliant** sender IDs

## 🧪 Testing

### Test SMS Sending

```javascript
const { sendOrderConfirmationSMS } = require('./backend/src/utils/smsService');

sendOrderConfirmationSMS(
  '+919876543210',
  '507f1f77bcf86cd799439011',
  'Test Restaurant',
  450,
  '1234'
);
```

### Verify Logs

Check console output for:
```
📱 SMS to +919876543210: [message content]
✅ SMS sent successfully via Twilio. SID: SM...
```

## 🌍 International Format

Phone numbers must be in **E.164 format**:

```
✅ Correct:
+919876543210 (India)
+14155552671 (US)
+447911123456 (UK)

❌ Incorrect:
9876543210
(415) 555-2671
+91 98765 43210
```

The system automatically handles formatting for India (+91).

## 📊 Monitoring

Track SMS delivery in provider dashboards:

- **Twilio Console:** Real-time logs, delivery reports
- **MSG91 Dashboard:** Campaign analytics, delivery status
- **AWS CloudWatch:** SNS metrics and logs

## ❓ Troubleshooting

### SMS not sending

1. Check credentials in `.env`
2. Verify phone number format
3. Check console logs for errors
4. Verify account balance
5. Check DND restrictions (India)

### Messages delayed

1. Provider API might be slow
2. High traffic on provider network
3. Recipient's network issues
4. Check provider status page

### Wrong content

1. Check SMS templates in `smsService.js`
2. Verify data being passed
3. Check character limits (160 chars per SMS)

## 🔄 Migration from Email-only

SMS notifications work **alongside** email notifications:

- Critical updates → Email + SMS
- Marketing → Email only
- Urgent alerts → SMS only

No code changes needed - SMS is auto-enabled when configured.

## 📞 Support

For provider-specific issues:
- **Twilio:** https://support.twilio.com
- **MSG91:** https://msg91.com/help
- **AWS SNS:** AWS Support

For FlashBites integration:
- Check backend logs
- Review `smsService.js`
- Test in development mode first

---

## ✅ Checklist

- [ ] Choose SMS provider
- [ ] Sign up and get credentials
- [ ] Add credentials to `.env`
- [ ] Install SDK (if required)
- [ ] Test in development
- [ ] Monitor first production sends
- [ ] Set up billing alerts
- [ ] Document any customizations

**Ready to go!** 🚀 Your customers will now receive SMS for all order updates.
