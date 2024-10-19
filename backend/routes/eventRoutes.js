import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.post('/',protectRoute, createEvent); // Create a new event
router.get('/',protectRoute, getEvents);    // Get all events
router.get('/:id',protectRoute, getEventById); // Get a single event by ID
router.put('/:id',protectRoute, updateEvent); // Update an event by ID
router.delete('/:id',protectRoute, deleteEvent); // Delete an event by ID

export default router;
