

const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/Dining/Restaurant');
const { authenticateToken } = require('../../Controllers/Authorization/auth');

const findRestaurantByUserEmail = async (req, res, next) => {
    try {
        const email = req.user.email;
        const restaurant = await Restaurant.findOne({ email });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found for this user.' });
        }
        req.restaurant = restaurant;
        req.restaurantId = restaurant._id;
        next();
    } catch (error) {
        console.error('Error in findRestaurantByUserEmail middleware:', error);
        res.status(500).json({ message: 'Server Error during restaurant lookup.' });
    }
};

router.get('/my-restaurant/taxes', authenticateToken, findRestaurantByUserEmail, async (req, res) => {
    try {
        res.json(req.restaurant.taxesAndCharges);
    } catch (error) {
        console.error('Error fetching taxes:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// router.get('/my-restaurant', authenticateToken, findRestaurantByUserEmail, async (req, res) => {
//     try {
//         res.json({ _id: req.restaurant._id, name: req.restaurant.name });
//     } catch (error) {
//         console.error('Error fetching my restaurant:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });


router.post('/my-restaurant/taxes', authenticateToken, findRestaurantByUserEmail, async (req, res) => {
    try {
        const { name, type, value, isApplicable } = req.body;

        if (!name || !type || value === undefined) {
            return res.status(400).json({ message: 'Name, type, and value are required.' });
        }
        if (typeof value !== 'number' || value < 0) {
            return res.status(400).json({ message: 'Value must be a non-negative number.' });
        }
        if (!['percentage', 'fixed'].includes(type)) {
            return res.status(400).json({ message: 'Type must be either "percentage" or "fixed".' });
        }

        const newTax = { name, type, value, isApplicable: isApplicable !== undefined ? isApplicable : true };

        req.restaurant.taxesAndCharges.push(newTax);
        await req.restaurant.save();

        const addedTax = req.restaurant.taxesAndCharges[req.restaurant.taxesAndCharges.length - 1];
        res.status(201).json({ message: 'Tax/charge added successfully.', tax: addedTax });

    } catch (error) {
        console.error('Error adding tax/charge:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/my-restaurant/taxes/:taxId', authenticateToken, findRestaurantByUserEmail, async (req, res) => {
    try {
        const taxId = req.params.taxId;
        const { name, type, value, isApplicable } = req.body;

        const taxToUpdate = req.restaurant.taxesAndCharges.id(taxId);

        if (!taxToUpdate) {
            return res.status(404).json({ message: 'Tax/charge not found.' });
        }

        if (name !== undefined) taxToUpdate.name = name;
        if (type !== undefined) taxToUpdate.type = type;
        if (value !== undefined) {
             if (typeof value !== 'number' || value < 0) {
                return res.status(400).json({ message: 'Value must be a non-negative number.' });
            }
            taxToUpdate.value = value;
        }
        if (isApplicable !== undefined) taxToUpdate.isApplicable = isApplicable;

        await req.restaurant.save();
        res.json({ message: 'Tax/charge updated successfully.', tax: taxToUpdate });

    } catch (error) {
        console.error('Error updating tax/charge:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/my-restaurant/taxes/:taxId', authenticateToken, findRestaurantByUserEmail, async (req, res) => {
    try {
        const taxId = req.params.taxId;

        const originalLength = req.restaurant.taxesAndCharges.length;
        req.restaurant.taxesAndCharges.pull(taxId);

        if (req.restaurant.taxesAndCharges.length === originalLength) {
            return res.status(404).json({ message: 'Tax/charge not found.' });
        }

        await req.restaurant.save();
        res.json({ message: 'Tax/charge deleted successfully.' });

    } catch (error) {
        console.error('Error deleting tax/charge:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
