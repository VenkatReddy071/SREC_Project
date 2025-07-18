const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {authenticateToken}=require("../../../Controllers/Authorization/auth")
const createNotifications=require("../../../Utilities/UserNotification");
const Order = require('../../../models/Malls/Order');
const Cart = require('../../../models/Malls/Cart');
const Product = require('../../../models/Malls/Products');
const User = require('../../../models/User/LoginModel');
const Menu = require('../../../models/Dining/Menu');
const orderController = require('../../../Controllers/Malls/Order');

const calculateOrderTotalsAndValidate = async (cartItems,discountOfferValue) => {
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
    return {
        orderItems,
        orderSourceType,
        orderSourceId,
        productStockUpdates
    };
};

module.exports=(io)=>{


router.post('/', async (req, res) => {
    const userId = req.session.user?.id;
    const { customerName, customerEmail, customerPhoneNumber, paymentMethod, orderType, pickupTime, notes,selectedOfferId,discountOfferValue,cartTotals,shippingAddress,finalTotalAmount } = req.body;
    console.log(req.body);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user session.' });
    }
    if (!customerName || !customerEmail) {
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

        const discount=selectedOfferId?discountOfferValue:0;
        const { orderItems, orderSourceType, orderSourceId, productStockUpdates} = await calculateOrderTotalsAndValidate(filteredCartItems,discount);
        const appliedCharges=cartTotals.appliedCharges;
        console.log(appliedCharges);
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
            totalAmount:finalTotalAmount,
            currency: 'INR',
            paymentMethod,
            orderStatus: 'pending',
            orderType: orderSourceType === 'Restaurant' ? orderType : undefined,
            pickupTime: (orderSourceType === 'Restaurant' && orderType === 'Takeaway') ? pickupTime : undefined,
            notes,
            offerId:selectedOfferId,
            discountValue:discountOfferValue,
            appliedTaxes:appliedCharges,
            shippingAddress
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
        await createNotifications({userId:userId,type:"new_order",title:`Your ${orderSourceType} Order placed successfully!`,message:`our order ${newOrder._id} has been successfully placed! We're processing your order!"`})
        await session.commitTransaction();  
        session.endSession();
        const populatedOrder= await Order.findById(newOrder?._id)
                    .populate({
                        path: "user",
                        model: "User",
                        select: "name email"
                    })
                    .populate({
                        path: "sourceId",
                        refPath: 'sourceType',
                        select: "name email address phoneNumber image"
                    })
                    .populate({
                        path: "items.product",
                        refPath: 'items.itemModelType',
                        select: "name description price priceINR currency category brand color gender imageUrl isAvailable images"
                    });
        const type=orderSourceType === "Restaurant"?`dashboard_restaurant_${orderSourceId}`:`dashboard_fashion_${orderSourceId}`;
        io.to(type).emit("newOrder",{
            order:populatedOrder,
            user:userId,
        })
         io.to("dashboard_admin").emit(`newOrder_${orderSourceType}`, {
            order:populatedOrder,
            user:userId,
         })
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



router.get('/orders', orderController.getAllOrders);

router.get('/orders/user', orderController.getUserOrders);

router.get('/orders/mall',authenticateToken, orderController.getMallOrders);
router.get('/orders/restaurant',authenticateToken, orderController.getRestaurantOrders);

router.get('/orders/:orderId',authenticateToken, orderController.getOrderById);
router.put('/orders/:orderId/status', orderController.updateOrderStatus);
router.delete('/orders/:orderId',  orderController.deleteOrder);

router.put('/cancel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authorization required. Please log in." });
        }

        if (!reason || typeof reason !== 'string' || reason.trim() === "") {
            return res.status(400).json({ success: false, message: "Cancellation reason is required and cannot be empty." });
        }

        const booking = await Order.findById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        if (booking.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to cancel this order. You can only cancel your own orders." });
        }
        const cancellableStatuses = ['pending', 'confirmed', 'processing'];
        if (cancellableStatuses.includes(booking.orderStatus.toLowerCase())) {
            booking.orderStatus = 'user_cancel';
            booking.reasion = reason.trim();
            
            
            booking.subStatus.push({
                status: 'user_cancel',
                date: new Date(),
            });

            await booking.save();

            return res.status(200).json({
                success: true,
                message: "Order cancelled successfully.",
                
                booking: {
                    _id: booking._id,
                    orderStatus: booking.orderStatus,
                    reasion: booking.reasion,
                    subStatus: booking.subStatus,
                
                }
            });
        } else {
            return res.status(400).json({ success: false, message: `Order cannot be cancelled as its current status is '${booking.orderStatus}'.` });
        }

    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
})
return router;
}

