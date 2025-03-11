import { SpeechClient } from '@google-cloud/speech';

// Create client once for reuse
const speechClient = new SpeechClient({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY
});

export const transcribeAudio = async (audioBuffer) => {
    console.log("Inside speech service")
    try {
        // Ensure audioBuffer is not empty
        if (!audioBuffer || audioBuffer.length === 0) {
          throw new Error("Audio buffer is empty");
        }
    
        console.log("Audio Buffer Length:", audioBuffer.length);

        console.log("Audio Buffer (First 20 Bytes):", audioBuffer.slice(0, 20));

        
        // Convert audio to Base64
        const audio = {
          content: Buffer.from(audioBuffer).toString('base64'),
        };
    
        // Correct encoding & settings
        const config = {
          encoding: 'WEBM_OPUS',   // 
          sampleRateHertz: null,
          languageCode: 'en-IN',
          enableAutomaticPunctuation: true,
          model: 'default',
          useEnhanced: true, 

        };
    
        const request = { audio, config };
    
        // Call Google Speech-to-Text API
        const [response] = await speechClient.recognize(request);
    
        console.log("Transcribe result:", response.results);
    
        if (!response.results || response.results.length === 0) {
          console.warn("No words detected in audio.");
          return "Couldn't recognize any words. Please speak clearly.";
      }
    
        // Extract transcription
        const transcript = response.results
          .map(result => result.alternatives[0]?.transcript || "")
          .join("\n");
    
          return transcript || "Couldn't recognize any words. Please try again.";
          
        } catch (error) {
    console.error('Google Speech-to-Text API error:', error);
    throw new Error('Failed to transcribe audio: ' + error.message);
  }
};
