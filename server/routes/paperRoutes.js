import express from 'express';
import {
  generatePaper,
  generatePaper3,
  generateBilingualPaper,
  validatePaper,
  getQuestionSummary,
} from '../controllers/paperControllers.js';

const router = express.Router();

router.post('/generate', generatePaper);
router.post('/generate3', generatePaper3);
router.post('/generate-bilingual', generateBilingualPaper);
router.get('/validate/:paperId', validatePaper);
router.get('/question-summary', getQuestionSummary);

export default router;