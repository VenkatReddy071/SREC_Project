
const express = require('express');
const router = express.Router();
const mallController = require('../../Controllers/Malls/Malls');
const {authenticateToken}=require("../../Controllers/Authorization/auth")

router.post('/add', mallController.addMall);

router.put('/update/:id', mallController.updateMall);
router.get('/all', mallController.getAllMalls);

router.get('/email/:email',authenticateToken, mallController.getMallByEmailWithProducts);
router.get("/outlet",authenticateToken,mallController.getMallOutlet);
router.get('/:id', mallController.getMallById);

router.delete('/:id',authenticateToken, mallController.deleteMall);
module.exports = router;