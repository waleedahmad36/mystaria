// routes.js
import express from 'express';
import { createCode, getCodes, updateCode } from '../models/codeModel.js';

const router = express.Router();

router.post('/', createCode);
router.get('/', getCodes);
router.put('/:id', updateCode);

export default router;
