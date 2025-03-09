import { ocrService } from "../services/ocrService.js";

export const upload = async (req, res) => {
  const startTime = Date.now();
  
  try {
   
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    
    const extractedText = await ocrService(req.file.buffer);
    

    res.json({ text: extractedText });
  } catch (error) {
    console.error("OCR Error:", error);
    res.status(500).json({ error: "OCR processing failed", details: error.message });
  }
};
