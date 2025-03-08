import { Router } from 'express';
import { upload } from '../controllers/ocrController.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// Use the /tmp directory for file uploads in Vercel
const uploadMiddleware = multer({ 
  dest: path.join('/tmp', 'uploads')
});

console.log("inside ocr Routes");

router.post('/', uploadMiddleware.single('image'), upload);

export default router;