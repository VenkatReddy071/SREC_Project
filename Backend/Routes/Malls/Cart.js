// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');

// const Cart = require('../../models/Malls/Cart');
// const Product = require('../../models/Malls/Products');
// const User = require('../../models/User/LoginModel');

// const calculateCartTotals = async (cart) => {
//     let subtotal = 0;
//     let estimatedTaxes = 0;
//     const itemsToRemove = [];

//     for (let i = 0; i < cart.items.length; i++) {
//         const cartItem = cart.items[i];
//         const currentProduct = await Product.findById(cartItem.product._id);

//         if (!currentProduct || currentProduct.status === 'inactive' || currentProduct.stockQuantity === 0) {
//             itemsToRemove.push(i);
//             continue;
//         }

//         if (cartItem.quantity > currentProduct.stockQuantity) {
//             cartItem.quantity = currentProduct.stockQuantity;
//         }

//         const itemPrice = currentProduct.price;
//         subtotal += itemPrice * cartItem.quantity;

//         if (currentProduct.category === 'Electronics') {
//             estimatedTaxes += (itemPrice * cartItem.quantity) * 0.18;
//         } else {
//             estimatedTaxes += (itemPrice * cartItem.quantity) * 0.05;
//         }
//     }

//     // Remove invalid/out-of-stock items after iterating
//     for (let i = itemsToRemove.length - 1; i >= 0; i--) {
//         cart.items.splice(itemsToRemove[i], 1);
//     }

//     cart.totalPrice = parseFloat(subtotal.toFixed(2));
//     const grandTotal = parseFloat((subtotal + estimatedTaxes).toFixed(2));

//     return { subtotal: cart.totalPrice, estimatedTaxes: parseFloat(estimatedTaxes.toFixed(2)), grandTotal };
// };

// router.get('/', async (req, res) => {
//     try {
//         const userId = req.session.user?.id;

//         if (!userId) {
//             return res.status(401).json({ message: 'Authentication required. No user session.' });
//         }

//         let cart = await Cart.findOne({ user: userId }).populate('items.product');

//         if (!cart) {
//             return res.status(200).json({
//                 message: 'Cart is empty',
//                 cart: { user: userId, items: [], totalPrice: 0 },
//                 subtotal: 0,
//                 estimatedTaxes: 0,
//                 grandTotal: 0
//             });
//         }

//         const { subtotal, estimatedTaxes, grandTotal } = await calculateCartTotals(cart);

//         await cart.save();

//         res.status(200).json({
//             message: 'Cart retrieved successfully',
//             cart,
//             subtotal,
//             estimatedTaxes,
//             grandTotal
//         });

//     } catch (err) {
//         console.error('Error getting cart:', err);
//         res.status(500).json({ message: 'Server error fetching cart' });
//     }
// });

// router.post('/add', async (req, res) => {
//     const { productId, quantity, selectedSize, selectedColor } = req.body;
//     const userId = req.session.user?.id;

//     if (!userId) {
//         return res.status(401).json({ message: 'Authentication required. No user session.' });
//     }

//     if (!productId || !quantity || quantity < 1) {
//         return res.status(400).json({ message: 'Product ID and a valid quantity are required.' });
//     }

//     try {
//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found.' });
//         }
//         if (product.status === 'inactive') {
//             return res.status(400).json({ message: 'Product is currently inactive.' });
//         }
//         if (product.stockQuantity === 0) {
//             return res.status(400).json({ message: 'Product is out of stock.' });
//         }
//         if (quantity > product.stockQuantity) {
//             return res.status(400).json({ message: `Only ${product.stockQuantity} units of this product are available.` });
//         }

//         if (product.availableSizes && product.availableSizes.length > 0 && !product.availableSizes.includes(selectedSize)) {
//             return res.status(400).json({ message: 'Invalid size selected for this product.' });
//         }
//         if (product.availableColors && product.availableColors.length > 0 && !product.availableColors.includes(selectedColor)) {
//             return res.status(400).json({ message: 'Invalid color selected for this product.' });
//         }

//         let cart = await Cart.findOne({ user: userId });

//         if (!cart) {
//             cart = new Cart({ user: userId, items: [], totalPrice: 0 });
//         }

//         const existingItemIndex = cart.items.findIndex(item =>
//             item.product.toString() === productId &&
//             item.selectedSize === selectedSize &&
//             item.selectedColor === selectedColor
//         );

//         if (existingItemIndex > -1) {
//             const newQuantity = cart.items[existingItemIndex].quantity + quantity;
//             if (newQuantity > product.stockQuantity) {
//                 return res.status(400).json({ message: `Adding this quantity would exceed available stock (${product.stockQuantity}).` });
//             }
//             cart.items[existingItemIndex].quantity = newQuantity;
//         } else {
//             cart.items.push({
//                 product: productId,
//                 name: product.name,
//                 image: product.images.length > 0 ? product.images[0] : null,
//                 price: product.price,
//                 currency: product.currency,
//                 quantity,
//                 selectedSize,
//                 selectedColor,
//                 mall: product.mall,
//                 storeName: product.storeName
//             });
//         }

//         await calculateCartTotals(cart);
//         await cart.save();
//         res.status(200).json({ message: 'Item added to cart successfully', cart });

//     } catch (err) {
//         console.error('Error adding to cart:', err);
//         res.status(500).json({ message: 'Server error adding item to cart' });
//     }
// });

// router.put('/update-quantity', async (req, res) => {
//     const { productId, selectedSize, selectedColor, quantity } = req.body;
//     const userId = req.session.user?.id;

//     if (!userId) {
//         return res.status(401).json({ message: 'Authentication required. No user session.' });
//     }

//     if (!productId || quantity === undefined || quantity < 0) {
//         return res.status(400).json({ message: 'Product ID and a valid quantity are required.' });
//     }

//     try {
//         let cart = await Cart.findOne({ user: userId });

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found.' });
//         }

//         const itemIndex = cart.items.findIndex(item =>
//             item.product.toString() === productId &&
//             item.selectedSize === selectedSize &&
//             item.selectedColor === selectedColor
//         );

//         if (itemIndex === -1) {
//             return res.status(404).json({ message: 'Item not found in cart.' });
//         }

//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found for quantity update.' });
//         }

//         if (quantity === 0) {
//             cart.items.splice(itemIndex, 1);
//         } else {
//             if (quantity > product.stockQuantity) {
//                 return res.status(400).json({ message: `Requested quantity exceeds available stock (${product.stockQuantity}).` });
//             }
//             cart.items[itemIndex].quantity = quantity;
//         }

//         await calculateCartTotals(cart);
//         await cart.save();
//         res.status(200).json({ message: 'Cart item quantity updated successfully', cart });

//     } catch (err) {
//         console.error('Error updating cart quantity:', err);
//         res.status(500).json({ message: 'Server error updating cart quantity' });
//     }
// });

// router.delete('/remove/:productId', async (req, res) => {
//     const { productId } = req.params;
//     const { selectedSize, selectedColor } = req.query;
//     const userId = req.session.user?.id;

//     if (!userId) {
//         return res.status(401).json({ message: 'Authentication required. No user session.' });
//     }

//     try {
//         let cart = await Cart.findOne({ user: userId });

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found.' });
//         }

//         const initialItemCount = cart.items.length;
//         cart.items = cart.items.filter(item => {
//             const isMatch = item.product.toString() === productId;
//             const sizeMatch = selectedSize ? item.selectedSize === selectedSize : true;
//             const colorMatch = selectedColor ? item.selectedColor === selectedColor : true;
//             return !(isMatch && sizeMatch && colorMatch);
//         });

//         if (cart.items.length === initialItemCount) {
//             return res.status(404).json({ message: 'Item not found in cart with specified options.' });
//         }

//         await calculateCartTotals(cart);
//         await cart.save();
//         res.status(200).json({ message: 'Item removed from cart successfully', cart });

//     } catch (err) {
//         console.error('Error removing item from cart:', err);
//         res.status(500).json({ message: 'Server error removing item from cart' });
//     }
// });

// router.delete('/clear', async (req, res) => {
//     const userId = req.session.user?.id;

//     if (!userId) {
//         return res.status(401).json({ message: 'Authentication required. No user session.' });
//     }

//     try {
//         let cart = await Cart.findOne({ user: userId });

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found.' });
//         }

//         cart.items = [];
//         cart.totalPrice = 0;
//         await cart.save();

//         res.status(200).json({ message: 'Cart cleared successfully', cart });

//     } catch (err) {
//         console.error('Error clearing cart:', err);
//         res.status(500).json({ message: 'Server error clearing cart' });
//     }
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');

// const Cart = require('../../models/Malls/Cart');
// const Product = require('../../models/Malls/Products');
// const User = require('../../models/User/LoginModel');

// const calculateCartTotals = async (cart) => {
//     let subtotal = 0;
//     let estimatedTaxes = 0;
//     const itemsToRemove = [];

//     for (let i = 0; i < cart.items.length; i++) {
//         const cartItem = cart.items[i];
//         if (cartItem.itemModelType && cartItem.itemModelType !== 'Product') {
//             itemsToRemove.push(i);
//             continue;
//         }

//         const currentProduct = await Product.findById(cartItem.product);

//         if (!currentProduct || currentProduct.status === 'inactive' || currentProduct.stockQuantity === 0) {
//             itemsToRemove.push(i);
//             continue;
//         }

//         if (cartItem.quantity > currentProduct.stockQuantity) {
//             cartItem.quantity = currentProduct.stockQuantity;
//         }

//         const itemPrice = currentProduct.price;
//         subtotal += itemPrice * cartItem.quantity;

//         if (currentProduct.category === 'Electronics') {
//             estimatedTaxes += (itemPrice * cartItem.quantity) * 0.18;
//         } else {
//             estimatedTaxes += (itemPrice * cartItem.quantity) * 0.05;
//         }
//     }

//     for (let i = itemsToRemove.length - 1; i >= 0; i--) {
//         cart.items.splice(itemsToRemove[i], 1);
//     }

//     cart.totalPrice = parseFloat(subtotal.toFixed(2));
//     const grandTotal = parseFloat((subtotal + estimatedTaxes).toFixed(2));

//     return { subtotal: cart.totalPrice, estimatedTaxes: parseFloat(estimatedTaxes.toFixed(2)), grandTotal };
// };

// router.get('/', async (req, res) => {
//     try {
//         const userId = req.session.user?.id;

//         if (!userId) {
//             return res.status(401).json({ message: 'Authentication required. No user session.' });
//         }

//         let cart = await Cart.findOne({ user: userId }).populate('items.product');

//         if (!cart) {
//             return res.status(200).json({
//                 message: 'Cart is empty',
//                 cart: { user: userId, items: [], totalPrice: 0 },
//                 subtotal: 0,
//                 estimatedTaxes: 0,
//                 grandTotal: 0
//             });
//         }

//         const { subtotal, estimatedTaxes, grandTotal } = await calculateCartTotals(cart);

//         await cart.save();

//         res.status(200).json({
//             message: 'Cart retrieved successfully',
//             cart,
//             subtotal,
//             estimatedTaxes,
//             grandTotal
//         });

//     } catch (err) {
//         console.error('Error getting cart:', err);
//         res.status(500).json({ message: 'Server error fetching cart' });
//     }
// });

// router.post('/add', async (req, res) => {
//     const { productId, quantity, selectedSize, selectedColor } = req.body;
//     const userId = req.session.user?.id;

//     if (!userId) {
//         return res.status(401).json({ message: 'Authentication required. No user session.' });
//     }

//     if (!productId || !quantity || quantity < 1) {
//         return res.status(400).json({ message: 'Product ID and a valid quantity are required.' });
//     }

//     try {
//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found.' });
//         }
//         if (product.status === 'inactive') {
//             return res.status(400).json({ message: 'Product is currently inactive.' });
//         }
//         if (product.stockQuantity === 0) {
//             return res.status(400).json({ message: 'Product is out of stock.' });
//         }
//         if (quantity > product.stockQuantity) {
//             return res.status(400).json({ message: `Only ${product.stockQuantity} units of this product are available.` });
//         }

//         if (product.availableSizes && product.availableSizes.length > 0 && selectedSize && !product.availableSizes.includes(selectedSize)) {
//             return res.status(400).json({ message: 'Invalid size selected for this product.' });
//         }
//         if (product.availableColors && product.availableColors.length > 0 && selectedColor && !product.availableColors.includes(selectedColor)) {
//             return res.status(400).json({ message: 'Invalid color selected for this product.' });
//         }

//         let cart = await Cart.findOne({ user: userId });

//         if (!cart) {
//             cart = new Cart({ user: userId, items: [], totalPrice: 0 });
//         }

//         const existingItemIndex = cart.items.findIndex(item =>
//             item.product.toString() === productId &&
//             item.itemModelType === 'Product' &&
//             item.selectedSize === selectedSize &&
//             item.selectedColor === selectedColor
//         );

//         if (existingItemIndex > -1) {
//             const newQuantity = cart.items[existingItemIndex].quantity + quantity;
//             if (newQuantity > product.stockQuantity) {
//                 return res.status(400).json({ message: `Adding this quantity would exceed available stock (${product.stockQuantity}).` });
//             }
//             cart.items[existingItemIndex].quantity = newQuantity;
//         } else {
//             cart.items.push({
//                 product: productId,
//                 name: product.name,
//                 image: product.images.length > 0 ? product.images[0] : null,
//                 price: product.price,
//                 currency: product.currency,
//                 quantity,
//                 itemModelType: 'Product',
//                 sourceType: 'Mall',
//                 sourceId: product.mall,
//                 selectedSize,
//                 selectedColor,
//                 storeName: product.storeName
//             });
//         }

//         await calculateCartTotals(cart);
//         await cart.save();
//         res.status(200).json({ message: 'Item added to cart successfully', cart });

//     } catch (err) {
//         console.error('Error adding to cart:', err);
//         res.status(500).json({ message: 'Server error adding item to cart' });
//     }
// });

// router.put('/update-quantity', async (req, res) => {
//     const { productId, selectedSize, selectedColor, quantity } = req.body;
//     const userId = req.session.user?.id;

//     if (!userId) {
//         return res.status(401).json({ message: 'Authentication required. No user session.' });
//     }

//     if (!productId || quantity === undefined || quantity < 0) {
//         return res.status(400).json({ message: 'Product ID and a valid quantity are required.' });
//     }

//     try {
//         let cart = await Cart.findOne({ user: userId });

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found.' });
//         }

//         const itemIndex = cart.items.findIndex(item =>
//             item.product.toString() === productId &&
//             item.itemModelType === 'Product' &&
//             item.selectedSize === selectedSize &&
//             item.selectedColor === selectedColor
//         );

//         if (itemIndex === -1) {
//             return res.status(404).json({ message: 'Item not found in cart.' });
//         }

//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found for quantity update.' });
//         }

//         if (quantity === 0) {
//             cart.items.splice(itemIndex, 1);
//         } else {
//             if (quantity > product.stockQuantity) {
//                 return res.status(400).json({ message: `Requested quantity exceeds available stock (${product.stockQuantity}).` });
//             }
//             cart.items[itemIndex].quantity = quantity;
//         }

//         await calculateCartTotals(cart);
//         await cart.save();
//         res.status(200).json({ message: 'Cart item quantity updated successfully', cart });

//     } catch (err) {
//         console.error('Error updating cart quantity:', err);
//         res.status(500).json({ message: 'Server error updating cart quantity' });
//     }
// });

// router.delete('/remove/:productId', async (req, res) => {
//     const { productId } = req.params;
//     const { selectedSize, selectedColor } = req.query;
//     const userId = req.session.user?.id;

//     if (!userId) {
//         return res.status(401).json({ message: 'Authentication required. No user session.' });
//     }

//     try {
//         let cart = await Cart.findOne({ user: userId });

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found.' });
//         }

//         const initialItemCount = cart.items.length;
//         cart.items = cart.items.filter(item => {
//             const isMatch = item.product.toString() === productId && item.itemModelType === 'Product';
//             const sizeMatch = selectedSize ? item.selectedSize === selectedSize : true;
//             const colorMatch = selectedColor ? item.selectedColor === selectedColor : true;
//             return !(isMatch && sizeMatch && colorMatch);
//         });

//         if (cart.items.length === initialItemCount) {
//             return res.status(404).json({ message: 'Item not found in cart with specified options.' });
//         }

//         await calculateCartTotals(cart);
//         await cart.save();
//         res.status(200).json({ message: 'Item removed from cart successfully', cart });

//     } catch (err) {
//         console.error('Error removing item from cart:', err);
//         res.status(500).json({ message: 'Server error removing item from cart' });
//     }
// });

// router.delete('/clear', async (req, res) => {
//     const userId = req.session.user?.id;

//     if (!userId) {
//         return res.status(401).json({ message: 'Authentication required. No user session.' });
//     }

//     try {
//         let cart = await Cart.findOne({ user: userId });

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found.' });
//         }

//         cart.items = [];
//         cart.totalPrice = 0;
//         await cart.save();

//         res.status(200).json({ message: 'Cart cleared successfully', cart });

//     } catch (err) {
//         console.error('Error clearing cart:', err);
//         res.status(500).json({ message: 'Server error clearing cart' });
//     }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Cart = require('../../models/Malls/Cart');
const Product = require('../../models/Malls/Products');
const User = require('../../models/User/LoginModel');
const Menu=require("../../models/Dining/Menu")
const calculateCartTotals = async (cart) => {
    let subtotal = 0;
    let estimatedTaxes = 0;
    const itemsToRemove = [];

    for (let i = 0; i < cart.items.length; i++) {
        const cartItem = cart.items[i];
        let currentItemModel;
        let itemStatus;
        let itemStockQuantity = Infinity;

        if (cartItem.itemModelType === 'Product') {
            currentItemModel = await Product.findById(cartItem.product);
            itemStatus = currentItemModel ? currentItemModel.status : 'inactive';
            itemStockQuantity = currentItemModel ? currentItemModel.stockQuantity : 0;
        } else if (cartItem.itemModelType === 'Menu') {
            currentItemModel = await Menu.findById(cartItem.product);
            itemStatus = currentItemModel ? 'active' : 'inactive';
        } else {
            itemsToRemove.push(i);
            continue;
        }

        if (!currentItemModel || itemStatus === 'inactive' || itemStockQuantity === 0) {
            itemsToRemove.push(i);
            continue;
        }

        if (cartItem.quantity > itemStockQuantity) {
            cartItem.quantity = itemStockQuantity;
        }

        const itemPrice = currentItemModel.price ||currentItemModel.priceINR;
        subtotal += itemPrice * cartItem.quantity;

        if (cartItem.itemModelType === 'Product') {
            if (currentItemModel.category === 'Electronics') {
                estimatedTaxes += (itemPrice * cartItem.quantity) * 0.18;
            } else {
                estimatedTaxes += (itemPrice * cartItem.quantity) * 0.05;
            }
        } else if (cartItem.itemModelType === 'Menu') {
            estimatedTaxes += (itemPrice * cartItem.quantity) * 0.08;
        }
    }

    for (let i = itemsToRemove.length - 1; i >= 0; i--) {
        cart.items.splice(itemsToRemove[i], 1);
    }

    cart.totalPrice = parseFloat(subtotal.toFixed(2));
    const grandTotal = parseFloat((subtotal + estimatedTaxes).toFixed(2));

    return {
        subtotal: cart.totalPrice,
        estimatedTaxes: parseFloat(estimatedTaxes.toFixed(2)),
        grandTotal
    };
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
    const { itemId, quantity, itemModelType, sourceType, sourceId, selectedSize, selectedColor } = req.body?.product;
    const userId = req.session.user?.id;
    console.log(req.body,req.body?.product);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user session.' });
    }

    if (!itemId || !quantity || quantity < 1 || !itemModelType || !sourceType || !sourceId) {
        return res.status(400).json({ message: 'Item ID, quantity, itemModelType, sourceType, and sourceId are required.' });
    }

    try {
        let currentItem;
        let itemStockQuantity = Infinity;

        if (itemModelType === 'Product') {
            currentItem = await Product.findById(itemId);
            if (currentItem) {
                if (currentItem.status === 'inactive') {
                    return res.status(400).json({ message: 'Product is currently inactive.' });
                }
                itemStockQuantity = currentItem.stockQuantity;
            }
        } else if (itemModelType === 'Menu') {
            currentItem = await Menu.findById(itemId);
        } else {
            return res.status(400).json({ message: 'Invalid itemModelType provided.' });
        }

        if (!currentItem) {
            return res.status(404).json({ message: `${itemModelType} not found.` });
        }
        if (itemStockQuantity !== Infinity && quantity > itemStockQuantity) {
            return res.status(400).json({ message: `Only ${itemStockQuantity} units of this ${itemModelType.toLowerCase()} are available.` });
        }

        if (itemModelType === 'Product') {
            if (currentItem.availableSizes && currentItem.availableSizes.length > 0 && selectedSize && !currentItem.availableSizes.includes(selectedSize)) {
                return res.status(400).json({ message: 'Invalid size selected for this product.' });
            }
            if (currentItem.availableColors && currentItem.availableColors.length > 0 && selectedColor && !currentItem.availableColors.includes(selectedColor)) {
                return res.status(400).json({ message: 'Invalid color selected for this product.' });
            }
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        const existingItemIndex = cart.items.findIndex(item =>
            item.product.toString() === itemId &&
            item.itemModelType === itemModelType &&
            item.sourceType === sourceType &&
            item.sourceId.toString() === sourceId &&
            (item.selectedSize || '') === (selectedSize || '') &&
            (item.selectedColor || '') === (selectedColor || '')
        );

        if (existingItemIndex > -1) {
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (itemStockQuantity !== Infinity && newQuantity > itemStockQuantity) {
                return res.status(400).json({ message: `Adding this quantity would exceed available stock (${itemStockQuantity}).` });
            }
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            cart.items.push({
                product: itemId,
                name: currentItem.name,
                image: (itemModelType === 'Product' ? currentItem.images && currentItem.images.length > 0 ? currentItem.images[0] : null :currentItem?.imageUrl ),
                price: currentItem.price ||currentItem.priceINR,
                currency: currentItem.currency || 'INR',
                quantity,
                itemModelType,
                sourceType,
                sourceId,
                selectedSize,
                selectedColor,
                storeName: currentItem.storeName || currentItem.restaurantName || null
            });
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json({ message: 'Item added/updated in cart successfully', cart });

    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ message: 'Server error adding item to cart', error: err.message });
    }
});

router.put('/update-quantity', async (req, res) => {
    const { itemId, quantity, itemModelType, sourceType, sourceId, selectedSize, selectedColor } = req.body;
    const userId = req.session.user?.id;
    console.log(req.body);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user session.' });
    }

    if (!itemId || quantity === undefined || quantity < 0 || !itemModelType || !sourceType || !sourceId) {
        return res.status(400).json({ message: 'Item ID, valid quantity, itemModelType, sourceType, and sourceId are required.' });
    }

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === itemId &&
            item.itemModelType === itemModelType &&
            item.sourceType === sourceType &&
            item.sourceId.toString() === sourceId &&
            (item.selectedSize || '') === (selectedSize || '') &&
            (item.selectedColor || '') === (selectedColor || '')
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart with specified options.' });
        }

        let currentItem;
        let itemStockQuantity = Infinity;

        if (itemModelType === 'Product') {
            currentItem = await Product.findById(itemId);
            if (currentItem) itemStockQuantity = currentItem.stockQuantity;
        } else if (itemModelType === 'Menu') {
            currentItem = await Menu.findById(itemId);
        }

        if (!currentItem) {
            cart.items.splice(itemIndex, 1);
            await calculateCartTotals(cart);
            await cart.save();
            return res.status(404).json({ message: `${itemModelType} no longer exists. Item removed from cart.`, cart });
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            if (itemStockQuantity !== Infinity && quantity > itemStockQuantity) {
                return res.status(400).json({ message: `Requested quantity exceeds available stock (${itemStockQuantity}).` });
            }
            cart.items[itemIndex].quantity = quantity;
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json({ message: 'Cart item quantity updated successfully', cart });

    } catch (err) {
        console.error('Error updating cart quantity:', err);
        res.status(500).json({ message: 'Server error updating cart quantity', error: err.message });
    }
});

router.delete('/remove', async (req, res) => {
    const { itemId, itemModelType, sourceType, sourceId, selectedSize, selectedColor } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user session.' });
    }

    if (!itemId || !itemModelType || !sourceType || !sourceId) {
        return res.status(400).json({ message: 'Item ID, itemModelType, sourceType, and sourceId are required for removal.' });
    }

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => {
            const isMatch = item.product.toString() === itemId &&
                            item.itemModelType === itemModelType &&
                            item.sourceType === sourceType &&
                            item.sourceId.toString() === sourceId &&
                            (item.selectedSize || '') === (selectedSize || '') &&
                            (item.selectedColor || '') === (selectedColor || '');
            return !isMatch;
        });

        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ message: 'Item not found in cart with specified options.' });
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json({ message: 'Item removed from cart successfully', cart });

    } catch (err) {
        console.error('Error removing item from cart:', err);
        res.status(500).json({ message: 'Server error removing item from cart', error: err.message });
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
