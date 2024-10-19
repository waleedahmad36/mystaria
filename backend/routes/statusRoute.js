import { createStatus, getStatuses, trackStatusView , getStatusById} from '../controllers/statusController.js';
import protectRoute from '../middlewares/protectRoute.js';
import multer from 'multer';
import express from 'express';

const router = express.Router();
const upload = multer(); // Initialize multer middleware

// Routes for status
router.post('/', protectRoute, upload.fields([{ name: 'image' }, { name: 'video' }]), createStatus); // Route to create status
router.get('/', protectRoute, getStatuses); // Route to fetch statuses
router.post('/view/:statusId', protectRoute, trackStatusView ); // Route to track status views
router.get('/:statusId', protectRoute, getStatusById ); // Route to track status views

export default router;
