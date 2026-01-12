require('dotenv').config();
const mongoose = require('mongoose');

const forceFixPhoneNull = async () => {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find users with phone: null
    const usersWithNull = await usersCollection.find({ phone: null }).toArray();
    console.log(`📊 Found ${usersWithNull.length} users with phone: null`);
    
    if (usersWithNull.length > 0) {
      console.log('Users:', usersWithNull.map(u => ({ email: u.email, phone: u.phone })));
    }

    // Use raw MongoDB update to remove the field
    console.log('\n🔄 Force removing phone field...');
    const result = await usersCollection.updateMany(
      { phone: null },
      { $unset: { phone: 1 } }
    );
    console.log(`✅ Modified ${result.modifiedCount} documents\n`);

    // Verify again
    const stillNull = await usersCollection.find({ phone: null }).toArray();
    console.log(`📊 Users with phone: null after fix: ${stillNull.length}`);
    
    const noPhone = await usersCollection.find({ phone: { $exists: false } }).toArray();
    console.log(`📊 Users without phone field: ${noPhone.length}`);

    if (stillNull.length === 0) {
      console.log('\n✅ Successfully removed all phone: null values!');
    } else {
      console.log('\n⚠️  Still have users with phone: null:', stillNull.map(u => u.email));
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

forceFixPhoneNull();
