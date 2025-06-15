// routes/productRoutes.js
const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByRestaurantId,
  getProductsByRestaurantEmail,
} = require('../../Controllers/Dining/Menu');
const {authenticateToken}=require("../../Controllers/Authorization/auth")

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', createProduct); 

router.get('/restaurant/:restaurantId', getProductsByRestaurantId);
router.get('/restaurant-by-email',authenticateToken, getProductsByRestaurantEmail);

router.get('/:id', getProductById);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;