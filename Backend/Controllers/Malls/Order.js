


const mongoose = require("mongoose");
const Order = require("../../models/Malls/Order");
const User = require("../../models/User/LoginModel");
const Product = require("../../models/Malls/Products");
const Menu = require("../../models/Dining/Menu");
const Mall = require('../../models/Malls/Malls');
const Restaurant = require('../../models/Dining/Restaurant');
const createNotifications=require("../../Utilities/UserNotification");
exports.getAllOrders = async (req, res) => {
    try {
        const { sourceType } = req.query; 
        let query = {};
        let sourcePopulateOptions = {
            path: "sourceId",
            refPath: 'sourceType',
            select: "name email address phoneNumber image"
        };
        let itemPopulateOptions = {
            path: "items.product",
            refPath: 'items.itemModelType',
            select: "name description price priceINR currency category brand color gender imageUrl isAvailable images"
        };

        if (sourceType) {
            if (sourceType !== 'Restaurant' && sourceType !== 'Mall') {
                return res.status(400).json({ message: "Invalid sourceType. Must be 'Restaurant' or 'Mall'." });
            }
            query.sourceType = sourceType;

            if (sourceType === 'Restaurant') {
                sourcePopulateOptions.model = 'Restaurant';
                sourcePopulateOptions.select = "name email address phoneNumber";
                itemPopulateOptions.select = "name description priceINR category imageUrl isAvailable";
            } else if (sourceType === 'Mall') {
                sourcePopulateOptions.model = 'Mall';
                sourcePopulateOptions.select = "name email address phoneNumber image";
                itemPopulateOptions.select = "name description price currency category brand color gender images";
            }
        }

        const orders = await Order.find(query)
            .populate({
                path: "user",
                model: "User",
                select: "name email"
            })
            .populate(sourcePopulateOptions)
            .populate(itemPopulateOptions);

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully.",
            data: orders
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching orders.",
            error: error.message
        });
    }
};


exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const { sourceType, page = 1, limit = 10 } = req.query;
        console.log(sourceType);
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: Please login/Sign up."
            });
        }

        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        if (isNaN(parsedPage) || parsedPage < 1 || isNaN(parsedLimit) || parsedLimit < 1) {
            return res.status(400).json({
                message: "Invalid page or limit provided. Both must be positive integers."
            });
        }

        let query = { user: userId };
        let sourcePopulateOptions = {
            path: "sourceId",
            refPath: 'sourceType',
            select: "name email address phoneNumber image"
        };
        let itemPopulateOptions = {
            path: "items.product",
            refPath: 'items.itemModelType',
            select: "name description price priceINR currency category brand color gender imageUrl isAvailable images"
        };

        if (sourceType) {
            if (sourceType !== 'Restaurant' && sourceType !== 'Mall') {
                return res.status(400).json({ message: "Invalid sourceType. Must be 'Restaurant' or 'Mall'." });
            }
            query.sourceType = sourceType;

            if (sourceType === 'Restaurant') {
                sourcePopulateOptions.model = 'Restaurant';
                sourcePopulateOptions.select = "name email address phoneNumber";
                itemPopulateOptions.select = "name description priceINR category imageUrl isAvailable";
            } else if (sourceType === 'Mall') {
                sourcePopulateOptions.model = 'Mall';
                sourcePopulateOptions.select = "name email address phoneNumber image";
                itemPopulateOptions.select = "name description price currency category brand color gender images";
            }
        }

        const totalOrders = await Order.countDocuments(query); 
        const skip = (parsedPage - 1) * parsedLimit;

        const userOrders = await Order.find(query)
            .populate({
                path: "user",
                model: "User",
                select: "name email",
            })
            .populate(sourcePopulateOptions)
            .populate(itemPopulateOptions)
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(parsedLimit);

        if (!userOrders || userOrders.length === 0) {
            if (totalOrders > 0 && skip >= totalOrders) {
                 return res.status(200).json({
                    message: "No more orders to load.",
                    orders: [],
                    totalOrders: totalOrders,
                    currentPage: parsedPage,
                    totalPages: Math.ceil(totalOrders / parsedLimit)
                });
            }
            return res.status(404).json({
                message: "No orders found for this user.",
                orders: [],
                totalOrders: totalOrders,
                currentPage: parsedPage,
                totalPages: Math.ceil(totalOrders / parsedLimit)
            });
        }

        return res.status(200).json({
            message: "Success",
            orders: userOrders,
            totalOrders: totalOrders,
            currentPage: parsedPage,
            totalPages: Math.ceil(totalOrders / parsedLimit),
            hasMore: parsedPage * parsedLimit < totalOrders // Indicate if there are more pages
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user orders.",
            error: error.message
        });
    }
};
exports.getMallOrders = async (req, res) => {
    try {
        const mallEmail = req?.user?.email;
        if (!mallEmail) {
            return res.status(401).json({
                message: "Unauthorized: Mall email not found in token."
            });
        }

        const mall = await Mall.findOne({
            email: mallEmail
        });
        if (!mall) {
            return res.status(404).json({
                message: "Mall not found for the provided email."
            });
        }

        const mallOrders = await Order.find({
                sourceType: 'Mall',
                sourceId: mall._id
            })
            .populate({
                path: "user",
                model: "User",
                select: "name email",
            })
            .populate({
                path: "sourceId",
                model: "Mall",
                select: 'name email address phoneNumber image'
            })
            .populate({
                path: "items.product",
                refPath: 'items.itemModelType',
                select: "name description price currency category brand color gender images"
            });

        if (!mallOrders || mallOrders.length === 0) {
            return res.status(404).json({
                message: "No orders found for this mall."
            });
        }

        return res.status(200).json({
            message: "Success",
            orders: mallOrders
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching mall orders.",
            error: error.message
        });
    }
};

// New route to get orders specifically from Restaurants (sourceType: 'Restaurant')
exports.getRestaurantOrders = async (req, res) => {
    try {
        const restaurantEmail = req?.user?.email;
        if (!restaurantEmail) {
            return res.status(401).json({
                message: "Unauthorized: Restaurant email not found in token."
            });
        }

        const restaurant = await Restaurant.findOne({
            email: restaurantEmail
        });
        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found for the provided email."
            });
        }

        const restaurantOrders = await Order.find({
                sourceType: 'Restaurant',
                sourceId: restaurant._id
            })
            .populate({
                path: "user",
                model: "User",
                select: "name email",
            })
            .populate({
                path: "sourceId",
                model: "Restaurant",
                select: 'name email address phoneNumber'
            })
            .populate({
                path: "items.product",
                refPath: 'items.itemModelType',
                select: "name description priceINR category imageUrl isAvailable"
            });

        if (!restaurantOrders || restaurantOrders.length === 0) {
            return res.status(404).json({
                message: "No orders found for this restaurant."
            });
        }

        return res.status(200).json({
            message: "Success",
            orders: restaurantOrders
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching restaurant orders.",
            error: error.message
        });
    }
};


// exports.updateOrderStatus = async (req, res) => {
//     try {
//         const {
//             orderId
//         } = req.params;
//         const {
//             status
//         } = req.body;
//         console.log(status);
//         if (!orderId || !status) {
//             return res.status(400).json({
//                 message: "Order ID and status are required."
//             });
//         }

//         const validStatuses = ["pending", "confirmed", "processing", "ready_for_pickup", "shipped", "delivered", "completed", "cancelled", "refunded"];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({
//                 message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
//             });
//         }

//         const updatedOrder = await Order.findByIdAndUpdate(
//             orderId, {
//                 orderStatus: status
//             }, {
//                 new: true
//             }
//         )

//         if (!updatedOrder) {
//             return res.status(404).json({
//                 message: "Order not found."
//             });
//         }

//         return res.status(200).json({
//             status: true,
//             message: "Order status updated successfully.",
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error updating order status.",
//             error: error.message
//         });
//     }
// };

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                message: "Order ID and status are required."
            });
        }

        const validStatuses = ["pending", "confirmed", "processing", "ready_for_pickup", "shipped", "delivered", "completed", "cancelled", "refunded"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        if (!existingOrder.subStatus || !Array.isArray(existingOrder.subStatus)) {
            existingOrder.subStatus = [];
        }

        existingOrder.subStatus.push({ date: new Date(), status: status });

        existingOrder.orderStatus = status;
        const updatedOrder = await existingOrder.save();
        console.log(updatedOrder);
        await createNotifications({userId:updatedOrder.user,type:"order_update",title:`Your Order Status Update: ${status}!`,message:`Great news! Your  Order  #${updatedOrder._id} Status is Updated please visit it.!`})
        return res.status(200).json({
            status: true,
            message: "Order status updated successfully.",
            order: updatedOrder
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error updating order status.",
            error: error.message
        });
    }
};
exports.getOrderById = async (req, res) => {
    try {
        const {
            orderId
        } = req.params;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required."
            });
        }

        const order = await Order.findById(orderId)
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

        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        return res.status(200).json({
            message: "Success",
            order: order
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching order.",
            error: error.message
        });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const {
            orderId
        } = req.params;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required."
            });
        }

        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        return res.status(200).json({
            message: "Order deleted successfully.",
            deletedOrder: deletedOrder
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error deleting order.",
            error: error.message
        });
    }
};
