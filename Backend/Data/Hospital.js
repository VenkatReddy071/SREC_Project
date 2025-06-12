const mongoose = require("mongoose");
const Mall = require('../models/Malls/Malls'); // Adjust path if your models are in a different folder

// --- Configuration ---
const MONGO_URI = "mongodb+srv://ndlinfo:ndlinfo@srec.nky2xvg.mongodb.net/SREC?retryWrites=true&w=majority&appName=SREC"; //  <-- IMPORTANT: Replace with your MongoDB URI   // Adjust path if your models are in a different folder
const Product = require('../models/Malls/Products'); // Adjust path
const MIN_PRODUCTS_PER_MALL = 70;
const MAX_PRODUCTS_PER_MALL = 100;

// --- Helper Functions for Data Generation ---
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = (arr, minCount, maxCount) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, getRandomInt(minCount, maxCount));
};

// --- Static Data for Product Generation ---
const productNames = [
    "Designer T-Shirt", "Classic Denim Jeans", "Summer Dress", "Kids Play Set",
    "Fiction Novel", "Educational Book", "Running Shoes", "Formal Loafers",
    "Leather Handbag", "Smartwatch", "Gift Basket", "Customized Mug",
    "Wireless Headphones", "Yoga Mat", "Coffee Maker", "Smartphone Cover",
    "Backpack", "Sunglasses", "Winter Jacket", "Bluetooth Speaker"
];

const productDescriptions = [
    "High-quality fabric and unique design for ultimate comfort and style.",
    "Durable and stylish, perfect for everyday wear.",
    "Lightweight and breathable, ideal for sunny days.",
    "Engaging and educational, promotes imaginative play.",
    "A captivating read that will keep you on the edge of your seat.",
    "Learn something new with this comprehensive guide.",
    "Engineered for performance and comfort on your daily runs.",
    "Elegant and sophisticated, suitable for any formal occasion.",
    "Crafted from genuine leather with ample storage.",
    "Stay connected and track your fitness with this sleek device.",
    "A thoughtful collection of curated items for any occasion.",
    "Personalized with your favorite photo or message.",
    "Immersive sound experience with crystal-clear audio.",
    "Perfect grip and cushioning for all your yoga poses.",
    "Brew the perfect cup every time with this advanced machine.",
    "Protect your phone in style with this durable cover.",
    "Spacious and comfortable, ideal for travel or daily commute.",
    "Stylish and UV-protected, perfect for outdoor activities.",
    "Warm and cozy, designed for extreme cold weather.",
    "Portable and powerful, enjoy your music anywhere."
];

const productImages = [
    "https://images.unsplash.com/photo-1542291026-79eed3a2bb7b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Shoes
    "https://images.unsplash.com/photo-1598576404245-0d297a78484e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // T-shirt
    "https://images.unsplash.com/photo-1582299849500-ddc39750058b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Book
    "https://images.unsplash.com/photo-1601923297594-5509e51c8f8b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Watch/Accessories
    "https://images.unsplash.com/photo-1596726591244-67d710f63b20?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Kids toy
    "https://images.unsplash.com/photo-1588825867375-101168128362?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Bag/Accessories
    "https://images.unsplash.com/photo-1546213271-9f6b986a8775?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Gifts
    "https://images.unsplash.com/photo-1521789718471-a472c2196024?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Apparel
    "https://images.unsplash.com/photo-1589254881944-933e144a49c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Electronics
    "https://images.unsplash.com/photo-1563725838421-4f9e160e909a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Home decor/Gifts
];

const categories = ["Men", "Women", "Kids", "Books", "Footwear", "Accessories", "Gifts"];
const brands = ["UrbanFit", "LuxeStyle", "TechNova", "ReadWell", "StridePro", "EleganceCraft", "JoyfulPlay", "ZenHome"];
const sizesMenWomen = ["XS", "S", "M", "L", "XL", "XXL"];
const sizesFootwear = ["6", "7", "8", "9", "10", "11"];
const sizesKids = ["2T", "3T", "4T", "5T", "6", "8", "10"]; // Common kids sizes
const colors = ["Red", "Blue", "Black", "White", "Green", "Yellow", "Pink", "Gray", "Brown", "Purple"];
const materials = ["Cotton", "Polyester", "Denim", "Leather", "Canvas", "Plastic", "Wood", "Metal", "Glass", "Wool"];
const genders = ["Men", "Women", "Unisex", "Kids"];
const storeNames = [
    "Fashion Hub", "Tech Galaxy", "Bookworm's Corner", "Sole Mates", "Accessory Haven",
    "Gift Palace", "Kids World", "The Style Loft", "Gadget Zone", "Page Turner Books",
    "Footloose Fashions", "Chic & Shine", "Playful Panda", "Novel Nook", "Step Up Shoes"
];


function generateProductData(mallId, storeName, count) {
    const products = [];
    for (let i = 0; i < count; i++) {
        const category = getRandomItem(categories);
        let availableSizes = [];
        if (category === "Footwear") {
            availableSizes = getRandomSubset(sizesFootwear, 2, 4);
        } else if (category === "Kids") {
            availableSizes = getRandomSubset(sizesKids, 2, 4);
        } else {
            availableSizes = getRandomSubset(sizesMenWomen, 2, 4);
        }

        const gender = (category === "Men" || category === "Women" || category === "Kids") ? category : getRandomItem(genders);

        const product = {
            name: `${getRandomItem(productNames)} ${i + 1}`,
            description: getRandomItem(productDescriptions),
            images: getRandomSubset(productImages, 1, 3), // 1 to 3 images per product
            price: getRandomFloat(100, 5000), // Prices in INR
            currency: "INR",
            category: category,
            brand: getRandomItem(brands),
            availableSizes: availableSizes,
            availableColors: getRandomSubset(colors, 2, 4),
            material: getRandomItem(materials),
            gender: gender,
            mall: new mongoose.Types.ObjectId(mallId), // Store as ObjectId
            storeName: storeName, // Specific store name for this batch of products
            stockQuantity: getRandomInt(10, 200),
            status: Math.random() > 0.9 ? "out_of_stock" : "active", // 10% chance of out_of_stock
        };
        products.push(product);
    }
    return products;
}

// --- Main Insertion Logic ---
async function seedProducts() {
    let totalProductsInserted = 0;

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully!');

        console.log('Fetching all mall IDs from the database...');
        const mallIds = await Mall.find({}, { _id: 1 });

        if (mallIds.length === 0) {
            console.warn('No malls found in the database. Please run the `seedMalls.js` script first.');
            return;
        }

        console.log(`Found ${mallIds.length} malls. Generating products for each...`);

        for (const mallDoc of mallIds) {
            const mallId = mallDoc._id;
            const numProducts = getRandomInt(MIN_PRODUCTS_PER_MALL, MAX_PRODUCTS_PER_MALL);
            const chosenStoreName = getRandomItem(storeNames); // A mall can have multiple stores, so pick one for this batch

            const productsToInsert = generateProductData(mallId, chosenStoreName, numProducts);

            console.log(`  Inserting ${productsToInsert.length} products for Mall ID: ${mallId}`);
            // Use { ordered: false } to allow insertion of other products even if one fails
            const result = await Product.insertMany(productsToInsert, { ordered: false });
            totalProductsInserted += result.length;
            console.log(`  Successfully inserted ${result.length} products for this mall.`);
        }

        console.log(`\n--- Product seeding complete! ---`);
        console.log(`Total products generated and inserted: ${totalProductsInserted}`);

    } catch (error) {
        console.error('An error occurred during product seeding:', error);
        if (error.code === 11000) {
            console.error('Note: Duplicate key error encountered. Some product documents might not have been inserted due to unique constraints if you have any on product fields (though none are defined on current schema).');
        }
    } finally {
        console.log('Disconnecting from MongoDB...');
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
}

// Execute the product seeding function
seedProducts();