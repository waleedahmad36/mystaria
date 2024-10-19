import express from 'express';
import {
  createReport,
  getReports,
  markReportAsFulfilled,
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/', createReport);
router.get('/', getReports);
router.put('/:id/fulfill', markReportAsFulfilled);

export default router;
