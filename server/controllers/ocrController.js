import { ocrService } from "../services/ocrService.js";

export const upload = async (req, res) => {
  const startTime = Date.now();
  console.log("OCR Controller Start:", new Date().toISOString());
  
  try {
    console.log("Request headers:", JSON.stringify(req.headers));
    console.log("File received:", req.file ? 
      `Name: ${req.file.originalname}, Size: ${req.file.size} bytes, Type: ${req.file.mimetype}` : 
      "No file");
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    console.log("Before OCR service call:", Date.now() - startTime, "ms");
    
    const extractedText = await ocrService(req.file.buffer);
    
    console.log("After OCR service call:", Date.now() - startTime, "ms");
    console.log("OCR Text length:", extractedText.length);
    
    res.json({ text: extractedText });
    console.log("Response sent:", Date.now() - startTime, "ms");
  } catch (error) {
    console.error("OCR Error:", error);
    console.error("Error occurred after:", Date.now() - startTime, "ms");
    res.status(500).json({ error: "OCR processing failed", details: error.message });
  }
};
