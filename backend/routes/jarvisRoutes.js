import express from 'express';
import {
 createJarvisEntry, getJarvisDetails , updateJarvisDetails
} from '../controllers/jarvisController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

// Routes
router.post('/',protectRoute, createJarvisEntry);
router.post('/get', protectRoute, getJarvisDetails);
router.put('/',protectRoute ,updateJarvisDetails);


export default router;
