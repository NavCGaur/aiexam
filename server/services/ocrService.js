import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY
  });
export const ocrService = async (filePath) => {
    console.log("ocrService called");
  const [result] = await client.textDetection(filePath);
  return result.fullTextAnnotation.text;
};
