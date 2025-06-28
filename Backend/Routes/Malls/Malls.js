
const express = require('express');
const router = express.Router();
const mallController = require('../../Controllers/Malls/Malls');
const {authenticateToken}=require("../../Controllers/Authorization/auth")
const Mall=require("../../models/Malls/Malls");
router.post('/add', mallController.addMall);

router.put('/update/:id', mallController.updateMall);
router.get('/all', mallController.getAllMalls);

router.get('/email/:email',authenticateToken, mallController.getMallByEmailWithProducts);
router.get("/outlet",authenticateToken,mallController.getMallOutlet);
router.get('/:id', mallController.getMallById);
router.get('/outlet/email',authenticateToken,mallController.getMallByEmail);
router.delete('/:id',authenticateToken, mallController.deleteMall);
router.put('/update-by-email', authenticateToken, async (req, res) => {
    const  email  = req.user.email;
    const updates = req.body;


    try {
        const updatedMall = await Mall.findOneAndUpdate(
            { email: email },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedMall) {
            return res.status(404).json({ message: 'Mall not found for the given email.' });
        }

        res.status(200).json({
            message: 'Mall information updated successfully',
            mall: updatedMall
        });
    } catch (error) {
        console.error('Error updating mall:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ message: 'Validation Error', errors });
        }
        res.status(500).json({ message: 'Server error while updating mall data.' });
    }
});
module.exports = router;