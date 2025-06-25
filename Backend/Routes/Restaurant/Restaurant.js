
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

const router = express.Router();

router.get('/', getAllRestaurants);
router.post('/', createRestaurant);
router.get('/:id', getRestaurantById);
router.patch('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);
router.get("/restaurant/outlet/info",authenticateToken,getRestaurantOutlet);
router.get("/restaurant/unique-cuisines",getUniqueCuisines)
router.get("/email",authenticateToken, getRestaurantByEmail)
router.post('/offers/my-restaurant',authenticateToken,addRestaurantOffer);
router.get("/offers/my-restaurant",authenticateToken,getRestaurantOffer);
router.put("/offers/my-restaurant/:offerId",authenticateToken,editRestaurantOffer);
router.put('/offers/my-restaurant/:offerId/toggle-status',authenticateToken,toggleOfferStatus);
router.delete('/offers/my-restaurant/:offerId',authenticateToken,deleteRestaurantOffer);
router.get('/menu-items/my-restaurant',authenticateToken,getMenubyRestaurant);
router.get('/offer/:id',getRestaurantOfferId);
module.exports = router;