const {getMallOffer,getMallOfferId,addMallOffer,editMallOffer,toggleOfferStatus,deleteMallOffer,getProductsByMall}=require("../../Controllers/Malls/Offers");
const express=require("express");
const router=express.Router();
const {authenticateToken}=require("../../Controllers/Authorization/auth");

router.post('/offers/my-restaurant',authenticateToken,addMallOffer);
router.get("/offers/my-restaurant",authenticateToken,getMallOffer);
router.put("/offers/my-restaurant/:offerId",authenticateToken,editMallOffer);
router.put('/offers/my-restaurant/:offerId/toggle-status',authenticateToken,toggleOfferStatus);
router.delete('/offers/my-restaurant/:offerId',authenticateToken,deleteMallOffer);
router.get('/menu-items/my-restaurant',authenticateToken,getProductsByMall);
router.get('/offer/:id',getMallOfferId);


module.exports=router;
