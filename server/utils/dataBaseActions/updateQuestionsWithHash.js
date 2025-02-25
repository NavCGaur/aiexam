import crypto from 'crypto';
import Question from '../../models/Question.js'; 

// Function to generate a hash
const generateHash = (input) => {
  return crypto.createHash('sha256').update(input).digest('hex');
};

// Function to generate hash for each question type
export const getHashInput = (question) => {
  const { class: cls, subject, chapter, type } = question;

  if (!type) {
    console.error('Question has missing or undefined type:', question._id);
    throw new Error(`Question has missing or undefined type: ${question._id}`);
  }

  let input = `${cls}|${subject}|${chapter}|${type}|`;

  switch (type) {
    case 'mcq':
      input += `${question.text}|${question.options.join(',')}`;
      break;
    case 'fillInTheBlanks':
      input += question.text;
      break;
    case 'assertionReason':
      input += `${question.assertion}|${question.reason}`;
      break;
    case 'shortAnswer':
    case 'mediumAnswer':
    case 'longAnswer':
      input += question.text;
      break;
    case 'matchTheFollowing':
      input += `${question.columnA.join(',')}|${question.columnB.join(',')}`;
      break;
    case 'caseBased':
      input += question.caseDetails.subQuestions.map((q) => q.text).join('|');
      break;
    default:
      throw new Error(`Unknown question type: ${type}`);
  }

  return input;
};

// Function to update all questions with hash
export const updateQuestionsWithHash = async () => {
  try {
    const questions = await Question.find({});

    for (const question of questions) {
      const hashInput = getHashInput(question);
      const hash = generateHash(hashInput);

      if (!question.hash) {
        // Update the question with the hash
        question.hash = hash;
        await question.save();
      }

    }

    console.log('All questions updated with hash.');
  } catch (error) {
    console.error('Error updating questions with hash:', error);
  }
};

