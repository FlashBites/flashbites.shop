// SMS Service using Twilio
// Alternative: Use any SMS provider API (Twilio, SNS, MSG91, etc.)

/**
 * Send SMS using Twilio API
 * Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env
 * 
 * For development: Messages are logged to console
 * For production: Integrate with your SMS provider
 */

const sendSMS = async (phoneNumber, message) => {
  // Always log SMS for debugging
  console.log(`📱 SMS to ${phoneNumber}: ${message}`);

  try {
    // Check if Twilio credentials are configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      // Initialize Twilio client (lazy load to avoid errors if not installed)
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      // Send SMS via Twilio
      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      console.log(`✅ SMS sent successfully via Twilio. SID: ${result.sid}`);
      return { success: true, provider: 'twilio', sid: result.sid };
    }

    // Alternative: MSG91 (Popular in India)
    if (process.env.MSG91_AUTH_KEY && process.env.MSG91_SENDER_ID) {
      const response = await fetch('https://api.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: {
          'authkey': process.env.MSG91_AUTH_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: process.env.MSG91_SENDER_ID,
          route: '4', // Transactional route
          country: '91', // India
          sms: [{
            message: message,
            to: [phoneNumber.replace('+91', '').replace('+', '')]
          }]
        })
      });

      if (response.ok) {
        console.log('✅ SMS sent successfully via MSG91');
        return { success: true, provider: 'msg91' };
      }
    }

    // Alternative: AWS SNS
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION) {
      // Note: Requires aws-sdk package
      // const AWS = require('aws-sdk');
      // const sns = new AWS.SNS({ region: process.env.AWS_REGION });
      // await sns.publish({
      //   Message: message,
      //   PhoneNumber: phoneNumber
      // }).promise();
      console.log('⚠️ AWS SNS configured but not implemented in this version');
    }

    // Development mode - just log the message
    console.log('ℹ️ SMS service not configured. Message logged above.');
    console.log('ℹ️ To enable SMS, configure TWILIO or MSG91 credentials in .env');
    return { success: true, provider: 'console', development: true };

  } catch (error) {
    console.error('❌ SMS sending failed:', error.message);
    // Don't throw error - SMS is not critical, log and continue
    return { success: false, error: error.message };
  }
};

/**
 * Send Order Confirmation SMS
 */
const sendOrderConfirmationSMS = async (phoneNumber, orderId, restaurantName, total, deliveryOtp) => {
  const message = `FlashBites Order Confirmed!\n\nOrder #${orderId.slice(-8)}\nRestaurant: ${restaurantName}\nTotal: ₹${total}\n\nYour Delivery OTP: ${deliveryOtp}\n\nTrack your order in the app.`;
  return await sendSMS(phoneNumber, message);
};

/**
 * Send Order Out for Delivery SMS
 */
const sendOutForDeliverySMS = async (phoneNumber, orderId, deliveryPartnerName, deliveryPartnerPhone) => {
  const message = `Your FlashBites order #${orderId.slice(-8)} is out for delivery!\n\nDelivery Partner: ${deliveryPartnerName}\nContact: ${deliveryPartnerPhone}\n\nPlease keep your OTP ready.`;
  return await sendSMS(phoneNumber, message);
};

/**
 * Send Order Delivered SMS
 */
const sendOrderDeliveredSMS = async (phoneNumber, orderId) => {
  const message = `Your FlashBites order #${orderId.slice(-8)} has been delivered successfully!\n\nThank you for ordering with us. Enjoy your meal! 😊`;
  return await sendSMS(phoneNumber, message);
};

/**
 * Send Delivery OTP SMS
 */
const sendDeliveryOtpSMS = async (phoneNumber, orderId, otp) => {
  const message = `FlashBites Delivery OTP\n\nOrder #${orderId.slice(-8)}\nYour OTP: ${otp}\n\nShare this with delivery partner to confirm delivery.`;
  return await sendSMS(phoneNumber, message);
};

/**
 * Send Order Cancelled SMS
 */
const sendOrderCancelledSMS = async (phoneNumber, orderId, reason) => {
  const message = `Your FlashBites order #${orderId.slice(-8)} has been cancelled.\n\nReason: ${reason}\n\nRefund will be processed within 5-7 business days.`;
  return await sendSMS(phoneNumber, message);
};

/**
 * Send Order Ready for Pickup SMS
 */
const sendOrderReadySMS = async (phoneNumber, orderId, restaurantName) => {
  const message = `Your order #${orderId.slice(-8)} from ${restaurantName} is ready!\n\nOur delivery partner will pick it up shortly.`;
  return await sendSMS(phoneNumber, message);
};

/**
 * Send Delivery Partner Assignment SMS to Customer
 */
const sendDeliveryPartnerAssignedSMS = async (phoneNumber, orderId, partnerName, partnerPhone) => {
  const message = `FlashBites: ${partnerName} is assigned to deliver your order #${orderId.slice(-8)}\n\nContact: ${partnerPhone}\n\nTrack in real-time in the app.`;
  return await sendSMS(phoneNumber, message);
};

module.exports = {
  sendSMS,
  sendOrderConfirmationSMS,
  sendOutForDeliverySMS,
  sendOrderDeliveredSMS,
  sendDeliveryOtpSMS,
  sendOrderCancelledSMS,
  sendOrderReadySMS,
  sendDeliveryPartnerAssignedSMS
};
