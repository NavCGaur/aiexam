import { ocrService } from "../services/ocrService.js";

export const upload = async (req, res) => {
  try {
    console.log("Inside OCR Controller");
    console.log("Uploaded file:", req.file); // Debug: Log file info

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Pass the file buffer instead of file path
    const extractedText = await ocrService(req.file.buffer);

    res.json({ text: extractedText });
  } catch (error) {
    console.error("OCR Error:", error);
    res.status(500).json({ error: "OCR processing failed", details: error.message });
  }
};
