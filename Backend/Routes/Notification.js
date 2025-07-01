const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');


const getNotifications = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { userId: userId };

        if (req.query.isRead !== undefined) {
            query.isRead = req.query.isRead === 'true';
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalNotifications = await Notification.countDocuments(query);

        res.status(200).json({
            notifications,
            totalNotifications,
            currentPage: page,
            totalPages: Math.ceil(totalNotifications / limit),
            hasMore: (skip + notifications.length) < totalNotifications
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.user.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId: userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found or unauthorized" });
        }

        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Error marking notification as read", error: error.message });
    }
};

const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const result = await Notification.updateMany(
            { userId: userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ message: `${result.modifiedCount} notifications marked as read.` });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({ message: "Error marking all notifications as read", error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.user.id;

        const notification = await Notification.findOneAndDelete({ _id: id, userId: userId });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found or unauthorized" });
        }

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Error deleting notification", error: error.message });
    }
};

router.get("/", getNotifications);
router.put("/:id/read", markNotificationAsRead);
router.put("/mark-all-read", markAllNotificationsAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;
