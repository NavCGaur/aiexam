import { ImageAnnotatorClient } from '@google-cloud/vision';

console.log("Initializing Vision API client with key:", 
  process.env.GOOGLE_CLOUD_API_KEY ? 
  `${process.env.GOOGLE_CLOUD_API_KEY.substring(0, 5)}...` : 
  "API key not found");

const client = new ImageAnnotatorClient({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY
  });


  export const ocrService = async (fileBuffer) => {
    const startTime = Date.now();
    console.log("OCR Service Start:", new Date().toISOString());
    
    try {
      console.log("Buffer size:", fileBuffer.length, "bytes");
      
      console.log("Before Vision API call:", Date.now() - startTime, "ms");
      const [result] = await client.textDetection({
        image: { content: fileBuffer }
      });
      console.log("After Vision API call:", Date.now() - startTime, "ms");
      
      if (!result || !result.fullTextAnnotation || !result.fullTextAnnotation.text) {
        console.log("No text detected");
        return "No text detected. Please try another image.";
      }
      
      console.log("Full text annotation received:", Date.now() - startTime, "ms");
      return result.fullTextAnnotation.text;
    } catch (error) {
      console.error("Vision API Error:", error);
      throw error;
    }
  };
  
  