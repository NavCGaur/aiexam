import mongoose from 'mongoose';

const PaperSchema = new mongoose.Schema({
  paperId: { type: String, required: true, unique: true },
  className: { type: String, required: true },
  subject: { type: String, required: true },
  difficulty: { type: String },
  numQuestions: { type: Number },
  questionPaperUrl: { type: String, required: true },
  answerPaperUrl: { type: String, required: true },

  // Payment and Order Details
  paymentStatus: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
  orderId: { type: String },  // Store order ID from payment gateway
  orderStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  paymentSessionId: { type: String },  // Store session ID from Cashfree
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Paper', PaperSchema);
