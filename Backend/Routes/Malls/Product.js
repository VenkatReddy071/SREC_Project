
const express = require('express');
const router = express.Router();
const productController = require('../../Controllers/Malls/Product');
const {authenticateToken}=require("../../Controllers/Authorization/auth")

router.post('/add-by-mall-email',authenticateToken, productController.addProductByMallEmail);

router.get('/by-mall/:mallId', productController.getProductsByMallId);

router.get('/by-mall-email/:mallEmail',authenticateToken, productController.getProductsByMallEmail);
router.put('/update/:productId', productController.updateProduct);

router.delete('/:productId', productController.deleteProduct);

router.get('/:productId', productController.getProductById);
router.get("/popular/:id",productController.getPopularProduct)
module.exports = router;