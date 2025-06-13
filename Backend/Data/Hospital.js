const mongoose = require("mongoose");
const Product = require('../models/Malls/Products'); // Adjust path if your models are in a different folder

// --- Configuration ---
const MONGO_URI = "mongodb+srv://ndlinfo:ndlinfo@srec.nky2xvg.mongodb.net/SREC?retryWrites=true&w=majority&appName=SREC"; //  <-- IMPORTANT: Replace with your MongoDB URI   // Adjust path if your models are in a different folder

// --- Array of Image URLs (your provided links) ---
const imageUrls = [
    "https://img.freepik.com/free-photo/shop-clothing-clothes-shop-hanger-modern-shop-boutique_1150-8886.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/side-view-man-looking-clothes-hanging-rail-shop_23-2148175643.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/fashion-clothing-hangers-show_1153-5492.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/two-young-beautiful-girlfriends-are-walking-style-loft-showroom-stylish-things-with-gift-bags-smiling-each-other_496169-2354.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/beautiful-second-hand-market_23-2149353670.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/interior-clothing-store-with-stylish-merchandise-racks-fashionable-brand-design-casual-wear-modern-boutique-empty-fashion-showroom-shopping-centre-with-elegant-merchandise_482257-65537.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/empty-boutique-shopping-centre_482257-78792.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/pretty-girls-choosing-clothes-shop_23-2147669923.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/blurred-clothing-store-shopping-mall_1258-5.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/clothing-store-with-blurred-effect_23-2148164738.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/beautiful-woman-buying-clothes-store-holding-shopping-bags-hand_23-2148101655.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/friends-shopping-second-hand-market_23-2149353695.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/rows-hangers-with-clothes_23-2147669916.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/full-shot-woman-looking-clothes_23-2150082870.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/woman-choosing-clothes-shop_23-2147669917.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/woman-paying-clothes-store_23-2148915620.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/pretty-woman-looking-new-dress_23-2147688392.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/pretty-consumer-posing-clothing-shop_23-2147669926.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740"
];

// Helper function to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to get N unique random elements from an array
const getUniqueRandomElements = (arr, n) => {
    if (n > arr.length) {
        console.warn(`Attempted to get ${n} unique elements from an array of size ${arr.length}. Returning all elements.`);
        return [...arr];
    }
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
};

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

// --- Function to Assign Images to Existing Mall Data ---
const assignImagesToMalls = async () => {
    try {
        if (imageUrls.length === 0) {
            console.warn("No image URLs provided. Cannot assign images to mall data.");
            return;
        }

        console.log("Fetching all mall documents...");
        const malls = await Product.find({});
        console.log(`Found ${malls.length} mall(s) to update.`);

        if (malls.length === 0) {
            console.log("No malls found in the database. Please add some mall data first.");
            return;
        }

        let updatedCount = 0;
        for (const mall of malls) {
            
            const availableGalleryImages = imageUrls.filter(url => url !== mall.images[0]);
            mall.images = getUniqueRandomElements(availableGalleryImages, 3);

            await mall.save();
            updatedCount++;
            console.log(`Updated images for mall: ${mall.name} (ID: ${mall._id})`);
        }

        console.log(`\nSuccessfully updated images for ${updatedCount} mall(s).`);

    } catch (error) {
        console.error("Error assigning images to malls:", error);
    } finally {
        // Disconnect from MongoDB after the operation is complete
        mongoose.disconnect();
        console.log("MongoDB disconnected.");
    }
};

// --- Execute the function ---
assignImagesToMalls();