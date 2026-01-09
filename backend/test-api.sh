#!/bin/bash

BASE_URL="http://localhost:8080/api"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "   FlashBites API Testing Script"
echo "========================================="
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
curl -s -X GET "$BASE_URL/health" | jq '.'
echo ""

# Test 2: Register User
echo -e "${YELLOW}Test 2: Register User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "password123",
    "phone": "1234567890"
  }')
echo "$REGISTER_RESPONSE" | jq '.'
USER_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.accessToken // empty')
echo ""

# Test 3: Login
echo -e "${YELLOW}Test 3: Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')
echo "$LOGIN_RESPONSE" | jq '.'
if [ -z "$USER_TOKEN" ]; then
  USER_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken // empty')
fi
echo ""

# Test 4: Get Current User
echo -e "${YELLOW}Test 4: Get Current User (Me)${NC}"
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $USER_TOKEN" | jq '.'
echo ""

# Test 5: Register Restaurant Owner
echo -e "${YELLOW}Test 5: Register Restaurant Owner${NC}"
OWNER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurant Owner",
    "email": "owner@restaurant.com",
    "password": "password123",
    "phone": "9876543210",
    "role": "restaurant_owner"
  }')
echo "$OWNER_RESPONSE" | jq '.'
OWNER_TOKEN=$(echo "$OWNER_RESPONSE" | jq -r '.data.accessToken // empty')
echo ""

# Test 6: Create Restaurant
echo -e "${YELLOW}Test 6: Create Restaurant${NC}"
RESTAURANT_RESPONSE=$(curl -s -X POST "$BASE_URL/restaurants" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OWNER_TOKEN" \
  -d '{
    "name": "Test Restaurant",
    "email": "restaurant@test.com",
    "phone": "5555555555",
    "description": "A great test restaurant",
    "cuisines": ["Italian", "Pizza"],
    "address": {
      "street": "123 Main St",
      "city": "Test City",
      "state": "Test State",
      "zipCode": "12345"
    },
    "location": {
      "coordinates": [-122.4194, 37.7749]
    },
    "timing": {
      "open": "09:00",
      "close": "22:00"
    },
    "deliveryFee": 50,
    "deliveryTime": "30-40 mins"
  }')
echo "$RESTAURANT_RESPONSE" | jq '.'
RESTAURANT_ID=$(echo "$RESTAURANT_RESPONSE" | jq -r '.data.restaurant._id // empty')
echo ""

# Test 7: Get All Restaurants
echo -e "${YELLOW}Test 7: Get All Restaurants${NC}"
curl -s -X GET "$BASE_URL/restaurants" | jq '.'
echo ""

# Test 8: Get Restaurant by ID
if [ ! -z "$RESTAURANT_ID" ]; then
  echo -e "${YELLOW}Test 8: Get Restaurant by ID${NC}"
  curl -s -X GET "$BASE_URL/restaurants/$RESTAURANT_ID" | jq '.'
  echo ""
fi

# Test 9: Add Menu Item
if [ ! -z "$RESTAURANT_ID" ]; then
  echo -e "${YELLOW}Test 9: Add Menu Item${NC}"
  MENU_RESPONSE=$(curl -s -X POST "$BASE_URL/menu/$RESTAURANT_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OWNER_TOKEN" \
    -d '{
      "name": "Margherita Pizza",
      "description": "Classic pizza with tomato and mozzarella",
      "price": 299,
      "category": "Pizza",
      "isVeg": true,
      "image": "pizza.jpg"
    }')
  echo "$MENU_RESPONSE" | jq '.'
  MENU_ITEM_ID=$(echo "$MENU_RESPONSE" | jq -r '.data.menuItem._id // empty')
  echo ""
fi

# Test 10: Get Menu by Restaurant
if [ ! -z "$RESTAURANT_ID" ]; then
  echo -e "${YELLOW}Test 10: Get Menu Items${NC}"
  curl -s -X GET "$BASE_URL/menu/$RESTAURANT_ID" | jq '.'
  echo ""
fi

# Test 11: Create Order
if [ ! -z "$RESTAURANT_ID" ] && [ ! -z "$MENU_ITEM_ID" ]; then
  echo -e "${YELLOW}Test 11: Create Order${NC}"
  ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/orders" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -d "{
      \"restaurantId\": \"$RESTAURANT_ID\",
      \"items\": [{
        \"menuItemId\": \"$MENU_ITEM_ID\",
        \"quantity\": 2,
        \"price\": 299
      }],
      \"deliveryAddress\": {
        \"street\": \"456 Test Ave\",
        \"city\": \"Test City\",
        \"state\": \"Test State\",
        \"zipCode\": \"12345\",
        \"coordinates\": [-122.4194, 37.7749]
      },
      \"paymentMethod\": \"cod\"
    }")
  echo "$ORDER_RESPONSE" | jq '.'
  ORDER_ID=$(echo "$ORDER_RESPONSE" | jq -r '.data.order._id // empty')
  echo ""
fi

# Test 12: Get User Orders
echo -e "${YELLOW}Test 12: Get User Orders${NC}"
curl -s -X GET "$BASE_URL/orders/my-orders" \
  -H "Authorization: Bearer $USER_TOKEN" | jq '.'
echo ""

# Test 13: Get Order by ID
if [ ! -z "$ORDER_ID" ]; then
  echo -e "${YELLOW}Test 13: Get Order by ID${NC}"
  curl -s -X GET "$BASE_URL/orders/$ORDER_ID" \
    -H "Authorization: Bearer $USER_TOKEN" | jq '.'
  echo ""
fi

echo "========================================="
echo "   API Testing Complete"
echo "========================================="
