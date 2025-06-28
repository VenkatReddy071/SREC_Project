const express = require('express');
const router = express.Router();
const Order = require('../../models/Malls/Order');
const Restaurant = require("../../models/Malls/Malls");
const {authenticateToken} = require("../../Controllers/Authorization/auth");
const NEW_ORDER_THRESHOLD_MS = 30 * 60 * 1000;

const getDates = (period) => {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
        case 'daily':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            break;
        case 'weekly':
            const dayOfWeek = now.getDay();
            const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            startDate = new Date(now.getFullYear(), now.getMonth(), diff);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7);
            break;
        case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            break;
        default:
            startDate = new Date(0);
            endDate = new Date();
    }
    return { startDate, endDate };
};

const getRestaurantTakeawayMatch = (restaurantId) => ({
    sourceType: 'Mall',
    sourceId: restaurantId,
});

router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const restaurant = await Restaurant.findOne({email});
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found for this user email.' });
        }
        const restaurantId = restaurant._id;
        
        const commonMatch = getRestaurantTakeawayMatch(restaurantId);
        const now = new Date();
        const newOrderCutoff = new Date(now.getTime() - NEW_ORDER_THRESHOLD_MS);
        const totalOrders = await Order.countDocuments(commonMatch);
        const newOrders = await Order.countDocuments({
            ...commonMatch,
            orderDate: { $gte: newOrderCutoff },
            orderStatus: { $nin: ['completed', 'cancelled'] }
        });

        const completedOrders = await Order.countDocuments({
            ...commonMatch,
            orderStatus: 'completed'
        });

        const pendingOrders = await Order.countDocuments({
            ...commonMatch,
            orderStatus: 'pending'
        });

        res.json({ totalOrders, newOrders, completedOrders, pendingOrders });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/daily-trend', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const restaurant = await Restaurant.findOne({email});
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found for this user email.' });
        }
        const restaurantId = restaurant._id;

        const commonMatch = getRestaurantTakeawayMatch(restaurantId);
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const trendData = await Order.aggregate([
            {
                $match: {
                    ...commonMatch,
                    orderDate: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
                    orders: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const formattedTrendData = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateString = date.toISOString().split('T')[0];
            const found = trendData.find(d => d._id === dateString);
            formattedTrendData.push({
                name: date.toLocaleString('en-US', { weekday: 'short' }),
                orders: found ? found.orders : 0,
                revenue: found ? found.revenue : 0
            });
        }

        res.json(formattedTrendData);
    } catch (error) {
        console.error('Error fetching daily trend:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/category-distribution', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const restaurant = await Restaurant.findOne({email});
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found for this user email.' });
        }
        const restaurantId = restaurant._id;

        const commonMatch = getRestaurantTakeawayMatch(restaurantId);

        const categoryData = await Order.aggregate([
            {
                $match: commonMatch
            },
            {
                $unwind: '$items'
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'menuItemDetails'
                }
            },
            {
                $unwind: {
                    path: '$menuItemDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$menuItemDetails.category',
                    value: { $sum: '$items.quantity' }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: { $ifNull: ['$_id', 'Uncategorized'] },
                    value: 1
                }
            },
            {
                $sort: { value: -1 }
            }
        ]);
        res.json(categoryData);
    } catch (error) {
        console.error('Error fetching category distribution:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/payment-distribution', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const restaurant = await Restaurant.findOne({email});
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found for this user email.' });
        }
        const restaurantId = restaurant._id;

        const commonMatch = getRestaurantTakeawayMatch(restaurantId);

        const paymentData = await Order.aggregate([
            {
                $match: commonMatch
            },
            {
                $group: {
                    _id: '$paymentMethod',
                    value: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    value: 1
                }
            },
            {
                $sort: { value: -1 }
            }
        ]);
        res.json(paymentData);
    } catch (error) {
        console.error('Error fetching payment distribution:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/time-summaries', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const restaurant = await Restaurant.findOne({email});
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found for this user email.' });
        }
        const restaurantId = restaurant._id;

        const getSummary = async (startDate, endDate) => {
            const result = await Order.aggregate([
                {
                    $match: {
                        ...commonMatch,
                        orderDate: { $gte: startDate, $lt: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: "$totalAmount" }
                    }
                }
            ]);
            return result[0] || { totalOrders: 0, totalRevenue: 0 };
        };

        const commonMatch = getRestaurantTakeawayMatch(restaurantId); // Define commonMatch before using it
        const { startDate: dailyStart, endDate: dailyEnd } = getDates('daily');
        const dailySummary = await getSummary(dailyStart, dailyEnd);

        const { startDate: weeklyStart, endDate: weeklyEnd } = getDates('weekly');
        const weeklySummary = await getSummary(weeklyStart, weeklyEnd);

        const { startDate: monthlyStart, endDate: monthlyEnd } = getDates('monthly');
        const monthlySummary = await getSummary(monthlyStart, monthlyEnd);

        res.json({
            dailySummary,
            weeklySummary,
            monthlySummary,
        });

    } catch (error) {
        console.error('Error fetching time summaries:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/recent-orders', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const restaurant = await Restaurant.findOne({email});
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found for this user email.' });
        }
        const restaurantId = restaurant._id;

        const commonMatch = getRestaurantTakeawayMatch(restaurantId);
        const now = new Date();
        const newOrderCutoff = new Date(now.getTime() - NEW_ORDER_THRESHOLD_MS);

        const recentOrders = await Order.find(commonMatch)
            .sort({ orderDate: -1 })
            .limit(5)
            .select('id items.name totalAmount orderStatus orderDate');
        
        const formattedRecentOrders = recentOrders.map(order => {
            let displayStatus = order.orderStatus;
            if (order.orderDate >= newOrderCutoff && !['completed', 'cancelled'].includes(order.orderStatus)) {
                displayStatus = 'New';
            }

            return {
                id: order._id,
                item: order.items && order.items.length > 0 ? order.items[0].name : 'Multiple Items',
                amount: order.totalAmount,
                status: displayStatus,
                time: new Date(order.orderDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
        });

        res.json(formattedRecentOrders);
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;