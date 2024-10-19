import express from 'express';
import {
  createComplain,
  getComplains,
  markComplainAsFulfilled,
} from '../controllers/cmplainController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.post('/',protectRoute, createComplain);
router.get('/',protectRoute, getComplains);
router.put('/:id/fulfill',protectRoute, markComplainAsFulfilled);

export default router;
