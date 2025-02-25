import mongoose from 'mongoose';

const { Schema } = mongoose;

const QuestionSchema = new Schema({
  class: { type: Number, required: true }, // Class level (5-12)
  subject: { type: String, required: true }, // Subject name (e.g., Biology)
  subSubject: { type: String },
  chapter: { type: String, required: true }, // Chapter name
  type: { 
    type: String, 
    enum: ['mcq', 'shortAnswer', 'mediumAnswer', 'longAnswer', 'caseBased', 'assertionReason', 'imageBased', 'fillInTheBlanks', 'matchTheFollowing'], 
    required: true 
  },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true }, // Difficulty level

  // English Question Text
  text: { type: String },

  // Hindi Question Text
  text_hi: { type: String },  // Added field for Hindi translation

  // MCQ Options (if applicable)
  options: [{ type: String }], 
  options_hi: [{ type: String }],  // Hindi options

  marks: { type: Number, required: true }, // Marks assigned

  columnA: [{ type: String }], // List of terms to match
  columnA_hi: [{ type: String }], // Hindi terms
  columnB: [{ type: String }], // List of corresponding answers
  columnB_hi: [{ type: String }], // Hindi answers

  // Assertion-Reason Type
  assertion: { type: String },
  assertion_hi: { type: String },  // Hindi Assertion
  reason: { type: String },
  reason_hi: { type: String },  // Hindi Reason
  correctAnswer: { type: String, enum: ['A', 'B', 'C', 'D'] }, // Correct answer

  // Case-Based Questions
  caseDetails: {  
    subQuestions: [
      {
        text: { type: String },  // English sub-question
        text_hi: { type: String },  // Hindi sub-question
        marks: { type: Number },
        answer: { type: String, required: true },  // English Answer
        answer_hi: { type: String },  // Hindi Answer
      },
    ],
  },

  // Image-Based Questions
  imageUrl: { type: String }, // URL of the image (stored in Firebase or another cloud storage)

  // Answer Section
  answer: { type: String }, // Detailed English answer
  answer_hi: { type: String }, // Hindi translation of the answer

  hash: { type: String, unique: true },


  createdAt: { type: Date, default: Date.now }, // Timestamp
});

export default mongoose.model('QuestionPaperData', QuestionSchema);
