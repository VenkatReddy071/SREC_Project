const express = require('express');
const router = express.Router();
const Booking = require('../../models/Hospital/Bookings');
const Contact = require('../../models/Hospital/ContactUs');
const Doctor = require('../../models/Hospital/Doctoer');
const Hospital = require('../../models/Hospital/Hospital');
const {authenticateToken} = require('../../Controllers/Authorization/auth');
const School=require("../../models/Schools/School")
const mongoose = require('mongoose');

const getStartOfDay = (date) => new Date(date.setHours(0, 0, 0, 0));
const getEndOfDay = (date) => new Date(date.setHours(23, 59, 59, 999));
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return getStartOfDay(new Date(d.setDate(diff)));
};
const getEndOfWeek = (date) => {
    const d = getStartOfWeek(new Date(date));
    return getEndOfDay(new Date(d.setDate(d.getDate() + 6)));
};
const getStartOfMonth = (date) => getStartOfDay(new Date(date.getFullYear(), date.getMonth(), 1));
const getEndOfMonth = (date) => getEndOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));

router.use(authenticateToken, async (req, res, next) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ msg: 'Unauthorized: User email not found in token.' });
        }

        let hospitalId;
        
            const hospital = await Hospital.findOne({ ownerEmail: req.user.email });
            if (!hospital) {
                return res.status(404).json({ msg: 'Hospital not found for this owner.' });
            }
            hospitalId = hospital._id;
        req.hospitalId = hospitalId;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during hospital lookup.');
    }
});


router.get('/stats', async (req, res) => {
    try {
        const { hospitalId } = req;

        const totalBookings = await Booking.countDocuments({ Hospital: hospitalId });
        const pendingBookings = await Booking.countDocuments({ Hospital: hospitalId, status: 'Pending' });
        const totalMessages = await Contact.countDocuments({ typeOf: 'Hospital', typeContact: hospitalId });

        const newPatients = await Booking.aggregate([
            { $match: { Hospital: new mongoose.Types.ObjectId(hospitalId), createdAt: { $gte: getStartOfMonth(new Date()) } } },
            { $group: { _id: "$userId" } },
            { $count: "newPatientsCount" }
        ]);
        const newPatientsCount = newPatients.length > 0 ? newPatients[0].newPatientsCount : 0;

        res.json({
            totalBookings,
            newPatients: newPatientsCount,
            totalMessages,
            pendingBookings,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/daily-booking-trend', async (req, res) => {
    try {
        const { hospitalId } = req;
        const trendData = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const startOfDay = getStartOfDay(date);
            const endOfDay = getEndOfDay(date);

            const bookingsCount = await Booking.countDocuments({
                Hospital: hospitalId,
                bookingDate: { $gte: startOfDay, $lte: endOfDay }
            });

            const newPatientsOnDay = await Booking.aggregate([
                { $match: { Hospital: new mongoose.Types.ObjectId(hospitalId), createdAt: { $gte: startOfDay, $lte: endOfDay } } },
                { $group: { _id: "$userId" } },
                { $count: "count" }
            ]);
            const newPatientsCount = newPatientsOnDay.length > 0 ? newPatientsOnDay[0].count : 0;


            trendData.push({
                name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                bookings: bookingsCount,
                newPatients: newPatientsCount,
            });
        }
        console.log(trendData)
        res.json(trendData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/specialization-distribution', async (req, res) => {
    try {
        const { hospitalId } = req;
        const specializationData = await Booking.aggregate([
            { $match: { Hospital: new mongoose.Types.ObjectId(hospitalId) } },
            { $unwind: "$specialization" },
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
        res.json(specializationData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/booking-status-distribution', async (req, res) => {
    try {
        const { hospitalId } = req;
        const statusData = await Booking.aggregate([
            { $match: { Hospital: new mongoose.Types.ObjectId(hospitalId) } },
            {
                $group: {
                    _id: "$status",
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
        res.json(statusData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/time-summaries', async (req, res) => {
    try {
        const { hospitalId } = req;
        const now = new Date();

        const startOfToday = getStartOfDay(new Date(now));
        const endOfToday = getEndOfDay(new Date(now));
        const dailyBookings = await Booking.countDocuments({ Hospital: hospitalId, bookingDate: { $gte: startOfToday, $lte: endOfToday } });
        const dailyNewPatientsResult = await Booking.aggregate([
            { $match: { Hospital: new mongoose.Types.ObjectId(hospitalId), createdAt: { $gte: startOfToday, $lte: endOfToday } } },
            { $group: { _id: "$userId" } },
            { $count: "count" }
        ]);
        const dailyNewPatients = dailyNewPatientsResult.length > 0 ? dailyNewPatientsResult[0].count : 0;

        const startOfWeek = getStartOfWeek(new Date(now));
        const endOfWeek = getEndOfWeek(new Date(now));
        const weeklyBookings = await Booking.countDocuments({ Hospital: hospitalId, bookingDate: { $gte: startOfWeek, $lte: endOfWeek } });
        const weeklyNewPatientsResult = await Booking.aggregate([
            { $match: { Hospital: new mongoose.Types.ObjectId(hospitalId), createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
            { $group: { _id: "$userId" } },
            { $count: "count" }
        ]);
        const weeklyNewPatients = weeklyNewPatientsResult.length > 0 ? weeklyNewPatientsResult[0].count : 0;

        const startOfMonth = getStartOfMonth(new Date(now));
        const endOfMonth = getEndOfMonth(new Date(now));
        const monthlyBookings = await Booking.countDocuments({ Hospital: hospitalId, bookingDate: { $gte: startOfMonth, $lte: endOfMonth } });
        const monthlyNewPatientsResult = await Booking.aggregate([
            { $match: { Hospital: new mongoose.Types.ObjectId(hospitalId), createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: "$userId" } },
            { $count: "count" }
        ]);
        const monthlyNewPatients = monthlyNewPatientsResult.length > 0 ? monthlyNewPatientsResult[0].count : 0;

        res.json({
            dailySummary: { totalBookings: dailyBookings, newPatients: dailyNewPatients },
            weeklySummary: { totalBookings: weeklyBookings, newPatients: weeklyNewPatients },
            monthlySummary: { totalBookings: monthlyBookings, newPatients: monthlyNewPatients },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/recent-bookings', async (req, res) => {
    try {
        const { hospitalId } = req;
        const recentBookings = await Booking.find({ Hospital: hospitalId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('Doctor', 'name')
            .select('name specialization Doctor date status');

        res.json(recentBookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/recent-messages', async (req, res) => {
    try {
        const { hospitalId } = req;
        const recentMessages = await Contact.find({ typeOf: 'Hospital', typeContact: hospitalId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email message createdAt');
        res.json(recentMessages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});









module.exports = router;