import { formatQuestionPaperBilingual } from '../../utils/docx/formatBilingualPaper.js';
import {getAnswerpaper3} from '../../utils/docx/formatQuestionPaper3.js'
import { shuffleArray, generateUniqueId } from '../../utils/helpers.js';
import { storage, db } from '../../config/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import Paper from '../../models/PaperSchema.js';
import QuestionPaperData from '../../models/Question.js';


export const generateBilingualPaper = async (data) => {


  const {
    className,
    subject,
    difficulty,
    numQuestions,
    sections,
    chapters,
    totalMarks
  } = data;

  const paperId = generateUniqueId();

  try {
   

    const questionTypes = ["mcq", "shortAnswer", "mediumAnswer", "longAnswer", "caseBased"];

        // Assign default types if not provided
        const processedSections = sections.map((section, index) => ({
            ...section,
            type: section.type || questionTypes[index] || "mcq"
        }));

        // Fetching questions from MongoDB
        const fetchedQuestions = await QuestionPaperData.find({
            class:className,
            subject,
            chapter: { $in: chapters }
        });

        if (!fetchedQuestions || fetchedQuestions.length === 0) {
            return { error: "No questions found for the selected criteria." };
        }

        // Organizing questions by type and chapter
        const questionsByTypeAndChapter = {};

        fetchedQuestions.forEach(question => {
            if (!questionsByTypeAndChapter[question.type]) {
                questionsByTypeAndChapter[question.type] = {};
            }
            if (!questionsByTypeAndChapter[question.type][question.chapter]) {
                questionsByTypeAndChapter[question.type][question.chapter] = [];
            }
            questionsByTypeAndChapter[question.type][question.chapter].push(question);
        });

        // Structure for question paper
        const questionPaper = {};

        processedSections.forEach((section, index) => {
            const sectionKey = `section${String.fromCharCode(65 + index)}`;
            const type = section.type;
            const requiredQuestions = section.numQuestions;

            let selectedQuestions = [];

            if (questionsByTypeAndChapter[type]) {
                const chapterWiseQuestions = questionsByTypeAndChapter[type];
                const availableChapters = Object.keys(chapterWiseQuestions);

                // Step 1: Ensure at least one question per chapter
                let remainingSlots = requiredQuestions;
                availableChapters.forEach(chapter => {
                    if (remainingSlots > 0 && chapterWiseQuestions[chapter].length > 0) {
                        shuffleArray(chapterWiseQuestions[chapter]); // Randomize chapter questions
                        selectedQuestions.push(chapterWiseQuestions[chapter].pop());
                        remainingSlots--;
                    }
                });

                // Step 2: Fill remaining slots randomly from all chapters
                if (remainingSlots > 0) {
                    let allRemainingQuestions = availableChapters.flatMap(chapter => chapterWiseQuestions[chapter]);
                    shuffleArray(allRemainingQuestions); // Randomize
                    selectedQuestions.push(...allRemainingQuestions.slice(0, remainingSlots));
                }
            }

            questionPaper[sectionKey] = selectedQuestions;
        });

    // Format the question paper
    const title = `P. M SHRI KENDRIYA VIDYALAYA SAURKHAND\n\nPERIODIC TEST 2\n\nSUBJECT- ${subject.toUpperCase()}\n\nCLASS - ${className}`;
    const instructions = [
      `Time: 1 hour 30 minutes`,
      `Maximum Marks: ${totalMarks}`,
      "All questions are compulsory."
    ];

    const buffer = await formatQuestionPaperBilingual(title, instructions, 
      processedSections.map((section, index) => ({
          title: `SECTION ${String.fromCharCode(65 + index)} (${section.markPerQuestion} Mark Each)`,
          questions: questionPaper[`section${String.fromCharCode(65 + index)}`]
      })), 
      paperId,
    );    


    // Upload the file to Firebase Storage
    const fileName = `QuestionPaper_Class${className}_${subject}_${paperId}.docx`;
    const storageRef = ref(storage, `questionPapers/${fileName}`);
    const metadata = { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };

    await uploadBytes(storageRef, buffer, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    // Save metadata in Firestore
    const paperRef = doc(db, 'questionPapers', `${className}-${subject}-${paperId}`);
    await setDoc(paperRef, {
      paperId,
      className,
      subject,
      difficulty,
      numQuestions,
      questionPaperUrl: downloadURL,
      createdAt: new Date().toISOString(),
    });

    const answerPaper = await getAnswerpaper3(title, instructions, 
      processedSections.map((section, index) => ({
          title: `SECTION ${String.fromCharCode(65 + index)} (${section.markPerQuestion} Mark Each)`,
          questions: questionPaper[`section${String.fromCharCode(65 + index)}`]
      }))
    );

      // Upload the file to Firebase Storage
      const answerFileName = `AnswerPaper_Class${className}_${subject}_${paperId}.docx`;
      const answerStorageRef = ref(storage, `questionPapers/${answerFileName}`);
      const answerMetadata = { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  
      await uploadBytes(answerStorageRef, answerPaper, answerMetadata);
      const answerDownloadURL = await getDownloadURL(answerStorageRef);
  
      // Save metadata in Firestore
      const answerPaperRef = doc(db, 'answerPapers', `${className}-${subject}-${paperId}`);
      await setDoc(answerPaperRef, {
        paperId,
        className,
        subject,
        difficulty,
        numQuestions,
        answerDownloadURL,
        createdAt: new Date().toISOString(),
      });




      const newPaper = new Paper({
        paperId,
        className,
        subject,
        difficulty,
        numQuestions,
        bilingual: true,
        questionPaperUrl: downloadURL,
        answerPaperUrl: answerDownloadURL,
        paymentStatus: 'PENDING',  // Default to pending until user pays
      });
      
      await newPaper.save();


    return{ filePathQuestion: downloadURL ,  filePathAnswer: answerDownloadURL, paperId };

  } catch (error) {
    console.error('Error:', error.message);
    return{ error: error.message };
  }};

  
