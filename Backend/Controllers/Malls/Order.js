// const mongoose = require("mongoose");
// const Order = require("../../models/Malls/Order");
// const Mall = require("../../models/Malls/Malls");

// exports.getAllOrders = async (req, res) => {
//     try {
//         const orders = await Order.find({})
//             .populate({
//                 path: "mall",
//                 model: "Mall",
//                 select: "name email address phoneNumber"
//             })
//             .populate({
//                 path: "products.product",
//                 model: "Product",
//                 select: "name description price currency category brand color gender"
//             });

//         if (!orders || orders.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No orders found."
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Orders fetched successfully.",
//             data: orders
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error fetching orders.",
//             error: error.message
//         });
//     }
// };

// exports.getUserOrders = async (req, res) => {
//     try {
//         const {
//             userId
//         } = req?.session?.user?.id;
//         if (!userId) {
//             return res.status(404).json({
//                 message: "UnAuthorization please login/Sign up"
//             });
//         }

//         const userOrders = await Order.find({
//                 user: userId
//             })
//             .populate({
//                 path: "user",
//                 model: "User",
//                 select: "name email",
//             })
//             .populate({
//                 path: "products.product",
//                 model: "Product",
//                 select: "name description price currency category brand color gender"
//             })
//             .populate({
//                 path: "mall",
//                 model: "Mall",
//                 select: 'name email address phoneNumber image'
//             });

//         if (!userOrders) {
//             return res.status(200).json({
//                 message: "orders not found.."
//             });
//         }

//         return res.status(200).json({
//             message: "success",
//             orders: userOrders
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error fetching orders.",
//             error: error.message
//         });
//     }
// }

// exports.getMallOrders = async (req, res) => {
//     try {
//         const mallEmail = req?.user?.email; // Assuming email is extracted from JWT and available in req.user
//         if (!mallEmail) {
//             return res.status(401).json({
//                 message: "Unauthorized: Mall email not found in token."
//             });
//         }

//         const mall = await Mall.findOne({
//             email: mallEmail
//         });
//         if (!mall) {
//             return res.status(404).json({
//                 message: "Mall not found for the provided email."
//             });
//         }

//         const mallOrders = await Order.find({
//                 mall: mall._id
//             })
//             .populate({
//                 path: "user",
//                 model: "User",
//                 select: "name email",
//             })
//             .populate({
//                 path: "products.product",
//                 model: "Product",
//                 select: "name description price currency category brand color gender"
//             });

//         if (!mallOrders || mallOrders.length === 0) {
//             return res.status(404).json({
//                 message: "No orders found for this mall."
//             });
//         }

//         return res.status(200).json({
//             message: "Success",
//             orders: mallOrders
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error fetching mall orders.",
//             error: error.message
//         });
//     }
// };

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

//         const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled','completed','refunded'];
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
//             status:true,
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

// exports.getOrderById = async (req, res) => {
//     try {
//         const {
//             orderId
//         } = req.params;

//         if (!orderId) {
//             return res.status(400).json({
//                 message: "Order ID is required."
//             });
//         }

//         const order = await Order.findById(orderId)
//             .populate({
//                 path: "user",
//                 model: "User",
//                 select: "name email"
//             })
//             .populate({
//                 path: "mall",
//                 model: "Mall",
//                 select: "name email address phoneNumber image"
//             })
//             .populate({
//                 path: "products.product",
//                 model: "Product",
//                 select: "name description price currency category brand color gender"
//             });

//         if (!order) {
//             return res.status(404).json({
//                 message: "Order not found."
//             });
//         }

//         return res.status(200).json({
//             message: "Success",
//             order: order
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error fetching order.",
//             error: error.message
//         });
//     }
// };

// exports.deleteOrder = async (req, res) => {
//     try {
//         const {
//             orderId
//         } = req.params;

//         if (!orderId) {
//             return res.status(400).json({
//                 message: "Order ID is required."
//             });
//         }

//         const deletedOrder = await Order.findByIdAndDelete(orderId);

//         if (!deletedOrder) {
//             return res.status(404).json({
//                 message: "Order not found."
//             });
//         }

//         return res.status(200).json({
//             message: "Order deleted successfully.",
//             deletedOrder: deletedOrder
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error deleting order.",
//             error: error.message
//         });
//     }
// };




const mongoose = require("mongoose");
const Order = require("../../models/Malls/Order"); // Your generalized Order model
const User = require("../../models/User/LoginModel");
const Product = require("../../models/Malls/Products"); // Product model
const Menu = require("../../models/Dining/Menu"); // Menu model
const Mall = require('../../models/Malls/Malls'); // Assuming you have a Mall model
const Restaurant = require('../../models/Dining/Restaurant'); // Assuming you have a Restaurant model

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
        const { sourceType } = req.query; // Get sourceType from query parameters

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: Please login/Sign up."
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

        const userOrders = await Order.find(query)
            .populate({
                path: "user",
                model: "User",
                select: "name email",
            })
            .populate(sourcePopulateOptions)
            .populate(itemPopulateOptions);

        if (!userOrders || userOrders.length === 0) {
            return res.status(404).json({
                message: "No orders found for this user."
            });
        }

        return res.status(200).json({
            message: "Success",
            orders: userOrders
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user orders.",
            error: error.message
        });
    }
}

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


exports.updateOrderStatus = async (req, res) => {
    try {
        const {
            orderId
        } = req.params;
        const {
            status
        } = req.body;
        console.log(status);
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

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, {
                orderStatus: status
            }, {
                new: true
            }
        )

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        return res.status(200).json({
            status: true,
            message: "Order status updated successfully.",
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
