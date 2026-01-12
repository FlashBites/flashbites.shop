require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const fixDuplicatePhoneNumbers = async () => {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Drop ALL phone indexes first
    console.log('🗑️  Dropping all phone indexes...');
    try {
      const indexes = await User.collection.indexes();
      console.log('Current indexes:', indexes.map(i => i.name));
      
      for (const index of indexes) {
        if (index.name.includes('phone')) {
          try {
            await User.collection.dropIndex(index.name);
            console.log(`✅ Dropped index: ${index.name}`);
          } catch (err) {
            console.log(`⚠️  Could not drop ${index.name}:`, err.message);
          }
        }
      }
    } catch (error) {
      console.log('⚠️  Error dropping indexes:', error.message);
    }

    // Remove phone field from ALL users that have null
    console.log('\n🔄 Removing phone field from users with null phone...');
    const result = await User.updateMany(
      { $or: [{ phone: null }, { phone: { $exists: true, $eq: null } }] },
      { $unset: { phone: "" } }
    );
    console.log(`✅ Updated ${result.modifiedCount} users\n`);

    // Recreate the sparse unique index
    console.log('🔨 Creating new sparse unique phone index...');
    await User.collection.createIndex(
      { phone: 1 }, 
      { unique: true, sparse: true, name: 'phone_1' }
    );
    console.log('✅ Sparse phone index created\n');

    // Verify
    const nullPhoneCount = await User.countDocuments({ phone: null });
    const undefinedPhoneCount = await User.countDocuments({ phone: { $exists: false } });
    const withPhoneCount = await User.countDocuments({ phone: { $exists: true, $ne: null } });
    
    console.log('📊 Final Statistics:');
    console.log(`   - Users with phone: null: ${nullPhoneCount}`);
    console.log(`   - Users without phone field: ${undefinedPhoneCount}`);
    console.log(`   - Users with valid phone: ${withPhoneCount}\n`);

    if (nullPhoneCount === 0) {
      console.log('✅ Fix completed successfully! No more null phone values.');
    } else {
      console.log('⚠️  Warning: Some users still have phone: null');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixDuplicatePhoneNumbers();
