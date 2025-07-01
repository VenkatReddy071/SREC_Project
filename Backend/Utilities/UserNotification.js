const Notification = require("../models/Notification");

async function createNotifications({
  userId,
  type,
  title,
  message,
  link = "",
}) {
    console.log(userId);
  try {
    if (!userId) throw new Error("userId is required");


    const notificationsToCreate = ({
      userId,
      type,
      title,
      message,
      link,
    });

    const savedNotifications = await Notification.insertMany(notificationsToCreate);

    return savedNotifications;
  } catch (error) {
    console.error("Error creating notifications:", error);
    throw error;
  }
}

module.exports = createNotifications;
