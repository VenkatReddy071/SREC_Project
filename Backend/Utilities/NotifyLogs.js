const Notification = require("../models/Notifications/Notify");

async function createNotifications({
  userId,
  dashboardType,
  type,
  title,
  message,
  link = "",
}) {
    console.log(userId)
  try {
    if (!userId) throw new Error("userId is required");

    const dashboardTypes = Array.isArray(dashboardType) ? dashboardType : [dashboardType];

    const notificationsToCreate = dashboardTypes.map(dbType => ({
      userId,
      dashboardType: dbType,
      type,
      title,
      message,
      link,
    }));

    const savedNotifications = await Notification.insertMany(notificationsToCreate);

    return savedNotifications;
  } catch (error) {
    console.error("Error creating notifications:", error);
    throw error;
  }
}

module.exports = createNotifications;
