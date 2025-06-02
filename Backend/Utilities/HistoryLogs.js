const HistoryLog = require("../models/HistoryLogs/historyLogs");

async function historyLogRecorder(req, entityType, action,method, entityId, description) {
  try {
    console.log(req.session.user)
    const userId = req.user ? req.user.id : req.session?.user?.email;
    const ipAddress = req.ip || (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    if (!userId) {
      console.warn("No user found in request object; skipping history log.");
      return;
    }

    const logEntry = new HistoryLog({
      email:userId,
      entityType,
      action,
      method,
      entityId,
      description,
      ipAddress,
    });

    await logEntry.save();
    console.log("History log recorded successfully.");
  } catch (error) {
    console.error("Failed to record history log:", error);
  }
}

module.exports = historyLogRecorder;
