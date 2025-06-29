const express = require('express');
const router = express.Router();
const Order = require('../../models/Malls/Order');
const HospitalBooking = require('../../models/Hospital/Bookings');
const ContactForm = require('../../models/Hospital/ContactUs');
const EducationalInstitute = require('../../models/Schools/School'); 
const Hospital = require('../../models/Hospital/Hospital');
const Restaurant = require('../../models/Dining/Restaurant');
const FashionStore = require('../../models/Malls/Malls');
const User = require('../../models/User/LoginModel');


const getIndianTimeBoundaries = () => {
    const now = new Date();
    const indiaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    const startOfDay = new Date(indiaTime);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(indiaTime);
    endOfDay.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(indiaTime);
    startOfWeek.setDate(indiaTime.getDate() - (indiaTime.getDay() + 6) % 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(indiaTime.getFullYear(), indiaTime.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(indiaTime.getFullYear(), indiaTime.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth };
};


router.get('/admin-dashboard/overview', async (req, res) => {
    try {
        const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = getIndianTimeBoundaries();

        const [
            totalRestaurantOrders,
            totalFashionOrders,
            totalHospitalBookings,
            totalContacts,
            restaurantsCount,
            fashionStoresCount,
            hospitalsCount,
            schoolsCount, // This will now count institutes of type 'School'
            newUsersCount
        ] = await Promise.all([
            Order.countDocuments({ sourceType: 'Restaurant' }),
            Order.countDocuments({ sourceType: 'Mall' }),
            HospitalBooking.countDocuments(),
            ContactForm.countDocuments(),
            Restaurant.countDocuments(),
            FashionStore.countDocuments(),
            Hospital.countDocuments(),
            EducationalInstitute.countDocuments({ institutionType: 'School' }), // Count documents with institutionType as 'School'
            User.countDocuments({ createdAt: { $gte: startOfMonth } })
        ]);

        const [
            dailyRestaurantOrders, weeklyRestaurantOrders, monthlyRestaurantOrders,
            dailyFashionOrders, weeklyFashionOrders, monthlyFashionOrders,
            dailyHospitalBookings, weeklyHospitalBookings, monthlyHospitalBookings,
            dailyContacts, weeklyContacts, monthlyContacts,
        ] = await Promise.all([
            Order.countDocuments({ sourceType: 'Restaurant', createdAt: { $gte: startOfDay, $lte: endOfDay } }),
            Order.countDocuments({ sourceType: 'Restaurant', createdAt: { $gte: startOfWeek, $lte: endOfWeek } }),
            Order.countDocuments({ sourceType: 'Restaurant', createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),

            Order.countDocuments({ sourceType: 'Mall', createdAt: { $gte: startOfDay, $lte: endOfDay } }),
            Order.countDocuments({ sourceType: 'Mall', createdAt: { $gte: startOfWeek, $lte: endOfWeek } }),
            Order.countDocuments({ sourceType: 'Mall', createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),

            HospitalBooking.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
            HospitalBooking.countDocuments({ createdAt: { $gte: startOfWeek, $lte: endOfWeek } }),
            HospitalBooking.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),

            ContactForm.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
            ContactForm.countDocuments({ createdAt: { $gte: startOfWeek, $lte: endOfWeek } }),
            ContactForm.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
        ]);


        res.json({
            totalRestaurantOrders,
            totalFashionOrders,
            totalHospitalBookings,
            totalContacts,
            restaurantsCount,
            fashionStoresCount,
            hospitalsCount,
            schoolsCount,
            newUsersCount,

            dailyRestaurantOrders,
            dailyFashionOrders,
            dailyHospitalBookings,
            dailyContacts,

            weeklyRestaurantOrders,
            weeklyFashionOrders,
            weeklyHospitalBookings,
            weeklyContacts,

            monthlyRestaurantOrders,
            monthlyFashionOrders,
            monthlyHospitalBookings,
            monthlyContacts,
        });

    } catch (error) {
        console.error('Error fetching admin dashboard overview:', error);
        res.status(500).json({ message: 'Server error while fetching dashboard data' });
    }
});

router.get('/admin-dashboard/recent-restaurant-orders', async (req, res) => {
    try {
        const orders = await Order.find({ sourceType: 'Restaurant' })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        res.json(orders);
    } catch (error) {
        console.error('Error fetching recent restaurant orders:', error);
        res.status(500).json({ message: 'Server error fetching recent restaurant orders' });
    }
});

router.get('/admin-dashboard/recent-fashion-orders', async (req, res) => {
    try {
        const orders = await Order.find({ sourceType: 'Mall' })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        res.json(orders);
    } catch (error) {
        console.error('Error fetching recent fashion orders:', error);
        res.status(500).json({ message: 'Server error fetching recent fashion orders' });
    }
});

router.get('/admin-dashboard/recent-hospital-bookings', async (req, res) => {
    try {
        const bookings = await HospitalBooking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('Doctor', 'name')
            .lean();

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching recent hospital bookings:', error);
        res.status(500).json({ message: 'Server error fetching recent hospital bookings' });
    }
});

// router.get('/admin-dashboard/recent-contacts', async (req, res) => {
//     try {
//         const contacts = await ContactForm.find()
//             .sort({ createdAt: -1 })
//             .limit(5)
//             // The populate path is now correct as 'typeContact' will dynamically refer to 'Hospital' or 'EducationalInstitute'
//             .populate({ path: 'typeContact', select: 'name' })
//             .lean();

//         res.json(contacts);
//     } catch (error) {
//         console.error('Error fetching recent contacts:', error);
//         res.status(500).json({ message: 'Server error fetching recent contacts' });
//     }
// });

router.get('/admin-dashboard/restaurant-order-status-distribution', async (req, res) => {
    try {
        const statusDistribution = await Order.aggregate([
            {
                $match: { sourceType: 'Restaurant' }
            },
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: "$_id",
                    value: "$count",
                    _id: 0
                }
            }
        ]);
        res.json(statusDistribution);
    } catch (error) {
        console.error('Error fetching restaurant order status distribution:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/admin-dashboard/fashion-category-distribution', async (req, res) => {
    try {
        const categoryDistribution = await Order.aggregate([
            {
                $match: { sourceType: 'Mall' }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.storeName",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: "$_id",
                    value: "$count",
                    _id: 0
                }
            }
        ]);
        res.json(categoryDistribution);
    } catch (error) {
        console.error('Error fetching fashion category distribution:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/admin-dashboard/hospital-specialization-distribution', async (req, res) => {
    try {
        const specializationDistribution = await HospitalBooking.aggregate([
            {
                $group: {
                    _id: "$specialization",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: "$_id",
                    value: "$count",
                    _id: 0
                }
            }
        ]);
        res.json(specializationDistribution);
    } catch (error) {
        console.error('Error fetching hospital specialization distribution:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/admin-dashboard/contact-type-distribution', async (req, res) => {
    try {
        const contactTypeDistribution = await ContactForm.aggregate([
            {
                $group: {
                    _id: "$typeOf",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: "$_id",
                    value: "$count",
                    _id: 0
                }
            }
        ]);
        res.json(contactTypeDistribution);
    } catch (error) {
        console.error('Error fetching contact type distribution:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;