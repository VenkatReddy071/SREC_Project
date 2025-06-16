const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {authenticateToken}=require("../../../Controllers/Authorization/auth")

const Order = require('../../../models/Malls/Order');
const Cart = require('../../../models/Malls/Cart');
const Product = require('../../../models/Malls/Products');
const User = require('../../../models/User/LoginModel');
const Menu = require('../../../models/Dining/Menu');
const orderController = require('../../../Controllers/Malls/Order');

const calculateOrderTotalsAndValidate = async (cartItems) => {
    let subtotal = 0;
    let estimatedTaxes = 0;
    const orderItems = [];
    const productStockUpdates = [];

    let orderSourceType = null;
    let orderSourceId = null;

    if (cartItems.length === 0) {
        throw new Error('No items to process for order.');
    }

    orderSourceType = cartItems[0].sourceType;
    orderSourceId = cartItems[0].sourceId;

    for (const cartItem of cartItems) {
        let currentItemDoc = null;
        let itemPrice = 0;
        let itemCategory = null;
        let availableQuantity = Infinity;

        if (cartItem.sourceType !== orderSourceType || cartItem.sourceId.toString() !== orderSourceId.toString()) {
            throw new Error(`Cart contains items from multiple ${orderSourceType === 'Restaurant' ? 'restaurants' : 'malls/stores'}. Please checkout items from one ${orderSourceType === 'Restaurant' ? 'restaurant' : 'mall/store'} at a time.`);
        }

        if (cartItem.itemModelType === 'Product') {
            currentItemDoc = await Product.findById(cartItem.product);

            if (!currentItemDoc) {
                throw new Error(`Product "${cartItem.name}" not found.`);
            }
            if (currentItemDoc.status === 'inactive') {
                throw new Error(`Product "${currentItemDoc.name}" is inactive and cannot be ordered.`);
            }
            if (currentItemDoc.stockQuantity < cartItem.quantity) {
                throw new Error(`Insufficient stock for "${currentItemDoc.name}". Only ${currentItemDoc.stockQuantity} available.`);
            }

            itemPrice = currentItemDoc.price;
            itemCategory = currentItemDoc.category;
            availableQuantity = currentItemDoc.stockQuantity;

            productStockUpdates.push({
                productId: currentItemDoc._id,
                newStock: currentItemDoc.stockQuantity - cartItem.quantity
            });

        } else if (cartItem.itemModelType === 'Menu') {
            currentItemDoc = await Menu.findById(cartItem.product);

            if (!currentItemDoc) {
                throw new Error(`Menu item "${cartItem.name}" not found.`);
            }
            if (!currentItemDoc.isAvailable) {
                throw new Error(`Menu item "${currentItemDoc.name}" is currently unavailable and cannot be ordered.`);
            }

            itemPrice = currentItemDoc.priceINR;
            itemCategory = currentItemDoc.category;
        } else {
            throw new Error(`Invalid itemModelType "${cartItem.itemModelType}" found in cart.`);
        }

        subtotal += itemPrice * cartItem.quantity;

        if (orderSourceType === 'Product' && itemCategory === 'Electronics') {
            estimatedTaxes += (itemPrice * cartItem.quantity) * 0.18;
        } else {
            estimatedTaxes += (itemPrice * cartItem.quantity) * 0.05;
        }

        orderItems.push({
            product: cartItem.product,
            name: cartItem.name,
            image: cartItem.image,
            price: itemPrice,
            currency: 'INR',
            quantity: cartItem.quantity,
            itemModelType: cartItem.itemModelType,
            sourceType: cartItem.sourceType,
            sourceId: cartItem.sourceId,
            selectedSize: cartItem.selectedSize || undefined,
            selectedColor: cartItem.selectedColor || undefined,
            storeName: cartItem.storeName || undefined
        });
    }

    const totalAmount = parseFloat((subtotal + estimatedTaxes).toFixed(2));

    return {
        orderItems,
        totalAmount,
        estimatedTaxes,
        orderSourceType,
        orderSourceId,
        productStockUpdates
    };
};


router.post('/', async (req, res) => {
    const userId = req.session.user?.id;
    const { customerName, customerEmail, customerPhoneNumber, paymentMethod, orderType, pickupTime, notes } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user session.' });
    }
    if (!customerName || !customerEmail || !paymentMethod) {
        return res.status(400).json({ message: 'Customer name, email, and payment method are required.' });
    }

    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const cart = await Cart.findOne({ user: userId }).session(session);
        if (!cart || cart.items.length === 0) {
            throw new Error('Your cart is empty. Cannot place an order.');
        }

        const firstCartItemModelType = cart.items.length > 0 ? cart.items[0].itemModelType : null;
        if (!firstCartItemModelType) {
            throw new Error('Cart is empty. Cannot place an order.');
        }

        const filteredCartItems = cart.items.filter(item => item.itemModelType === firstCartItemModelType);

        if (filteredCartItems.length === 0) {
            throw new Error(`Your cart does not contain any ${firstCartItemModelType === 'Menu' ? 'menu items' : 'products'} for this type of order.`);
        }
        if (filteredCartItems.length !== cart.items.length) {
            res.status(401).json({ message:'User cart contains mixed item types,please make a Either one Category' });
            console.warn(`User cart contains mixed item types. Only ${firstCartItemModelType} items will be checked out.`);
        }


        const { orderItems, totalAmount, orderSourceType, orderSourceId, productStockUpdates, estimatedTaxes} = await calculateOrderTotalsAndValidate(filteredCartItems);
        
        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new Error('User not found.');
        }

        const newOrder = new Order({
            user: userId,
            customerName,
            customerEmail,
            customerPhoneNumber,
            orderDate: Date.now(),
            sourceType: orderSourceType,
            sourceId: orderSourceId,
            items: orderItems,
            totalAmount,
            currency: 'INR',
            paymentMethod,
            orderStatus: 'pending',
            orderType: orderSourceType === 'Restaurant' ? orderType : undefined,
            pickupTime: (orderSourceType === 'Restaurant' && orderType === 'Takeaway') ? pickupTime : undefined,
            notes,
            Tax:estimatedTaxes,
        });

        await newOrder.save({ session });

        if (orderSourceType === 'Product') {
            for (const update of productStockUpdates) {
                await Product.findByIdAndUpdate(
                    update.productId,
                    { $set: { stockQuantity: update.newStock } },
                    { new: true, session }
                );
            }
        }

        cart.items = cart.items.filter(item => item.itemModelType !== firstCartItemModelType);
        
        if (cart.items.length > 0) {
             console.warn("Cart still contains other item types after checkout. Total price might need full recalculation.");
             cart.totalPrice = 0;
        } else {
            cart.totalPrice = 0;
        }
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: `${orderSourceType} Order placed successfully!`, order: newOrder });

    } catch (err) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        console.error('Order creation error:', err);
        res.status(500).json({ message: err.message || 'Failed to place order.' });
    }
});



router.get('/orders', authenticateToken, orderController.getAllOrders);

router.get('/orders/user', orderController.getUserOrders);

router.get('/orders/mall',authenticateToken, orderController.getMallOrders);
router.get('/orders/restaurant',authenticateToken, orderController.getRestaurantOrders);

router.get('/orders/:orderId',authenticateToken, orderController.getOrderById);
router.put('/orders/:orderId/status', orderController.updateOrderStatus);
router.delete('/orders/:orderId',  orderController.deleteOrder);


module.exports = router;

module.exports = router;