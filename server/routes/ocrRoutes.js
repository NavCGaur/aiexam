import { Router } from 'express';
import { upload } from '../controllers/ocrController.js';
import multer from 'multer';

const router = Router();
const uploadMiddleware = multer({ dest: 'uploads/' });

router.post('/', uploadMiddleware.single('image'), upload);

export default router;
