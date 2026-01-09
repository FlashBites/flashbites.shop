#!/usr/bin/env node
/**
 * Demo Data Setup Script for FlashBites
 * Creates users, restaurants, menu items, and sample orders
 */

const BASE_URL = 'http://localhost:8080/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error.message);
    throw error;
  }
}

// 1. Create Admin User (manually via mongo if needed)
async function createAdmin() {
  console.log('\n🔐 Step 1: Creating Admin User...');
  const adminData = {
    name: 'System Admin',
    email: 'admin@flashbites.com',
    password: 'admin123',
    phone: '9999999999'
  };
  
  const result = await apiRequest('/auth/register', 'POST', adminData);
  console.log('Admin creation result:', result.message || result.error);
  
  if (result.success) {
    return result.data.accessToken;
  }
  
  // Try login if already exists
  const loginResult = await apiRequest('/auth/login', 'POST', {
    email: adminData.email,
    password: adminData.password
  });
  
  return loginResult.data?.accessToken;
}

// 2. Create Restaurant Owners and Restaurants
async function createRestaurants() {
  console.log('\n🏪 Step 2: Creating Restaurants...');
  
  const restaurants = [
    {
      owner: {
        name: 'Mario Rossi',
        email: 'mario@pizzaparadise.com',
        password: 'password123',
        phone: '9111111111'
      },
      restaurant: {
        name: 'Pizza Paradise',
        description: 'Authentic Italian pizzas made with fresh ingredients. Wood-fired oven since 1995.',
        cuisines: ['Italian', 'Fast Food'],
        phone: '9111111111',
        email: 'orders@pizzaparadise.com',
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [72.8777, 19.0760] },
        deliveryFee: 40,
        minOrderAmount: 200,
        deliveryTime: 35,
        isPureVeg: false
      }
    },
    {
      owner: {
        name: 'Rajesh Kumar',
        email: 'rajesh@spicevilla.com',
        password: 'password123',
        phone: '9222222222'
      },
      restaurant: {
        name: 'Spice Villa',
        description: 'Traditional Indian cuisine with authentic spices and royal flavors',
        cuisines: ['Indian', 'North Indian'],
        phone: '9222222222',
        email: 'orders@spicevilla.com',
        address: {
          street: '456 Food Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400002',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [72.8856, 19.0825] },
        deliveryFee: 0,
        minOrderAmount: 150,
        deliveryTime: 30,
        isPureVeg: true
      }
    },
    {
      owner: {
        name: 'Chen Wei',
        email: 'chen@dragonwok.com',
        password: 'password123',
        phone: '9333333333'
      },
      restaurant: {
        name: 'Dragon Wok',
        description: 'Authentic Chinese cuisine with modern twist. Family recipes passed down generations.',
        cuisines: ['Chinese', 'Asian'],
        phone: '9333333333',
        email: 'orders@dragonwok.com',
        address: {
          street: '789 China Town',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400003',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [72.8555, 19.0720] },
        deliveryFee: 30,
        minOrderAmount: 180,
        deliveryTime: 40,
        isPureVeg: false
      }
    },
    {
      owner: {
        name: 'Ahmed Khan',
        email: 'ahmed@burgerhouse.com',
        password: 'password123',
        phone: '9444444444'
      },
      restaurant: {
        name: 'The Burger House',
        description: 'Juicy burgers and crispy fries. Best burgers in town!',
        cuisines: ['American', 'Fast Food'],
        phone: '9444444444',
        email: 'orders@burgerhouse.com',
        address: {
          street: '321 Burger Lane',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400004',
          country: 'India'
        },
        location: { type: 'Point', coordinates: [72.8650, 19.0850] },
        deliveryFee: 25,
        minOrderAmount: 150,
        deliveryTime: 25,
        isPureVeg: false
      }
    }
  ];
  
  const createdRestaurants = [];
  
  for (const { owner, restaurant } of restaurants) {
    try {
      // Register owner
      let ownerToken;
      const registerResult = await apiRequest('/auth/register', 'POST', {
        ...owner,
        role: 'restaurant_owner'
      });
      
      if (registerResult.success) {
        ownerToken = registerResult.data.accessToken;
        console.log(`✅ Created owner: ${owner.name}`);
      } else {
        // Try login
        const loginResult = await apiRequest('/auth/login', 'POST', {
          email: owner.email,
          password: owner.password
        });
        ownerToken = loginResult.data?.accessToken;
        console.log(`✅ Logged in owner: ${owner.name}`);
      }
      
      await delay(500);
      
      // Create restaurant
      const restaurantResult = await apiRequest('/restaurants', 'POST', restaurant, ownerToken);
      
      if (restaurantResult.success) {
        createdRestaurants.push({
          ...restaurantResult.data.restaurant,
          ownerToken
        });
        console.log(`✅ Created restaurant: ${restaurant.name}`);
      }
      
      await delay(500);
    } catch (error) {
      console.error(`❌ Error creating ${restaurant.name}:`, error.message);
    }
  }
  
  return createdRestaurants;
}

// 3. Approve Restaurants (requires admin privileges)
async function approveRestaurants(adminToken, restaurants) {
  console.log('\n✔️  Step 3: Approving Restaurants...');
  
  for (const restaurant of restaurants) {
    try {
      const result = await apiRequest(
        `/admin/restaurants/${restaurant._id}/approve`,
        'PATCH',
        null,
        adminToken
      );
      
      if (result.success) {
        console.log(`✅ Approved: ${restaurant.name}`);
      }
      await delay(300);
    } catch (error) {
      console.error(`❌ Error approving ${restaurant.name}:`, error.message);
    }
  }
}

// 4. Add Menu Items to Restaurants
async function addMenuItems(restaurants) {
  console.log('\n🍽️  Step 4: Adding Menu Items...');
  
  const menuItems = {
    'Pizza Paradise': [
      { name: 'Margherita Pizza', description: 'Classic pizza with tomato, mozzarella, and basil', category: 'Main Course', price: 299, isVeg: true, tags: ['Popular', 'Classic'] },
      { name: 'Pepperoni Pizza', description: 'Loaded with pepperoni and extra cheese', category: 'Main Course', price: 399, isVeg: false, tags: ['Bestseller'] },
      { name: 'BBQ Chicken Pizza', description: 'Grilled chicken with BBQ sauce', category: 'Main Course', price: 449, isVeg: false },
      { name: 'Garlic Bread', description: 'Crispy bread with garlic butter', category: 'Starters', price: 149, isVeg: true, tags: ['Popular'] },
      { name: 'Caesar Salad', description: 'Fresh romaine lettuce with parmesan', category: 'Starters', price: 199, isVeg: true },
      { name: 'Tiramisu', description: 'Classic Italian coffee dessert', category: 'Desserts', price: 199, isVeg: true },
      { name: 'Coca Cola', description: 'Chilled soft drink', category: 'Beverages', price: 60, isVeg: true }
    ],
    'Spice Villa': [
      { name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato gravy', category: 'Main Course', price: 280, isVeg: true, tags: ['Bestseller', 'Popular'] },
      { name: 'Dal Makhani', description: 'Creamy black lentils cooked overnight', category: 'Main Course', price: 240, isVeg: true, tags: ['Popular'] },
      { name: 'Butter Naan', description: 'Soft Indian bread with butter', category: 'Breads', price: 60, isVeg: true },
      { name: 'Veg Biryani', description: 'Fragrant basmati rice with vegetables', category: 'Rice', price: 280, isVeg: true, tags: ['Bestseller'] },
      { name: 'Samosa (2 pcs)', description: 'Crispy pastry filled with spiced potatoes', category: 'Starters', price: 80, isVeg: true, tags: ['Popular'] },
      { name: 'Raita', description: 'Yogurt with cucumber and spices', category: 'Sides', price: 80, isVeg: true },
      { name: 'Gulab Jamun (2 pcs)', description: 'Soft milk dumplings in sugar syrup', category: 'Desserts', price: 100, isVeg: true },
      { name: 'Lassi', description: 'Traditional Indian yogurt drink', category: 'Beverages', price: 80, isVeg: true }
    ],
    'Dragon Wok': [
      { name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables', category: 'Main Course', price: 240, isVeg: true, tags: ['Popular'] },
      { name: 'Chicken Fried Rice', description: 'Fried rice with chicken and egg', category: 'Rice', price: 280, isVeg: false, tags: ['Bestseller'] },
      { name: 'Manchurian (Dry)', description: 'Crispy vegetable balls in spicy sauce', category: 'Starters', price: 220, isVeg: true, tags: ['Popular'] },
      { name: 'Spring Rolls (4 pcs)', description: 'Crispy rolls with vegetable filling', category: 'Starters', price: 180, isVeg: true },
      { name: 'Chilli Chicken', description: 'Spicy chicken with bell peppers', category: 'Main Course', price: 320, isVeg: false, tags: ['Bestseller'] },
      { name: 'Hot & Sour Soup', description: 'Spicy and tangy soup', category: 'Soups', price: 150, isVeg: true },
      { name: 'Green Tea', description: 'Traditional Chinese tea', category: 'Beverages', price: 80, isVeg: true }
    ],
    'The Burger House': [
      { name: 'Classic Beef Burger', description: 'Juicy beef patty with lettuce, tomato, and cheese', category: 'Main Course', price: 299, isVeg: false, tags: ['Bestseller'] },
      { name: 'Chicken Burger', description: 'Grilled chicken with special sauce', category: 'Main Course', price: 259, isVeg: false, tags: ['Popular'] },
      { name: 'Veg Burger', description: 'Crispy veg patty with fresh veggies', category: 'Main Course', price: 199, isVeg: true },
      { name: 'French Fries', description: 'Crispy golden fries', category: 'Sides', price: 120, isVeg: true, tags: ['Popular'] },
      { name: 'Onion Rings', description: 'Crispy fried onion rings', category: 'Sides', price: 140, isVeg: true },
      { name: 'Chocolate Shake', description: 'Rich chocolate milkshake', category: 'Beverages', price: 150, isVeg: true, tags: ['Popular'] },
      { name: 'Brownie Sundae', description: 'Warm brownie with ice cream', category: 'Desserts', price: 180, isVeg: true }
    ]
  };
  
  for (const restaurant of restaurants) {
    const items = menuItems[restaurant.name] || [];
    
    for (const item of items) {
      try {
        const result = await apiRequest(
          `/menu/restaurant/${restaurant._id}`,
          'POST',
          item,
          restaurant.ownerToken
        );
        
        if (result.success) {
          console.log(`✅ Added: ${item.name} to ${restaurant.name}`);
        }
        await delay(200);
      } catch (error) {
        console.error(`❌ Error adding ${item.name}:`, error.message);
      }
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 FlashBites Demo Data Setup\n');
  console.log('=' .repeat(50));
  
  try {
    // Step 1: Get/Create admin
    const adminToken = await createAdmin();
    if (!adminToken) {
      console.error('❌ Could not create/login admin. Continuing without approval...');
    }
    
    await delay(1000);
    
    // Step 2: Create restaurants
    const restaurants = await createRestaurants();
    console.log(`\n✅ Created ${restaurants.length} restaurants`);
    
    await delay(1000);
    
    // Step 3: Approve restaurants
    if (adminToken) {
      await approveRestaurants(adminToken, restaurants);
    }
    
    await delay(1000);
    
    // Step 4: Add menu items
    await addMenuItems(restaurants);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Demo data setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Restaurants: ${restaurants.length}`);
    console.log(`   - Menu items added to all restaurants`);
    console.log('\n🎉 Your FlashBites app is ready to use!');
    console.log('\n💡 Login Credentials:');
    console.log('   Email: testuser@flashbites.com');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
