const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../../../models/Malls/Order');
const Cart = require('../../../models/Malls/Cart');
const Product = require('../../../models/Malls/Products');
const User = require('../../../models/User/LoginModel');

const calculateOrderTotalsAndValidate = async (cartItems) => {
    let subtotal = 0;
    let estimatedTaxes = 0;
    const orderProducts = [];
    const productUpdates = [];

    let orderMallId = null;
    let orderStoreName = null;
    let orderCurrency = 'INR';

    if (cartItems.length === 0) {
        throw new Error('Cart is empty. Cannot place an order.');
    }
    orderMallId = cartItems[0].mall;
    orderStoreName = cartItems[0].storeName;
    orderCurrency = cartItems[0].currency;

    for (const cartItem of cartItems) {
        const product = await Product.findById(cartItem.product._id);

        if (!product) {
            throw new Error(`Product ${cartItem.name} not found.`);
        }
        if (product.status === 'inactive') {
            throw new Error(`Product ${product.name} is inactive and cannot be ordered.`);
        }
        if (product.stockQuantity < cartItem.quantity) {
            throw new Error(`Insufficient stock for ${product.name}. Only ${product.stockQuantity} available.`);
        }
        if (orderMallId && cartItem.mall.toString() !== orderMallId.toString()) {
            throw new Error('Cart contains items from multiple malls. Please checkout items from one mall at a time.');
        }

        const priceAtOrder = product.price;
        subtotal += priceAtOrder * cartItem.quantity;

        if (product.category === 'Electronics') {
            estimatedTaxes += (priceAtOrder * cartItem.quantity) * 0.18;
        } else {
            estimatedTaxes += (priceAtOrder * cartItem.quantity) * 0.05;
        }

        orderProducts.push({
            product: cartItem.product._id,
            quantity: cartItem.quantity,
            priceAtOrder: priceAtOrder,
            selectedSize: cartItem.selectedSize,
            selectedColor: cartItem.selectedColor,
        });
        productUpdates.push({
            productId: product._id,
            newStock: product.stockQuantity - cartItem.quantity
        });
    }

    const totalAmount = parseFloat((subtotal + estimatedTaxes).toFixed(2));

    return { orderProducts, totalAmount, estimatedTaxes, orderMallId, orderStoreName, orderCurrency, productUpdates };
};

router.post('/', async (req, res) => {
    const userId = req.session.user?.id;
    const { customerName, customerEmail, customerPhoneNumber, paymentMethod } = req.body;

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

        const { orderProducts, totalAmount, orderMallId, orderStoreName, orderCurrency, productUpdates } = await calculateOrderTotalsAndValidate(cart.items);
        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new Error('User not found.');
        }

        const newOrder = new Order({
            user: userId,
            customerName,
            customerEmail,
            customerPhoneNumber,
            mall: orderMallId,
            storeName: orderStoreName,
            products: orderProducts,
            totalAmount,
            currency: orderCurrency,
            paymentMethod,
            orderStatus: 'Pending',
        });

        await newOrder.save({ session });
        for (const update of productUpdates) {
            await Product.findByIdAndUpdate(
                update.productId,
                { $set: { stockQuantity: update.newStock } },
                { new: true, session }
            );
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Order placed successfully!', order: newOrder });

    } catch (err) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        console.error('Order creation error:', err);
        res.status(500).json({ message: err.message || 'Failed to place order.' });
    }
});

module.exports = router;