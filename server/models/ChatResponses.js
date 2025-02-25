import mongoose from 'mongoose';

const chatResponseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userMessage: {
    type: String,
    required: true
  },
  aiResponse: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  context: {
    type: mongoose.Schema.Types.Mixed, // Flexible schema for storing any additional context
    default: {}
  }
});

const ChatResponse = mongoose.model('ChatResponse', chatResponseSchema);


export default ChatResponse;