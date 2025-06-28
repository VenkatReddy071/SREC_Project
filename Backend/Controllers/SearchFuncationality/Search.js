const Restaurant=require("../../models/Dining/Restaurant");
const Mall=require("../../models/Malls/Malls");
const Product=require("../../models/Malls/Products");
const Menu=require("../../models/Dining/Menu");
const Hospital=require("../../models/Hospital/Hospital");
const School=require("../../models/Schools/School");
const express=require("express");
const router=express.Router();
const buildModelSearchQuery = (query, fields) => {
    if (!query) return {};
    const regex = new RegExp(query, 'i');
    return {
        $or: fields.map(field => ({ [field]: { $regex: regex } }))
    };
};

router.get('/search/all', async (req, res) => {
    try {
        const { q } = req.query;

        const limit = 5;

        let restaurantResults = [];
        const restaurantQuery = buildModelSearchQuery(q, [
            'name', 'description', 'cuisine', 'address.street', 'address.city',
            'address.state', 'phone', 'services'
        ]);
        const matchingRestaurants = await Restaurant.find(restaurantQuery)
            .select('name email description rating address phone imageUrls cuisine averagePriceINR isVegetarian services')
            .limit(limit);

        let matchingMenuItems = [];
        if (q) {
            const menuRegex = new RegExp(q, 'i');
            // FIX: Using the imported Menu model for restaurant menu items
            matchingMenuItems = await Menu.find({
                productType: 'menu_item', // Assuming Menu items also have productType
                $or: [
                    { name: { $regex: menuRegex } },
                    { description: { $regex: menuRegex } },
                    { category: { $regex: menuRegex } }
                ]
            }).select('restaurantId name description priceINR category imageUrl isVegetarian isVegan');

            const restaurantIdsFromMenu = [...new Set(matchingMenuItems.map(item => item.restaurantId.toString()))];

            if (restaurantIdsFromMenu.length > 0) {
                const additionalRestaurants = await Restaurant.find({
                    _id: { $in: restaurantIdsFromMenu },
                    _id: { $nin: matchingRestaurants.map(r => r._id) }
                }).select('name email description rating address phone imageUrls cuisine averagePriceINR isVegetarian services')
                 .limit(limit - matchingRestaurants.length > 0 ? limit - matchingRestaurants.length : 0);
                matchingRestaurants.push(...additionalRestaurants);
            }
        }

        restaurantResults = matchingRestaurants.map(r => {
            const rObj = r.toObject();
            rObj.menu = matchingMenuItems.filter(item => item.restaurantId && item.restaurantId.equals(r._id)).map(item => ({
                id: item._id,
                name: item.name,
                description: item.description,
                priceINR: item.priceINR,
                category: item.category,
                imageUrl: item.imageUrl,
                isVegetarian: item.isVegetarian,
                isVegan: item.isVegan,
            }));
            return rObj;
        });

        let mallResults = [];
        const mallQuery = buildModelSearchQuery(q, [
            'name', 'address', 'locationName', 'info', 'description',
            'amenities', 'shoppingDepartments', 'email', 'phoneNumber'
        ]);
        const matchingMalls = await Mall.find(mallQuery)
            .select('name image phoneNumber email address locationName rating mallType info shoppingDepartments totalStores')
            .limit(limit);

        let matchingClothingProducts = [];
        if (q) {
            const clothingRegex = new RegExp(q, 'i');
            // Product model for mall products (e.g., clothing)
            matchingClothingProducts = await Product.find({
                productType: 'clothing',
                $or: [
                    { name: { $regex: clothingRegex } },
                    { description: { $regex: clothingRegex } },
                    { brand: { $regex: clothingRegex } },
                    { category: { $regex: clothingRegex } },
                    { storeName: { $regex: clothingRegex } }
                ]
            }).select('mall name description images price currency category brand availableSizes availableColors gender storeName');

            const mallIdsFromProducts = [...new Set(matchingClothingProducts.map(item => item.mall.toString()))];

            if (mallIdsFromProducts.length > 0) {
                const additionalMalls = await Mall.find({
                    _id: { $in: mallIdsFromProducts },
                    _id: { $nin: matchingMalls.map(m => m._id) }
                }).select('name image phoneNumber email address locationName rating mallType info shoppingDepartments totalStores')
                 .limit(limit - matchingMalls.length > 0 ? limit - matchingMalls.length : 0);
                matchingMalls.push(...additionalMalls);
            }
        }

        mallResults = matchingMalls.map(m => {
            const mObj = m.toObject();
            mObj.clothingProducts = matchingClothingProducts.filter(item => item.mall && item.mall.equals(m._id)).map(item => ({
                id: item._id,
                name: item.name,
                description: item.description,
                images: item.images,
                price: item.price,
                currency: item.currency,
                category: item.category,
                brand: item.brand,
                availableSizes: item.availableSizes,
                availableColors: item.availableColors,
                gender: item.gender,
                storeName: item.storeName,
            }));
            return mObj;
        });

        const hospitalQuery = buildModelSearchQuery(q, [
            'name', 'address', 'locationName', 'info',
            'specialization', 'services', 'phoneNumber', 'nearByLocation'
        ]);
        const hospitalResults = await Hospital.find(hospitalQuery)
            .select('name image phoneNumber patientSatisfaction successRate ProceduresAnnually glimpseInside locationName address rating info specialization ambulance')
            .limit(limit);

        const educationalInstituteQuery = buildModelSearchQuery(q, [
            'name', 'location', 'info', 'schoolDetails.board',
            'schoolDetails.specialTraining', 'schoolDetails.extraCurricularActivities',
            'collegeDetails.specializations', 'collegeDetails.affiliationType',
            'collegeDetails.courseTypes', 'collegeDetails.extraCurricularActivities'
        ]);
        const schoolResults = await School.find(educationalInstituteQuery)
            .select('name institutionType image location rating info mobileNumber hostel schoolDetails collegeDetails')
            .limit(limit);


        res.json({
            restaurants: restaurantResults.map(r => ({ ...r, category: 'Restaurant' })),
            malls: mallResults.map(m => ({ ...m, category: 'Mall' })),
            hospitals: hospitalResults.map(h => ({ ...h, category: 'Hospital' })),
            schools: schoolResults.map(s => ({ ...s, category: 'School/College' })),
        });

    } catch (err) {
        console.error('Error in universal search:', err);
        res.status(500).json({ error: 'Failed to perform universal search' });
    }
});

module.exports=router;