// Fix menu items - delete old and add to correct restaurants
use flashbites;

// Delete all existing menu items
db.menuitems.deleteMany({});
print('✅ Cleared old menu items');

// Get the correct restaurants from the demo setup
const restaurants = db.restaurants.find({
  name: { $in: ['Pizza Paradise', 'Spice Villa', 'Dragon Wok', 'The Burger House'] },
  isApproved: true
}).toArray();

// Sort to get the newer ones (from demo setup)
const pizzaParadise = restaurants.find(r => r.name === 'Pizza Paradise' && r.cuisines.includes('Italian'));
const spiceVilla = restaurants.find(r => r.name === 'Spice Villa' && r.cuisines.includes('North Indian'));
const dragonWok = restaurants.find(r => r.name === 'Dragon Wok');
const burgerHouse = restaurants.find(r => r.name === 'The Burger House');

if (!pizzaParadise || !spiceVilla || !dragonWok || !burgerHouse) {
  print('❌ Error: Could not find all restaurants');
} else {
  print('✅ Found all restaurants');
  
  // Pizza Paradise Menu
  db.menuitems.insertMany([
    {
      restaurantId: pizzaParadise._id,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato, mozzarella, and basil",
      category: "Main Course",
      price: 299,
      isVeg: true,
      isAvailable: true,
      tags: ["Popular", "Classic"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: pizzaParadise._id,
      name: "Pepperoni Pizza",
      description: "Loaded with pepperoni and extra cheese",
      category: "Main Course",
      price: 399,
      isVeg: false,
      isAvailable: true,
      tags: ["Bestseller"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: pizzaParadise._id,
      name: "BBQ Chicken Pizza",
      description: "Grilled chicken with BBQ sauce",
      category: "Main Course",
      price: 449,
      isVeg: false,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: pizzaParadise._id,
      name: "Garlic Bread",
      description: "Crispy bread with garlic butter",
      category: "Starters",
      price: 149,
      isVeg: true,
      isAvailable: true,
      tags: ["Popular"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: pizzaParadise._id,
      name: "Tiramisu",
      description: "Classic Italian coffee dessert",
      category: "Desserts",
      price: 199,
      isVeg: true,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  print('✅ Added 5 items to Pizza Paradise');

  // Spice Villa Menu
  db.menuitems.insertMany([
    {
      restaurantId: spiceVilla._id,
      name: "Paneer Butter Masala",
      description: "Cottage cheese in rich tomato gravy",
      category: "Main Course",
      price: 280,
      isVeg: true,
      isAvailable: true,
      tags: ["Bestseller", "Popular"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: spiceVilla._id,
      name: "Dal Makhani",
      description: "Creamy black lentils cooked overnight",
      category: "Main Course",
      price: 240,
      isVeg: true,
      isAvailable: true,
      tags: ["Popular"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: spiceVilla._id,
      name: "Butter Naan",
      description: "Soft Indian bread with butter",
      category: "Breads",
      price: 60,
      isVeg: true,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: spiceVilla._id,
      name: "Veg Biryani",
      description: "Fragrant basmati rice with vegetables",
      category: "Rice",
      price: 280,
      isVeg: true,
      isAvailable: true,
      tags: ["Bestseller"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: spiceVilla._id,
      name: "Samosa (2 pcs)",
      description: "Crispy pastry filled with spiced potatoes",
      category: "Starters",
      price: 80,
      isVeg: true,
      isAvailable: true,
      tags: ["Popular"],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  print('✅ Added 5 items to Spice Villa');

  // Dragon Wok Menu
  db.menuitems.insertMany([
    {
      restaurantId: dragonWok._id,
      name: "Hakka Noodles",
      description: "Stir-fried noodles with vegetables",
      category: "Main Course",
      price: 240,
      isVeg: true,
      isAvailable: true,
      tags: ["Popular"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: dragonWok._id,
      name: "Chicken Fried Rice",
      description: "Fried rice with chicken and egg",
      category: "Rice",
      price: 280,
      isVeg: false,
      isAvailable: true,
      tags: ["Bestseller"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: dragonWok._id,
      name: "Manchurian (Dry)",
      description: "Crispy vegetable balls in spicy sauce",
      category: "Starters",
      price: 220,
      isVeg: true,
      isAvailable: true,
      tags: ["Popular"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: dragonWok._id,
      name: "Chilli Chicken",
      description: "Spicy chicken with bell peppers",
      category: "Main Course",
      price: 320,
      isVeg: false,
      isAvailable: true,
      tags: ["Bestseller"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: dragonWok._id,
      name: "Spring Rolls (4 pcs)",
      description: "Crispy rolls with vegetable filling",
      category: "Starters",
      price: 180,
      isVeg: true,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  print('✅ Added 5 items to Dragon Wok');

  // The Burger House Menu
  db.menuitems.insertMany([
    {
      restaurantId: burgerHouse._id,
      name: "Classic Beef Burger",
      description: "Juicy beef patty with lettuce, tomato, and cheese",
      category: "Main Course",
      price: 299,
      isVeg: false,
      isAvailable: true,
      tags: ["Bestseller"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: burgerHouse._id,
      name: "Chicken Burger",
      description: "Grilled chicken with special sauce",
      category: "Main Course",
      price: 259,
      isVeg: false,
      isAvailable: true,
      tags: ["Popular"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: burgerHouse._id,
      name: "Veg Burger",
      description: "Crispy veg patty with fresh veggies",
      category: "Main Course",
      price: 199,
      isVeg: true,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: burgerHouse._id,
      name: "French Fries",
      description: "Crispy golden fries",
      category: "Sides",
      price: 120,
      isVeg: true,
      isAvailable: true,
      tags: ["Popular"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: burgerHouse._id,
      name: "Chocolate Shake",
      description: "Rich chocolate milkshake",
      category: "Beverages",
      price: 150,
      isVeg: true,
      isAvailable: true,
      tags: ["Popular"],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  print('✅ Added 5 items to The Burger House');

  print('\n🎉 All menu items fixed!');
  print('Total menu items: ' + db.menuitems.countDocuments());
  
  // Verify each restaurant has items
  print('\nVerification:');
  db.restaurants.find({isApproved: true}).forEach(r => {
    const count = db.menuitems.countDocuments({restaurantId: r._id});
    if (count > 0) {
      print('  ' + r.name + ': ' + count + ' items');
    }
  });
}
