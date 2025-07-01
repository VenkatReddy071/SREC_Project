const express = require("express");
const router = express.Router();
const Booking = require("../../../models/Hospital/Bookings");
const Hospital = require("../../../models/Hospital/Hospital");
const {authenticateToken } = require("../../Authorization/auth");
const  createNotifications=require("../../../Utilities/UserNotification");
const updateBookingHistoryStatus = async (booking) => {
    if (booking.history === true) {
        return false;
    }

    const bookingDateTime = new Date(booking.date);
    const [hours, minutes] = booking.slot.split(':').map(Number);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    const twentyFourHoursAfterBookingTime = new Date(bookingDateTime.getTime() + 24 * 60 * 60 * 1000);

    const now = new Date();

    if (now > twentyFourHoursAfterBookingTime) {
        booking.history = true;
        await booking.save();
        return true;
    }
    return false;
};

router.post("/", async (req, res) => {
    const {
        slot, name, email, date, specialization,hospitalId,doctorId,
        offer, age, gender, mobilenumber, message
    } = req.body;
    console.log(req.body);
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ msg: 'No active session, please log in.' });
        }

        const newBooking = new Booking({
            userId: req.session.user?.id,
            slot,
            name,
            email,
            bookingDate:Date.now(),
            ScheduleDate:date,
            specialization,
            Hospital: hospitalId,
            Doctor: doctorId,
            offer,
            age,
            gender,
            mobilenumber,
            message,
            status: 'Pending',
            history: false,
        });

        const booking = await newBooking.save();
        await createNotifications({userId:req.session.user.id,type:"new_order",title:"Appointment Confirmed!",message:"Your appointment for [Service/Reason] on [Date] at [Time] has been successfully booked. We look forward to seeing you!"});
        res.status(201).json(booking);
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        res.status(500).send("Server Error");
    }
});

// router.get("/my-bookings", async (req, res) => {
//     try {
//         const userId = req.session.user?.id;
//         let bookings = await Booking.find({ userId })
//             .populate({
//                 path:"Hospital",
//                 model:"Hospital",
//                 select:'name address'
//             })
//             .populate('Doctor', 'name ')
//             .sort({ date: -1, slot: -1 });

//         for (let booking of bookings) {
//             await updateBookingHistoryStatus(booking);
//         }

//         bookings = await Booking.find({ userId })
//             .populate('Hospital', 'name address ownerEmail image')
//             .populate('Doctor', 'name ')
//             .sort({ date: -1, slot: -1 });

//         res.json(bookings);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// });

router.get("/my-bookings", async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let bookingsToUpdate = await Booking.find({ userId });
        for (let booking of bookingsToUpdate) {
            await updateBookingHistoryStatus(booking);
        }

        const bookings = await Booking.find({ userId })
            .populate('Hospital', 'name address ownerEmail image')
            .populate('Doctor', 'name')
            .sort({ bookingDate: -1})
            .skip(skip)
            .limit(limit);

        const totalBookings = await Booking.countDocuments({ userId });
        const hasMore = (page * limit) < totalBookings;

        res.json({
            bookings,
            totalBookings,
            page,
            limit,
            hasMore
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
router.put("/my-bookings/fav/:id", async (req, res) => {
    try {
        const {id}=req.params;
        const userId = req.session.user?.id;
        const bookings=await Booking.findById(id);

        if(!bookings){
            return res.status(400).json({message:"Failed Up update"});
        }
        if(!bookings.favBooking){
            bookings.favBooking=true;
        }
        else{
            bookings.favBooking=!bookings.favBooking;
        }
        await bookings.save();
        return res.status(200).json(bookings);
    
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
router.put("/:bookingId/cancel", async (req, res) => {
    const { reason } = req.body;

    try {
        let booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        if (booking.userId.toString() !== req.session.user?.id) {
            return res.status(401).json({ msg: "Not authorized to cancel this booking" });
        }

        if (booking.status === 'Cancelled' || booking.status === 'Rejected' || booking.history === true) {
            return res.status(400).json({ msg: `Cannot cancel a booking with status: ${booking.status} or if it's in history.` });
        }

        const bookingDate = new Date(booking.date);
        const [hours, minutes] = booking.slot.split(':').map(Number);
        bookingDate.setHours(hours, minutes, 0, 0);
        const now = new Date();
        const fortyEightHoursFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

        if (bookingDate < fortyEightHoursFromNow) {
            return res.status(400).json({ msg: 'Bookings cannot be cancelled within 48 hours of the appointment time.' });
        }

        booking.status = 'Cancelled';
         if (!booking.subStatus) {
            booking.subStatus = [];
        }
        booking.subStatus.push({ date: new Date(), status: 'Cancelled' });
        if (reason) {
            booking.message = (booking.message ? booking.message + '\n' : '') + `Cancellation Reason: ${reason}`;
        }
        await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.put("/admin/:bookingId", async (req, res) => {
    const { slot, name, email, date, specialization, Hospital: hospitalId, Doctor: doctorId,
        offer, age, gender, mobilenumber, message } = req.body;

    try {
        let booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        if (booking.status === 'Cancelled' || booking.status === 'Rejected' || booking.history === true) {
            return res.status(400).json({ msg: `Cannot update a booking with status: ${booking.status} or if it's in history.` });
        }

        if (slot) booking.slot = slot;
        if (name) booking.name = name;
        if (email) booking.email = email;
        if (date) booking.date = date;
        if (specialization) booking.specialization = specialization;
        if (hospitalId) booking.Hospital = hospitalId;
        if (doctorId) booking.Doctor = doctorId;
        if (offer) booking.offer = offer;
        if (age) booking.age = age;
        if (gender) booking.gender = gender;
        if (mobilenumber) booking.mobilenumber = mobilenumber;
        if (message) booking.message = message;

        await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        res.status(500).send("Server Error");
    }
});

router.get("/admin/hospital",authenticateToken, async (req, res) => {
    try {
        const {email}=req.user;
        const hospital = await Hospital.findOne({ownerEmail:email});
        if (!hospital) {
            return res.status(404).json({ msg: "Hospital not found with that email." });
        }

        let bookings = await Booking.find({ Hospital: hospital._id })
            .populate('userId', 'name email')
            .populate('Hospital', 'name address email')
            .populate('Doctor', 'name specialization')
            .sort({ bookingDate: -1, slot: -1 });

        for (let booking of bookings) {
            await updateBookingHistoryStatus(booking);
        }

        bookings = await Booking.find({ Hospital: hospital._id })
            .populate('userId', 'name email')
            .populate('Hospital', 'name address email')
            .populate('Doctor', 'name specialization')
            .sort({ bookingDate: -1, slot: -1 });

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.get("/admin/all",authenticateToken, async (req, res) => {
    try {
        let bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('Hospital', 'name address email')
            .populate('Doctor', 'name specialization')
            .sort({ createdAt: -1 });

        for (let booking of bookings) {
            await updateBookingHistoryStatus(booking);
        }

        bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('Hospital', 'name address email')
            .populate('Doctor', 'name specialization')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.put("/admin/:bookingId/status", async (req, res) => {
    const { status } = req.body;

    if (!['Approved', 'Rejected', 'Cancelled','Completed'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided.' });
    }

    try {
        let booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        if (booking.history === true) {
            return res.status(400).json({ msg: 'Cannot change status for a booking that is in history.' });
        }

        booking.status = status;
        if (!booking.subStatus) {
            booking.subStatus = [];
        }
        booking.subStatus.push({ date: new Date(), status: status });
        await createNotifications({userId:booking.userId,type:"appointment_update",title:"Your Appointment Status!",message:`Your appointment Status is updated by the admin.!${status}`});
        await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;