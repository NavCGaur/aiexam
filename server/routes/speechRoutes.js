import express from 'express';
import multer from 'multer';
import { transcribeAudio } from '../controllers/speechController.js';

const router = express.Router();

// Configure multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Speech-to-text route
router.post('/transcribe', upload.single('audio'), transcribeAudio);


export default router;
