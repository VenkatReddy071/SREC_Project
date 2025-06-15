const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Cart = require('../../models/Malls/Cart');
const Menu = require('../../models/Restaurants/Menu');
const User = require('../../models/User/LoginModel');

const calculateCartTotals = async (cart) => {
    let subtotal = 0;
    let estimatedTaxes = 0;
    const itemsToRemove = [];

    for (let i = 0; i < cart.items.length; i++) {
        const cartItem = cart.items[i];
        let currentItemDoc = null;
        let itemPrice = 0;
        let itemCategory = null;

        // Only process if it's a Menu item
        if (cartItem.itemModelType === 'Menu') {
            currentItemDoc = await Menu.findById(cartItem.product);
            if (!currentItemDoc || !currentItemDoc.isAvailable) {
                itemsToRemove.push(i);
                continue;
            }
            itemPrice = currentItemDoc.priceINR;
            itemCategory = currentItemDoc.category;
        } else {
            // Remove items that are not 'Menu' type
            itemsToRemove.push(i);
            continue;
        }

        subtotal += itemPrice * cartItem.quantity;

        // Simplified tax calculation (adjust as per your needs for Menu categories)
        // You might define specific tax rates for food categories if different
        estimatedTaxes += (itemPrice * cartItem.quantity) * 0.05; // Example: 5% tax for all menu items
    }

    for (let i = itemsToRemove.length - 1; i >= 0; i--) {
        cart.items.splice(itemsToRemove[i], 1);
    }

    cart.totalPrice = parseFloat(subtotal.toFixed(2));
    const grandTotal = parseFloat((subtotal + estimatedTaxes).toFixed(2));

    return { subtotal: cart.totalPrice, estimatedTaxes: parseFloat(estimatedTaxes.toFixed(2)), grandTotal };
};

router.get('/', async (req, res) => {
    try {
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required. No user session.' });
        }

        let cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            return res.status(200).json({
                message: 'Cart is empty',
                cart: { user: userId, items: [], totalPrice: 0 },
                subtotal: 0,
                estimatedTaxes: 0,
                grandTotal: 0
            });
        }

        const { subtotal, estimatedTaxes, grandTotal } = await calculateCartTotals(cart);

        await cart.save();

        res.status(200).json({
            message: 'Cart retrieved successfully',
            cart,
            subtotal,
            estimatedTaxes,
            grandTotal
        });

    } catch (err) {
        console.error('Error getting cart:', err);
        res.status(500).json({ message: 'Server error fetching cart' });
    }
});

// Route for adding Menu items
router.post('/add-menu', async (req, res) => {
    const { menuId, quantity, sourceId } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user session.' });
    }

    if (!menuId || !quantity || quantity < 1 || !sourceId) {
        return res.status(400).json({ message: 'Menu ID, quantity, and restaurant ID are required.' });
    }

    try {
        const menuItem = await Menu.findById(menuId);

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found.' });
        }
        if (!menuItem.isAvailable) {
            return res.status(400).json({ message: 'Menu item is currently unavailable.' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        const existingItemIndex = cart.items.findIndex(item =>
            item.product.toString() === menuId &&
            item.itemModelType === 'Menu'
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: menuId,
                name: menuItem.name,
                image: menuItem.imageUrl,
                price: menuItem.priceINR,
                currency: 'INR',
                quantity,
                itemModelType: 'Menu',
                sourceType: 'Restaurant',
                sourceId: sourceId,
            });
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json({ message: 'Menu item added to cart successfully', cart });

    } catch (err) {
        console.error('Error adding menu item to cart:', err);
        res.status(500).json({ message: 'Server error adding menu item to cart' });
    }
});

// Route for updating Menu item quantity
router.put('/update-menu-quantity', async (req, res) => {
    const { menuId, quantity } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user session.' });
    }

    if (!menuId || quantity === undefined || quantity < 0) {
        return res.status(400).json({ message: 'Menu ID and a valid quantity are required.' });
    }

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === menuId &&
            item.itemModelType === 'Menu'
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }

        const menuItem = await Menu.findById(menuId);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found for quantity update.' });
        }
        if (!menuItem.isAvailable) {
            return res.status(400).json({ message: 'Menu item is currently unavailable.' });
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json({ message: 'Cart menu item quantity updated successfully', cart });

    } catch (err) {
        console.error('Error updating cart menu item quantity:', err);
        res.status(500).json({ message: 'Server error updating cart menu item quantity' });
    }
});

// Route for removing Menu items
router.delete('/remove-menu/:menuId', async (req, res) => {
    const { menuId } = req.params;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user session.' });
    }

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => {
            return !(item.product.toString() === menuId && item.itemModelType === 'Menu');
        });

        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ message: 'Menu item not found in cart.' });
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json({ message: 'Menu item removed from cart successfully', cart });

    } catch (err) {
        console.error('Error removing menu item from cart:', err);
        res.status(500).json({ message: 'Server error removing menu item from cart' });
    }
});

router.delete('/clear', async (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user session.' });
    }

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({ message: 'Cart cleared successfully', cart });

    } catch (err) {
        console.error('Error clearing cart:', err);
        res.status(500).json({ message: 'Server error clearing cart' });
    }
});

module.exports = router;
