import QuestionPaperData from '../models/Question.js';

export const getQuestionSummaryService = async () => {
  try {
    
    const summary = await QuestionPaperData.aggregate([
      {
        $group: {
          _id: { class: "$class", subject: "$subject", chapter: "$chapter", type: "$type" },
          count: { $sum: 1 } // Summing the count of each question type
        }
      },
      {
        $group: {
          _id: { class: "$_id.class", subject: "$_id.subject", chapter: "$_id.chapter" },
          questionTypes: {
            $push: { type: "$_id.type", count: "$count" } // Pushing type & summed count
          }
        }
      },
      {
        $project: {
          _id: 1,
          questionTypes: 1
        }
      }
    ]);


    return summary;
  } catch (error) {
    throw new Error(`Error fetching question summary: ${error.message}`);
  }
};


export const getEduDataService = async () => {
  try {

    console.log(" inside getEduData service");

    // Fetch all questions from the database
    const questions = await QuestionPaperData.find({});
    

    // Initialize the allData object
    const allData = {
      classes: [],
      subjects: {},
      chapters: {},
    };

    // Helper function to add unique values to an array
    const addUnique = (array, value) => {
      if (!array.includes(value)) {
        array.push(value);
      }
    };

    // Iterate through all questions and populate allData
    questions.forEach((question) => {
      const { class: className, subject, chapter } = question;

      // Add class to classes array if not already present
      addUnique(allData.classes, className.toString());

      // Initialize subjects for the class if not already present
      if (!allData.subjects[className]) {
        allData.subjects[className] = [];
      }

      // Add subject to subjects array if not already present
      addUnique(allData.subjects[className], subject);

      // Initialize chapters for the class and subject if not already present
      if (!allData.chapters[className]) {
        allData.chapters[className] = {};
      }
      if (!allData.chapters[className][subject]) {
        allData.chapters[className][subject] = [];
      }

      // Add chapter to chapters array if not already present
      addUnique(allData.chapters[className][subject], chapter);
    });

    // Sort classes, subjects, and chapters for consistency
    allData.classes.sort((a, b) => a - b);
    for (const className in allData.subjects) {
      allData.subjects[className].sort();
    }
    for (const className in allData.chapters) {
      for (const subject in allData.chapters[className]) {
        allData.chapters[className][subject].sort();
      }
    }
    console.log("allData", allData);

    return allData;
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw error;
  }
};