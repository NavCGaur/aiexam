import { transcribeAudio as transcribe} from '../services/speechService.js';

export const transcribeAudio = async (req, res) => {

    console.log("inside speech controller")
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const transcript = await transcribe(req.file.buffer);

    return res.status(200).json({
      success: true,
      transcript,
    });
  } catch (error) {
    console.error('Speech transcription error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to transcribe audio',
    });
  }
};
