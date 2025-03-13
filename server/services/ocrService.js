import { ImageAnnotatorClient } from '@google-cloud/vision';


const client = new ImageAnnotatorClient({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY
  });


  export const ocrService = async (fileBuffer) => {
    const startTime = Date.now();
    
    try {
      
      const [result] = await client.textDetection({
        image: { content: fileBuffer }
      });
      
      if (!result || !result.fullTextAnnotation || !result.fullTextAnnotation.text) {
        return "No text detected. Please try taking image again.";
      }
      
      return result.fullTextAnnotation.text;
    } catch (error) {
      console.error("Vision API Error:", error);
      throw error;
    }
  };
  
  