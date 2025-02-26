import { ocrService } from '../services/ocrService.js';

export const upload = async (req, res) => {
  try {
    console.log("Inside ocr contoller");
    const extractedText = await ocrService(req.file.path);
    res.json({ text: extractedText });
  } catch (error) {
    res.status(500).json({ error: 'OCR processing failed' });
  }
};
