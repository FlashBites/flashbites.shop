require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const deleteTestUsers = async () => {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete unverified test users (temp users created during OTP testing)
    const result = await User.deleteMany({ 
      isEmailVerified: false,
      password: 'temp123' // Temp users created by sendOTP
    });

    console.log(`🗑️  Deleted ${result.deletedCount} temporary test users\n`);

    // Show remaining users
    const allUsers = await User.find({}, 'email name isEmailVerified phone');
    console.log(`📊 Remaining users (${allUsers.length}):`);
    allUsers.forEach(u => {
      console.log(`   - ${u.email} | verified: ${u.isEmailVerified} | phone: ${u.phone || 'none'}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

deleteTestUsers();
