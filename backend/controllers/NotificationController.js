import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
	try {
		// Get user ID from the request body or query parameters
		const userId = req.body.userId || req.query.userId;

		// Ensure userId is provided
		if (!userId) {
			return res.status(400).json({ error: "User ID is required" });
		}

		// Fetch only unread notifications
		const notifications = await Notification.find({
			receiver: userId,
			read: false // Filter to get only unread notifications
		})
		.populate('sender', 'username profilePic') // Populate sender details including profilePic
		.sort({ createdAt: -1 }); // Sort by latest first

		res.status(200).json(notifications);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};



export const markNotificationAsRead = async (req, res) => {
	try {
		// Get notification ID from request body
		const { notificationId } = req.body;

		// Ensure notification ID is provided
		if (!notificationId) {
			return res.status(400).json({ error: "Notification ID is required" });
		}

		// Find and update the notification to set it as read
		const updatedNotification = await Notification.findByIdAndUpdate(
			notificationId,
			{ read: true },
			{ new: true }
		);

		// If the notification is not found, return an error
		if (!updatedNotification) {
			return res.status(404).json({ error: "Notification not found" });
		}

		// Return the updated notification
		res.status(200).json(updatedNotification);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};


export const deleteNotification = async (req, res) => {
	try {
		// Get notification ID from request params
		const { notificationId } = req.params;

		// Ensure notification ID is provided
		if (!notificationId) {
			return res.status(400).json({ error: "Notification ID is required" });
		}

		// Find and delete the notification
		const deletedNotification = await Notification.findByIdAndDelete(notificationId);

		// If the notification is not found, return an error
		if (!deletedNotification) {
			return res.status(404).json({ error: "Notification not found" });
		}

		// Return a success message
		res.status(200).json({ message: "Notification deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};



export const deleteAllNotifications = async (req, res) => {
	try {

		const userId = req.body.userId || req.query.userId;

		if (!userId) {
			return res.status(400).json({ error: "User ID is required" });
		}

		const deletedNotifications = await Notification.deleteMany({ receiver: userId });

		res.status(200).json({ message: `${deletedNotifications.deletedCount} notifications deleted successfully` });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

