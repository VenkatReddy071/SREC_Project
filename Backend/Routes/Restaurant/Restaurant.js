
const express = require('express');
const {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantByEmail,
  getUniqueCuisines,
  getRestaurantOutlet,
  getMenubyRestaurant,
  getRestaurantOffer,
  addRestaurantOffer,
  editRestaurantOffer,
  toggleOfferStatus,
  deleteRestaurantOffer,
getRestaurantOfferId
} = require('../../Controllers/Dining/Restaurants');
const {authenticateToken}=require("../../Controllers/Authorization/auth")
const Restaurant=require("../../models/Dining/Restaurant");
const router = express.Router();

router.get('/', getAllRestaurants);
router.post('/', createRestaurant);
router.get('/:id', getRestaurantById);
router.patch('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);
router.get("/restaurant/outlet/info",authenticateToken,getRestaurantOutlet);
router.get("/restaurant/unique-cuisines",getUniqueCuisines)
router.get("/email/email",authenticateToken, getRestaurantByEmail)
router.post('/offers/my-restaurant',authenticateToken,addRestaurantOffer);
router.get("/offers/my-restaurant",authenticateToken,getRestaurantOffer);
router.put("/offers/my-restaurant/:offerId",authenticateToken,editRestaurantOffer);
router.put('/offers/my-restaurant/:offerId/toggle-status',authenticateToken,toggleOfferStatus);
router.delete('/offers/my-restaurant/:offerId',authenticateToken,deleteRestaurantOffer);
router.get('/menu-items/my-restaurant',authenticateToken,getMenubyRestaurant);
router.get('/offer/:id',getRestaurantOfferId);


router.put('/update-by-email',authenticateToken, async (req, res) => {
    try {
        const ownerEmail = req.user.email;
        console.log(ownerEmail);
        if (!ownerEmail) {
            return res.status(401).json({ message: 'Unauthorized: Owner email not found in token.' });
        }

        const {
            name,
            email,
            address,
            phone,
            isTopPick,
            offersDelivery,
            isTakeaway,
            closed,
            operatingHours,
        } = req.body;

        if (!name || !email || !address || !address.street || !address.city || !address.state) {
            return res.status(400).json({ message: 'Missing required restaurant information fields.' });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (email !== ownerEmail) {
            return res.status(403).json({ message: 'Forbidden: Cannot change owner email or update another restaurant.' });
        }

        const restaurant = await Restaurant.findOne({ email: ownerEmail });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found for this user.' });
        }

        restaurant.name = name;
        restaurant.address = {
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode || restaurant.address.zipCode,
        };
        restaurant.phone = phone || restaurant.phone;
        restaurant.isTopPick = isTopPick;
        restaurant.offersDelivery = offersDelivery;
        restaurant.isTakeaway = isTakeaway;
        restaurant.closed = closed;
        restaurant.operatingHours = operatingHours;

        await restaurant.save();

        res.status(200).json({ message: 'Outlet information updated successfully!', restaurant });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        console.error('Server error during restaurant update:', error);
        res.status(500).json({ message: 'Server error. Failed to update outlet information.' });
    }
});
module.exports = router;