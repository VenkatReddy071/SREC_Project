// scripts/generateProducts.js
const mongoose = require('mongoose');
const Restaurant = require('../models/Dining/Restaurant'); // Adjust path
const Product = require('../models/Dining/Menu');     // Adjust path

// Helper functions - Moved to global scope
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomBoolean = () => Math.random() < 0.5;

// Food item image URLs
const foodImageUrls = [
  "https://img.freepik.com/free-photo/curry-with-chicken-onions-indian-food-asian-cuisine_2829-6270.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/pre-prepared-food-showcasing-ready-eat-delicious-meals-go_23-2151246071.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/chicken-skewers-with-slices-apples-chili-top-view_2829-19996.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/side-view-rice-garnish-with-grilled-chicken-cucumber-carrot-bell-pepper-spring-onion_141793-5070.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/side-view-rice-garnish-with-fried-onion-carrot-greens-chili-pepper-table_141793-5069.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/traditional-indian-soup-lentils-indian-dhal-spicy-curry-bowl-spices-herbs-rustic-black-wooden-table_2829-18717.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/top-view-meat-sauce-soup-with-potatoes-greens-dark-desk_140725-76777.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/beyti-kebab-served-with-ayran-pickles_141793-1868.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/dinner-table-luxury-hotel_1150-10908.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/side-view-mix-meat-snacks-with-french-fries-grilled-vegetables-salad-sauces-board_141793-5021.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/street-restaurant-old-town-regensburg-germany_1127-3372.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/restaurant-with-tables-chairs-street_1127-2172.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/cute-stylish-family-summer-city_1157-19953.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/restaurant-with-tables-chairs-outside_1127-2018.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/friends-front-bar_23-2147680610.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/full-shot-woman-walking-by-bistro_23-2149366409.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/restaurant-tables_1162-181.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/plate-with-pakistani-food-high-angle_23-2148825157.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/mixed-pizza-with-sliced-lemon_140725-2808.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740"
];

const tiffinCategories = ["Breakfast Tiffins", "Lunch Tiffins", "Dinner Tiffins", "Snack Tiffins"];
const tiffinItems = [
    "Idli Sambar Tiffin", "Dosa with Chutney Tiffin", "Poori Sabzi Tiffin", "Upma Tiffin",
    "Poha Tiffin", "Paratha & Curd Tiffin", "Roti Sabzi Dal Tiffin", "Rice & Curry Tiffin",
    "Khichdi Tiffin", "Pongal Tiffin", "Medu Vada Tiffin", "Mini Meals Tiffin",
    "South Indian Combo Tiffin", "North Indian Combo Tiffin"
];

const indianDishes = [
  "Butter Chicken", "Paneer Tikka Masala", "Biryani", "Dal Makhani", "Chole Bhature",
  "Masala Dosa", "Vada Pav", "Samosa", "Gulab Jamun", "Jalebi", "Lassi", "Filter Coffee",
  "Rogan Josh", "Malai Kofta", "Palak Paneer", "Naan", "Tandoori Chicken", "Fish Curry",
  "Chicken Tikka", "Vegetable Korma", "Mutton Biryani", "Pani Puri", "Kulfi",
  "Vegetable Pakora", "Chicken Tikka", "Mixed Pizza"
];
const descriptions = [
  "A classic Indian delight.", "Rich and creamy, a must-try!", "Flavorful and aromatic.",
  "Perfectly spiced and cooked.", "A refreshing treat.", "Authentic taste of India.",
  "Prepared with fresh ingredients.", "A house special."
];

function generateUniqueProductData(restaurantId, restaurantType) {
  let name;
  let category;
  let productType;
  let isVegetarianFlag; // Use a different name to avoid conflict
  let isVeganFlag;

  // Determine product type and name based on restaurant type
  if (restaurantType === 'tiffin_only') {
    productType = 'tiffin_item';
    name = getRandomElement(tiffinItems);
    category = getRandomElement(tiffinCategories);
  } else if (restaurantType === 'both') {
    // For 'both', randomly choose between regular and tiffin items
    if (getRandomBoolean()) { // 50% chance for tiffin item
      productType = 'tiffin_item';
      name = getRandomElement(tiffinItems);
      category = getRandomElement(tiffinCategories);
    } else {
      productType = getRandomElement(['menu_item', 'mandi_item']);
      name = getRandomElement(indianDishes);
      category = getRandomElement(["Appetizers", "Main Course", "Desserts", "Beverages", "Soups", "Salads", "Breads", "Rice Dishes"]);
    }
  } else { // 'regular_only'
    productType = getRandomElement(['menu_item', 'mandi_item']);
    name = getRandomElement(indianDishes);
    category = getRandomElement(["Appetizers", "Main Course", "Desserts", "Beverages", "Soups", "Salads", "Breads", "Rice Dishes"]);
  }

  const description = getRandomElement(descriptions);

  // Logic for isVegetarian based on common ingredients (updated to include tiffin items)
  isVegetarianFlag = name.toLowerCase().includes('paneer') || name.toLowerCase().includes('dal') ||
                       name.toLowerCase().includes('palak') || name.toLowerCase().includes('vegetable') ||
                       name.toLowerCase().includes('dosa') || name.toLowerCase().includes('vada') ||
                       name.toLowerCase().includes('samosa') || name.toLowerCase().includes('gulab jamun') ||
                       name.toLowerCase().includes('jalebi') || name.toLowerCase().includes('lassi') ||
                       name.toLowerCase().includes('kulfi') || name.toLowerCase().includes('idli') ||
                       name.toLowerCase().includes('poori') || name.toLowerCase().includes('upma') ||
                       name.toLowerCase().includes('poha') || name.toLowerCase().includes('paratha') ||
                       name.toLowerCase().includes('roti') || name.toLowerCase().includes('khichdi') ||
                       name.toLowerCase().includes('pongal') || name.toLowerCase().includes('pizza');

  isVeganFlag = isVegetarianFlag && getRandomBoolean();

  return {
    restaurantId: restaurantId,
    name: name,
    description: description,
    priceINR: getRandomNumber(50, 1500),
    category: category,
    productType: productType,
    imageUrl: getRandomElement(foodImageUrls),
    isVegetarian: isVegetarianFlag,
    isVegan: isVeganFlag,
    isAvailable: true,
    isTopSeller: getRandomBoolean(),
    isNewArrival: getRandomBoolean(),
  };
}

async function generateProductsForAllRestaurants(numProductsPerRestaurant = 120) {
  const mongoURI = "mongodb+srv://ndlinfo:ndlinfo@srec.nky2xvg.mongodb.net/SREC?retryWrites=true&w=majority&appName=SREC";

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully...');

    // Clear existing products (optional, but recommended for fresh runs)
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    console.log('Fetching restaurant IDs and their service types...');
    const restaurants = await Restaurant.find({}, '_id servesTiffins isTiffinOnly').lean();
    if (restaurants.length === 0) {
      console.warn('No restaurants found in the database. Please run generateData.js first.');
      mongoose.connection.close();
      return;
    }
    console.log(`Found ${restaurants.length} restaurants.`);

    const allProductsToInsert = [];
    let productsCount = 0;

    for (const restaurant of restaurants) {
      let restaurantType;
      if (restaurant.isTiffinOnly) {
        restaurantType = 'tiffin_only';
      } else if (restaurant.servesTiffins) { // servesTiffins is true but not tiffinOnly, so it's 'both'
        restaurantType = 'both';
      } else { // servesTiffins is false
        restaurantType = 'regular_only';
      }

      for (let i = 0; i < numProductsPerRestaurant; i++) {
        allProductsToInsert.push(generateUniqueProductData(restaurant._id, restaurantType));
      }
      productsCount += numProductsPerRestaurant;
      if (productsCount % 5000 === 0) {
        console.log(`Generated ${productsCount} products so far...`);
      }
    }

    console.log(`Total products to insert: ${allProductsToInsert.length}`);

    if (allProductsToInsert.length > 0) {
      console.log('Starting bulk insertion of products...');
      await Product.insertMany(allProductsToInsert);
      console.log(`Successfully inserted ${allProductsToInsert.length} products!`);
    } else {
      console.log('No products to insert.');
    }

  } catch (error) {
    console.error('Error during product generation and insertion:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
  }
}

// Call the function to generate and insert products
generateProductsForAllRestaurants(120);