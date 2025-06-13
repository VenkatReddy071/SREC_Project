const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Cart = require('../../models/Malls/Cart');
const Product = require('../../models/Malls/Products');
const User = require('../../models/User/LoginModel');

const calculateCartTotals = async (cart) => {
    let subtotal = 0;
    let estimatedTaxes = 0;
    const itemsToRemove = [];

    for (let i = 0; i < cart.items.length; i++) {
        const cartItem = cart.items[i];
        const currentProduct = await Product.findById(cartItem.product._id);

        if (!currentProduct || currentProduct.status === 'inactive' || currentProduct.stockQuantity === 0) {
            itemsToRemove.push(i);
            continue;
        }

        if (cartItem.quantity > currentProduct.stockQuantity) {
            cartItem.quantity = currentProduct.stockQuantity;
        }

        const itemPrice = currentProduct.price;
        subtotal += itemPrice * cartItem.quantity;

        if (currentProduct.category === 'Electronics') {
            estimatedTaxes += (itemPrice * cartItem.quantity) * 0.18;
        } else {
            estimatedTaxes += (itemPrice * cartItem.quantity) * 0.05;
        }
    }

    // Remove invalid/out-of-stock items after iterating
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

router.post('/add', async (req, res) => {
    const { productId, quantity, selectedSize, selectedColor } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user session.' });
    }

    if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ message: 'Product ID and a valid quantity are required.' });
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        if (product.status === 'inactive') {
            return res.status(400).json({ message: 'Product is currently inactive.' });
        }
        if (product.stockQuantity === 0) {
            return res.status(400).json({ message: 'Product is out of stock.' });
        }
        if (quantity > product.stockQuantity) {
            return res.status(400).json({ message: `Only ${product.stockQuantity} units of this product are available.` });
        }

        if (product.availableSizes && product.availableSizes.length > 0 && !product.availableSizes.includes(selectedSize)) {
            return res.status(400).json({ message: 'Invalid size selected for this product.' });
        }
        if (product.availableColors && product.availableColors.length > 0 && !product.availableColors.includes(selectedColor)) {
            return res.status(400).json({ message: 'Invalid color selected for this product.' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        const existingItemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        );

        if (existingItemIndex > -1) {
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (newQuantity > product.stockQuantity) {
                return res.status(400).json({ message: `Adding this quantity would exceed available stock (${product.stockQuantity}).` });
            }
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                name: product.name,
                image: product.images.length > 0 ? product.images[0] : null,
                price: product.price,
                currency: product.currency,
                quantity,
                selectedSize,
                selectedColor,
                mall: product.mall,
                storeName: product.storeName
            });
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json({ message: 'Item added to cart successfully', cart });

    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ message: 'Server error adding item to cart' });
    }
});

router.put('/update-quantity', async (req, res) => {
    const { productId, selectedSize, selectedColor, quantity } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user session.' });
    }

    if (!productId || quantity === undefined || quantity < 0) {
        return res.status(400).json({ message: 'Product ID and a valid quantity are required.' });
    }

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found for quantity update.' });
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            if (quantity > product.stockQuantity) {
                return res.status(400).json({ message: `Requested quantity exceeds available stock (${product.stockQuantity}).` });
            }
            cart.items[itemIndex].quantity = quantity;
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json({ message: 'Cart item quantity updated successfully', cart });

    } catch (err) {
        console.error('Error updating cart quantity:', err);
        res.status(500).json({ message: 'Server error updating cart quantity' });
    }
});

router.delete('/remove/:productId', async (req, res) => {
    const { productId } = req.params;
    const { selectedSize, selectedColor } = req.query;
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
            const isMatch = item.product.toString() === productId;
            const sizeMatch = selectedSize ? item.selectedSize === selectedSize : true;
            const colorMatch = selectedColor ? item.selectedColor === selectedColor : true;
            return !(isMatch && sizeMatch && colorMatch);
        });

        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ message: 'Item not found in cart with specified options.' });
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json({ message: 'Item removed from cart successfully', cart });

    } catch (err) {
        console.error('Error removing item from cart:', err);
        res.status(500).json({ message: 'Server error removing item from cart' });
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