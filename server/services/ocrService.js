import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY
  });


  export const ocrService = async (imageBuffer) => {
    try {
      console.log("OCR Service called");
  
      const [result] = await client.textDetection(imageBuffer); // Pass buffer directly
  
      if (!result.fullTextAnnotation || !result.fullTextAnnotation.text) {
        console.error("OCR Error: No text detected.");
        return "No text detected. Please take a clearer picture and try again."; 
      }
      
      return result.fullTextAnnotation.text;
    } catch (error) {
      console.error("Google Vision API Error:", error);
      throw new Error("OCR processing failed");
    }
  };
