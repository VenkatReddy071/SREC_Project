const TableBooking = require("../../models/Dining/TableBookings");
const express = require("express");
const router = express.Router();
const {authenticateToken}=require("../../Controllers/Authorization/auth")
const Restaurant = require("../../models/Dining/Restaurant");
const createNotifications = require("../../Utilities/UserNotification");
const moment = require('moment-timezone');

module.exports = (io) => {

    router.get("/admin/bookings", authenticateToken, async(req, res) => {
    try {
        const { limit = 10, page = 0 } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const skip = parsedPage * parsedLimit;

        // Fetch paginated bookings
        const bookings = await TableBooking.find({})
            .limit(parsedLimit)
            .skip(skip)
            .sort({ createdAt: -1 }); // Sort by creation date, newest first

        // Get total count of all bookings
        const totalBookings = await TableBooking.countDocuments({});

        res.status(200).json({
            bookings,
            totalBookings,
            currentPage: parsedPage,
            limit: parsedLimit,
        });
    } catch (error) {
        console.error("Error fetching admin bookings:", error);
        res.status(500).json({ message: "Server error" });
    }
});

    router.get("/res/restaurant/booking/dashboard", authenticateToken, async(req, res) => {
        try {
            const { email } = req.user;
            const restaurant = await Restaurant.findOne({ email });
            if (!restaurant) {
                return res.status(404).json({ message: "Restaurant Not Found" });
            }
            const bookings = await TableBooking.find({ restaurant: restaurant._id });
            console.log(bookings)
            res.status(200).json(bookings);
        } catch (error) {
            console.error("Error fetching restaurant bookings:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

    router.post("/book", async(req, res) => {
        try {
            if (!req.session || !req.session.user) {
                return res.status(401).json({ message: "Unauthorized. Please log in." });
            }
            const userId = req.session.user.id;

            const { name, email, mobileNumber, scheduleDate, timeSlot, guest, restaurantId } = req.body;

            if (!name || !email || !mobileNumber || !scheduleDate || !timeSlot || !guest || !restaurantId) {
                return res.status(400).json({ message: "Missing required booking details." });
            }

            const newBooking = new TableBooking({
                name,
                email,
                mobileNumber,
                bookingDate: new Date(),
                scheduleDate: new Date(scheduleDate),
                time: timeSlot,
                guest,
                user: userId,
                restaurant: restaurantId,
            });

            await newBooking.save();

            await createNotifications({
                userId,
                type: "new_booking",
                title: `Your Table Booking Order placed successfully!`,
                message: `Your booking ${newBooking._id} has been successfully placed! We're processing your booking!"`
            });

            io.to(userId).emit("newBooking", {
                order: newBooking,
                user: userId,
            });

            io.to("dashboard_admin").emit(`newBooking`, {
                order: newBooking,
                user: userId,
            });

            res.status(200).json(newBooking);
        } catch (error) {
            console.error("Error creating booking:", error);
            res.status(500).json({ message: "Server error during booking." });
        }
    });

    // Modified user bookings route for infinite scrolling
    router.get("/user", async(req, res) => {
        try {
            const userId = req.session?.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized. Please login!" });
            }
            const { limit = 10, page = 0 } = req.query; // Default limit and page

            const bookings = await TableBooking.find({ user: userId })
                .limit(parseInt(limit))
                .skip(parseInt(page) * parseInt(limit))
                .sort({ bookingDate: -1 })
                .populate({
                    path:"restaurant",
                    model:"Restaurant",
                    select:"name address imageUrls.mainImage"
                }); // Sort by most recent booking first

            const totalBookings = await TableBooking.countDocuments({ user: userId });

            res.status(200).json({
                bookings,
                totalPages: Math.ceil(totalBookings / parseInt(limit)),
                currentPage: parseInt(page),
                totalResults: totalBookings
            });
        } catch (error) {
            console.error("Error fetching user bookings:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

    router.put("/user/:id", async(req, res) => {
        try {
            const userId = req.session?.user?.id;
            const { id } = req.params;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized. Please login!" });
            }
            const booking = await TableBooking.findById(id);
            if (!booking) {
                return res.status(404).json({ message: "Booking not found." });
            }

            booking.status = "user_cancel";
            if (!booking.subStatus) {
                booking.subStatus = [];
            }
            booking.subStatus.push({
                date: new Date(),
                status: 'user_cancel',
            });
            await booking.save();
            res.status(200).json(booking);
        } catch (error) {
            console.error("Error cancelling user booking:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
    router.put("/admin/:id/status", authenticateToken, async(req, res) => {
        try {
            const { id } = req.params;
            const { status, reason } = req.body; // status: 'accept', 'admin_cancel', 'rejected'

            if (!status || !['accept', 'admin_cancel', 'rejected'].includes(status)) {
                return res.status(400).json({ message: "Invalid status provided." });
            }

            const booking = await TableBooking.findById(id);
            if (!booking) {
                return res.status(404).json({ message: "Booking not found." });
            }

            // Prevent updating if already cancelled or completed
            if (booking.status === 'user_cancel' || booking.status === 'admin_cancel' || booking.status === 'completed' || booking.status === 'rejected') {
                return res.status(400).json({ message: `Booking is already in '${booking.status}' status and cannot be updated.` });
            }

            // Set reason if provided for cancellation/rejection
            if ((status === 'admin_cancel' || status === 'rejected') && !reason) {
                return res.status(400).json({ message: "Reason is required for cancellation or rejection." });
            }
            if (status === 'admin_cancel' || status === 'rejected') {
                booking.reason = reason;
            } else {
                booking.reason = undefined; // Clear reason if accepting
            }

            booking.status = status;
            booking.subStatus.push({
                date: new Date(),
                status: status,
            });

            await booking.save();


            // Notify the user about the status change
            let notificationTitle = "";
            let notificationMessage = "";
            switch (status) {
                case 'accept':
                    notificationTitle = `Your booking at ${booking.restaurant} has been confirmed!`;
                    notificationMessage = `Your booking ${booking._id} for ${moment(booking.scheduleDate).format('DD MMM YYYY')} at ${booking.time} has been accepted.`;
                    break;
                case 'admin_cancel':
                    notificationTitle = `Your booking at ${booking.restaurant} has been cancelled by admin.`;
                    notificationMessage = `Booking ${booking._id} has been cancelled by the restaurant. Reason: ${reason || 'N/A'}`;
                    break;
                case 'rejected':
                    notificationTitle = `Your booking at ${booking.restaurant} has been rejected.`;
                    notificationMessage = `Booking ${booking._id} has been rejected by the restaurant. Reason: ${reason || 'N/A'}`;
                    break;
            }

            await createNotifications({
                userId: booking.user._id,
                type: "booking_update",
                title: notificationTitle,
                message: notificationMessage
            });

            // Emit to the user whose booking was updated
            io.to(booking.user._id).emit("bookingUpdated", {
                booking: booking,
                type: status
            });

            // Emit to admin dashboard (to update all connected admin dashboards)
            io.to("dashboard_admin").emit("bookingUpdated", {
                booking: booking,
                type: status
            });

            res.status(200).json({ success: true, message: `Booking status updated to ${status}.`, booking });
        } catch (error) {
            console.error("Error updating booking status by admin:", error);
            res.status(500).json({ success: false, message: "Server error updating booking status." });
        }
    });

    router.get("/res/:restaurantId/timeslots", async(req, res) => {
    try {
        const { restaurantId } = req.params;
        // If no date provided, default to today in India timezone
        const selectedDateString = req.query.date;
        const nowInIndia = moment().tz("Asia/Kolkata"); // IST

        const selectedDate = selectedDateString ?
            moment.tz(selectedDateString, "YYYY-MM-DD", "Asia/Kolkata").startOf('day') :
            nowInIndia.clone().startOf('day');

        // This block needs to be carefully considered.
        // If no date is provided and selectedDate (which defaults to today) is
        // before nowInIndia.startOf('day') (which is technically always false as selectedDate is startOf('day')),
        // it implies trying to get slots for a past day without explicitly providing it.
        // A more robust check might be if selectedDate.isBefore(nowInIndia.startOf('day')) regardless of selectedDateString
        // However, given the current context, this condition is usually to catch if someone
        // requests "today" but it's already a past day (which shouldn't happen with the default).
        // Let's assume for now the intent is to prevent showing slots for a past 'today'.
        // If today is requested and it's already past the current day, it implies looking for slots
        // for a day that has already concluded.
        // A simpler approach for default "today" might be: if selectedDateString is not provided,
        // and nowInIndia is past the operating hours of today, then it should move to tomorrow.
        // For now, let's keep this as is but be aware of its subtle interaction.
        if (!selectedDateString && selectedDate.isBefore(nowInIndia.startOf('day'))) {
             selectedDate.add(1, 'day'); // Move to tomorrow if "today" has passed.
        }


        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found." });
        }

        const dayOfWeek = selectedDate.format('dddd'); // e.g., "Friday"

        const todayOperatingHours = restaurant.operatingHours.find(
            (oh) => oh.day === dayOfWeek
        );

        if (!todayOperatingHours || todayOperatingHours.isClosed) {
            return res.status(200).json({
                isClosed: true,
                message: `${restaurant.name} is closed on ${dayOfWeek}.`,
                timeSlots: [],
            });
        }

        let restaurantOpenTime = moment.tz(todayOperatingHours.openTime, 'HH:mm', "Asia/Kolkata");
        let restaurantCloseTime = moment.tz(todayOperatingHours.closeTime, 'HH:mm', "Asia/Kolkata");

        // Set the full date for open and close times to the selectedDate
        restaurantOpenTime.year(selectedDate.year()).month(selectedDate.month()).date(selectedDate.date());
        restaurantCloseTime.year(selectedDate.year()).month(selectedDate.month()).date(selectedDate.date());

        // Handle cases where closing time might be on the next day (e.g., opens Mon 10 PM, closes Tue 2 AM)
        if (restaurantCloseTime.isBefore(restaurantOpenTime)) {
            restaurantCloseTime.add(1, 'day');
        }

        // Determine the effective start time for generating slots
        let effectiveOpenTime = restaurantOpenTime.clone();

        if (selectedDate.isSame(nowInIndia, 'day')) {
            // For the current day, ensure we don't offer slots in the past
            if (nowInIndia.isSameOrAfter(restaurantCloseTime)) {
                return res.status(200).json({
                    isClosed: false,
                    message: "No more available slots for today.",
                    timeSlots: [],
                });
            }

            // Calculate the next 30-minute interval from the current time
            const nextAvailableTimeFromNow = nowInIndia.clone();
            const currentMinute = nextAvailableTimeFromNow.minute();
            const remainder = currentMinute % 30;

            if (remainder !== 0) {
                nextAvailableTimeFromNow.add(30 - remainder, 'minutes');
            }
            // If remainder is 0, we start from the current minute itself, but still need to consider if it's
            // exactly on the half-hour or hour mark. If it's 6:00, next slot is 6:00. If 6:01, next slot is 6:30.
            // If it's 6:30, next slot is 6:30.

            // The effective open time for today is the later of the restaurant's opening time
            // and the next available 30-minute slot from the current moment.
            if (nextAvailableTimeFromNow.isAfter(effectiveOpenTime)) {
                effectiveOpenTime = nextAvailableTimeFromNow;
            }
        }
        
        // If effectiveOpenTime has passed restaurantCloseTime, it means no slots are available
        if (effectiveOpenTime.isSameOrAfter(restaurantCloseTime)) {
            return res.status(200).json({
                isClosed: false,
                message: "No more available slots for today.",
                timeSlots: [],
            });
        }


        const slotIntervalMinutes = 60; // Every 1 hour
        const maxBookingsPerSlot = restaurant.seatingAvailability && restaurant.seatingAvailability.length > 0 ?
            restaurant.seatingAvailability.reduce((sum, item) => sum + item.capacity, 0) :
            50; // Default if seatingAvailability is not set or empty, assuming guest capacity

        const timeSlots = [];
        let currentTime = effectiveOpenTime.clone(); // Start from the determined effectiveOpenTime

        const existingBookings = await TableBooking.find({
            restaurant: restaurantId,
            scheduleDate: {
                $gte: selectedDate.toDate(),
                $lt: moment(selectedDate).endOf('day').toDate(),
            },
            status: { $in: ['pending', 'accept'] },
        });

        const bookingGuestCounts = {};
        existingBookings.forEach(booking => {
            const bookingTimeMoment = moment.tz(booking.time, 'HH:mm', "Asia/Kolkata");
            
            bookingGuestCounts[bookingTimeMoment.format('HH:mm')] = (bookingGuestCounts[bookingTimeMoment.format('HH:mm')] || 0) + booking.guest;
        });

        while (currentTime.isBefore(restaurantCloseTime)) {
            const slotTime = currentTime.format('HH:mm');
            const guestsBookedForSlot = bookingGuestCounts[slotTime] || 0;

            if (guestsBookedForSlot < maxBookingsPerSlot) {
                timeSlots.push(slotTime);
            }
            currentTime.add(slotIntervalMinutes, 'minutes');
        }
        
        console.log(timeSlots);
        res.status(200).json({
            isClosed: false,
            message: timeSlots.length > 0 ? null : "No available slots for the selected date.",
            timeSlots,
        });

    } catch (error) {
        console.error("Error generating time slots:", error);
        res.status(500).json({ message: "Server error generating time slots." });
    }
});

    return router;
};