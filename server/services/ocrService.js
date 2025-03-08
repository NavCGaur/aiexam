import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY
  });


  export const ocrService = async (filePath) => {
    console.log("ocrService called");
  
    const [result] = await client.textDetection(filePath);
  
    // Check if OCR detected text
    if (!result.fullTextAnnotation || !result.fullTextAnnotation.text) {
      console.error("OCR Error: No text detected.");
      return "No text detected. Please take a clearer picture and try again."; 
    }
    
    return result.fullTextAnnotation.text;
  };
  
