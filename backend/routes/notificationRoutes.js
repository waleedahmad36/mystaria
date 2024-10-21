import express from 'express';
import { deleteAllNotifications, deleteNotification, getNotifications, markNotificationAsRead } from '../controllers/NotificationController.js';  


const router = express.Router();

router.get('/',  getNotifications);
router.post("/read", markNotificationAsRead); 
router.delete("/:notificationId", deleteNotification); 
router.delete("/", deleteAllNotifications);


export default router;
