#!/bin/bash

# FlashBites - OTP & Performance Fix Verification

echo "🔍 Verifying FlashBites Fixes..."
echo "================================"
echo ""

# 1. Check Twilio Package
echo "1️⃣ Checking Twilio Package Installation..."
cd backend
if grep -q "twilio" package.json; then
    echo "   ✅ Twilio package found in package.json"
    TWILIO_VERSION=$(grep "twilio" package.json | grep -o '"[0-9.]*"' | tr -d '"')
    echo "   📦 Version: $TWILIO_VERSION"
else
    echo "   ❌ Twilio package NOT found"
fi
echo ""

# 2. Check Environment Variables
echo "2️⃣ Checking Twilio Environment Variables..."
if grep -q "TWILIO_ACCOUNT_SID" .env && grep -q "TWILIO_AUTH_TOKEN" .env && grep -q "TWILIO_PHONE_NUMBER" .env; then
    echo "   ✅ All Twilio credentials configured in .env"
    echo "   📱 Phone: $(grep TWILIO_PHONE_NUMBER .env | cut -d'=' -f2)"
else
    echo "   ❌ Twilio credentials missing in .env"
fi
echo ""

# 3. Check SMS Service
echo "3️⃣ Checking SMS Service Implementation..."
if grep -q "sendOrderConfirmationSMS" src/utils/smsService.js; then
    echo "   ✅ SMS service functions found"
    echo "   📧 Functions available:"
    grep "^const send.*SMS" src/utils/smsService.js | sed 's/const /     - /' | sed 's/ = async.*//'
else
    echo "   ❌ SMS service not properly configured"
fi
echo ""

# 4. Check OTP Generation
echo "4️⃣ Checking OTP Generation in Order Controller..."
if grep -q "deliveryOtp" src/controllers/orderController.js; then
    echo "   ✅ OTP generation found in order controller"
    OTP_LINE=$(grep -n "deliveryOtp = Math.floor" src/controllers/orderController.js | head -1)
    echo "   📍 Line: $OTP_LINE"
else
    echo "   ❌ OTP generation not found"
fi
echo ""

# 5. Check Frontend Build
echo "5️⃣ Checking Frontend Build Status..."
cd ../frontend
if [ -d "dist" ]; then
    echo "   ✅ Frontend build exists"
    BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
    echo "   📦 Size: $BUILD_SIZE"
else
    echo "   ⚠️  Frontend not built yet (run: npm run build)"
fi
echo ""

# 6. Check Performance Optimizations
echo "6️⃣ Checking Performance Optimizations..."
if grep -q "React.memo" src/pages/DeliveryPartnerDashboard.jsx; then
    echo "   ✅ React.memo optimizations applied"
    MEMO_COUNT=$(grep -c "React.memo" src/pages/DeliveryPartnerDashboard.jsx)
    echo "   🔧 Memoized components: $MEMO_COUNT"
else
    echo "   ❌ Performance optimizations not applied"
fi

if grep -q "useCallback" src/pages/DeliveryPartnerDashboard.jsx; then
    echo "   ✅ useCallback hooks implemented"
    CALLBACK_COUNT=$(grep -c "useCallback" src/pages/DeliveryPartnerDashboard.jsx)
    echo "   🔧 Memoized callbacks: $CALLBACK_COUNT"
else
    echo "   ❌ useCallback not implemented"
fi

if grep -q "useMemo" src/pages/DeliveryPartnerDashboard.jsx; then
    echo "   ✅ useMemo hooks implemented"
    MEMO_COUNT=$(grep -c "useMemo" src/pages/DeliveryPartnerDashboard.jsx)
    echo "   🔧 Memoized calculations: $MEMO_COUNT"
else
    echo "   ❌ useMemo not implemented"
fi
echo ""

# 7. Check TrackOrder Page
echo "7️⃣ Checking TrackOrder Page..."
if [ -f "src/pages/TrackOrder.jsx" ]; then
    echo "   ✅ TrackOrder page exists"
    if grep -q "/track/:id" src/App.jsx; then
        echo "   ✅ Route configured in App.jsx"
    else
        echo "   ❌ Route not configured"
    fi
else
    echo "   ❌ TrackOrder page not found"
fi
echo ""

echo "================================"
echo "🎉 Verification Complete!"
echo ""
echo "📋 Summary:"
echo "   • OTP System: Email + SMS (Twilio)"
echo "   • Performance: React.memo + useCallback + useMemo"
echo "   • TrackOrder: Public route at /track/:id"
echo ""
echo "🧪 To test OTP delivery:"
echo "   1. Place a test order"
echo "   2. Check customer email for OTP"
echo "   3. Check customer SMS for OTP"
echo "   4. Visit /track/{orderId} to see OTP"
echo ""
echo "⚡ To verify performance:"
echo "   1. Go to /delivery-dashboard"
echo "   2. Click 'View Details' on any order"
echo "   3. Modal should open instantly (no lag)"
echo ""
