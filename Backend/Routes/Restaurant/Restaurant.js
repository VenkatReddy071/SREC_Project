
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
module.exports = router;