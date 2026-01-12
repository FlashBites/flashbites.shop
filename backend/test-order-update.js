const axios = require('axios');

// Test credentials - using admin account
const TEST_EMAIL = 'azadaman1apl@gmail.com';
const TEST_PASSWORD = 'admin123'; // You may need to update this
const API_BASE = 'https://flashbites-backend.up.railway.app/api';
const ORDER_ID = '69651ea9b4af75b21f2cdc05';

async function testOrderUpdate() {
  try {
    console.log('🔐 Logging in as restaurant owner...');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    const token = loginRes.data.data.token;
    console.log('✅ Login successful');
    console.log('Token:', token.substring(0, 50) + '...');
    
    console.log('\n🔄 Updating order status to "confirmed"...');
    const updateRes = await axios.patch(
      `${API_BASE}/orders/${ORDER_ID}/status`,
      { status: 'confirmed' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ Order update successful!');
    console.log('Response:', JSON.stringify(updateRes.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('Full error:', JSON.stringify(error.response?.data, null, 2));
  }
}

testOrderUpdate();
