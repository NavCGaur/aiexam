import QuestionPaperData from "../../models/Question.js"; 
import pkg from '@google-cloud/translate';
import fs from 'fs';
import {questionData} from "../../data/Questions.js"

const { v2 } = pkg;



export const insertData = async () => {
  try {
    console.log("Inserting Questions");
    
    for (const question of questionData) {
      const existingQuestion = await QuestionPaperData.findOne({ hash: question.hash });
      
      if (!existingQuestion) {
        await QuestionPaperData.insertMany([question]);
        console.log(`Question with hash ${question.hash} inserted successfully`);
      } else {
        console.log(`Question with hash ${question.hash} already exists, skipping insertion`);
      }
    }
    
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};



  export const updateData = async()=>{
    try{
      console.log("Updating Database");
  
      await QuestionPaperData.updateMany( { class: 6 },   { $set: { class: 66 } } )
  
      console.log("Database Updated");
    }
    catch (error) {
      console.error("Error Updating Data:", error);
    }
  }
  

  export const deleteData = async()=>{
    try{
      console.log("Deleting Questions");
      await QuestionPaperData.deleteMany({ "type": "fillInTheBlanks"}); 
      console.log("Questions deleted successfully");
  
  
    } catch (error) {
      console.error("Error inserting data:", error);
    }
    
  }

  export const backupData = async()=> {
    try {
      
  
      const data = await QuestionPaperData.find({});
      const filePath = `./backups/QuestionPaper140225Data.json`;
  
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Backup of QuestionPaperData saved to ${filePath}`);
      
  
      console.log('Database backup complete');
    } catch (error) {
      console.error('Error backing up database:', error);
    } 
  }
  
  export const copyData = async () => {
    try {
      console.log("Copying Data");
  
      // Find the documents with class: 66 and subject: Science
      const documents = await QuestionPaperData.find({ class: 666, subject: "Science" });
  
      if (documents.length === 0) {
        console.log("No documents found to copy");
        return;
      }
  
      // Create new documents with class: 6 and subject: Science
      const newDocuments = documents.map(doc => {
        const newDoc = { ...doc.toObject(), class: 6 }; // Change class to 6
        delete newDoc._id; // Remove the _id field to avoid conflicts
        return newDoc;
      });
  
      // Insert the new documents
      await QuestionPaperData.insertMany(newDocuments);
  
      console.log("Data Copied Successfully");
    } catch (error) {
      console.error("Error Copying Data:", error);
    }
  };



  
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
  
  
  export const translateAndUpdateQuestions =async ()=> {
    try {
  
      const questions = await QuestionPaperData.find({ subject: 'Social Science' }); 
  
      console.log(`Found ${questions.length} documents with subject "Social Science".`);
  
  
      // Iterate through each document
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        console.log(`Processing document ${i + 1}/${questions.length} with ID: ${question._id}`);
  
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
  
  
