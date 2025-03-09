import { Router } from 'express';
import multer from 'multer';
import { upload } from '../controllers/ocrController.js';

const router = Router();

// Use memory storage instead of writing to /tmp
const uploadMiddleware = multer({ storage: multer.memoryStorage() });

router.post('/', uploadMiddleware.single('image'), upload);

export default router;
