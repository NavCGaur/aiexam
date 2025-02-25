import express from 'express';
import { getQuestionSummary } from '../controllers/questionController.js';
import { getEduData } from '../controllers/questionController.js';

const router = express.Router();

// Route to get question summary
router.get('/summary', getQuestionSummary);
router.get('/data', getEduData);

export default router;