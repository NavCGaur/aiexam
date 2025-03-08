import { SpeechClient } from '@google-cloud/speech';

// Create client once for reuse
const speechClient = new SpeechClient({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY
});

export const transcribeAudio = async (audioBuffer) => {
    console.log("Inside speech service")
  try {
    // Configure the request
    const audio = {
      content: audioBuffer.toString('base64'),
    };

    const config = {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
      model: 'default',
    };

    const request = {
      audio,
      config,
    };

    // Detects speech in the audio file
    const [response] = await speechClient.recognize(request);

    console.log("transribe result",response.results);


    // Extract transcription from response
    const transcript = response.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n');

    return transcript;
  } catch (error) {
    console.error('Google Speech-to-Text API error:', error);
    throw new Error('Failed to transcribe audio: ' + error.message);
  }
};
