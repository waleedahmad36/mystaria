import express from 'express';
import { deleteAllNotifications, deleteNotification, getNotifications, markNotificationAsRead } from '../controllers/NotificationController.js';  


const router = express.Router();

// Route to get notifications for the logged-in user
router.get('/',  getNotifications);
router.post("/read", markNotificationAsRead); // Mark a notification as read
router.delete("/:notificationId", deleteNotification); // Delete a single notification
router.delete("/", deleteAllNotifications);


export default router;
