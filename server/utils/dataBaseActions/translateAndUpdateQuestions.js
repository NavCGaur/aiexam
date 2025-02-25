import QuestionPaperData from '../../models/Question.js'; 
import pkg from '@google-cloud/translate';
const { v2 } = pkg;


const GOOGLE_CLOUD_API_KEY = "AIzaSyA2EgFkS09whW95PB9BS0Ngd1bxUMkk-LI";

console.log(GOOGLE_CLOUD_API_KEY);
// Initialize Google Translate API
const translate = new v2.Translate({key:GOOGLE_CLOUD_API_KEY});


async function translateText(text, targetLanguage = 'hi') {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Fallback to original text if translation fails
  }
}


const translateAndUpdateQuestions =async ()=> {
  try {

    console.log("Finding documents to translate...")

    const questions = await QuestionPaperData.find(); 

    console.log(`Found ${questions.length} documents".`);


    // Iterate through each document
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      console.log(`Processing document ${i + 1}/${questions.length} with ID: ${question._id}`);

      if (question.text_hi) {
        console.log(`Skipping document ${i + 1}/${questions.length} - translation already exists`);
        continue;
      }

      // Translate text fields
      if (question.text) {
        console.log('Translating "text"...');
        question.text_hi = await translateText(question.text);
      }

      // Translate options
      if (question.options && question.options.length > 0) {
        console.log('Translating "options"...');
        question.options_hi = await Promise.all(question.options.map(option => translateText(option)));

      }

      // Translate columnA and columnB
      if (question.columnA && question.columnA.length > 0) {
        console.log('Translating "columnA"...');
        question.columnA_hi = await Promise.all(question.columnA.map(item => translateText(item)));

      }
      if (question.columnB && question.columnB.length > 0) {
        console.log('Translating "columnB"...');
        question.columnB_hi = await Promise.all(question.columnB.map(item => translateText(item)));

      }

      // Translate assertion and reason
      if (question.assertion) {
        console.log('Translating "assertion"...');
        question.assertion_hi = await translateText(question.assertion);

      }
      if (question.reason) {
        console.log('Translating "reason"...');
        question.reason_hi = await translateText(question.reason);

      }

      // Translate case-based sub-questions
      if (question.caseDetails && question.caseDetails.subQuestions.length > 0) {
        console.log('Translating "caseDetails.subQuestions"...');
        for (const subQuestion of question.caseDetails.subQuestions) {
          if (subQuestion.text) {
            subQuestion.text_hi = await translateText(subQuestion.text);

          }
          if (subQuestion.answer) {
            subQuestion.answer_hi = await translateText(subQuestion.answer);

          }
        }
      }

      // Translate answer
      if (question.answer) {
        console.log('Translating "answer"...');
        question.answer_hi = await translateText(question.answer);
      }

      // Save the updated document
      console.log('Saving translated document...');
      await question.save();
      console.log(`Document ${i + 1}/${questions.length} saved successfully.`);

      // Add a delay to avoid hitting API rate limits (e.g., 20 second delay)
      await new Promise(resolve => setTimeout(resolve, 20000));
    }

    console.log('All documents processed and saved successfully.');
  } catch (error) {
    console.error('Error in translateAndSaveSocialScienceQuestions:', error);
  } 
}

export default translateAndUpdateQuestions
