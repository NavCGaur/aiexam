import { getChatbotResponse } from "../services/chatbotService.js";
import Question from "../models/Question.js";
import generateDoubtPrompt from "../prompts/generateDoubtPrompt.js"
import ChatResponse from "../models/ChatResponses.js";

// In-memory context store (can be replaced with Redis or a DB for persistence)
let userContexts = {};

export const processChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const messages = message?.messages;
    const userId = message?.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "Messages array cannot be empty" });
    }

    let latestMessage = messages[messages.length - 1]?.text;
    console.log("latestMessage",latestMessage);
    
    const questionVariables = extractVariables(latestMessage);


    // Check if this is a question generation request
    const isQuestionGeneration = latestMessage.toLowerCase().includes("generate") && 
                                 latestMessage.toLowerCase().includes("question");

    const isDoubtSolving =  latestMessage.toLowerCase().includes("explain") && 
    latestMessage.toLowerCase().includes("doubt");


    if (!latestMessage || latestMessage.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }



      // Only check MongoDB if this is a question generation request and has required fields
      if (isQuestionGeneration && questionVariables.class && questionVariables.subject) {

        console.log("inside mongodb")
        try {
          // Query MongoDB for existing questions
          const existingQuestions = await Question.find({
            class: questionVariables.class,
            subject: questionVariables.subject,
            ...(questionVariables.chapter && { chapter: questionVariables.chapter }),
            ...(questionVariables.type && { type: questionVariables.type })
          });
  
          // If questions exist, return them immediately
          if (existingQuestions && existingQuestions.length > 0) {
            // Format the response similar to AI response
            const formattedResponse = existingQuestions.map((q, index) => 
              `Question ${index + 1}: ${q.question}\n${q.options ? 
                `Options:\n${q.options.map((opt, i) => `${String.fromCharCode(97 + i)}) ${opt}`).join('\n')}\n` : 
                ''}`
            ).join('\n\n');
  
            return res.json({ reply: formattedResponse });
          }
        } catch (dbError) {
          console.error("MongoDB Query Error:", dbError);
          // Continue with ChatGPT if DB query fails
        }
      }

      if (isDoubtSolving && questionVariables.language && questionVariables.expertise) {

        latestMessage = generateDoubtPrompt(questionVariables.language, questionVariables.expertise, questionVariables.doubt)
      }
  

    // Initialize or get user context
    if (!userContexts[userId]) {
      userContexts[userId] = {
        conversationHistory: [],
        lastInteraction: null,
        questionContext: null
      };
    }

    // Format the conversation history as an array of message objects
    const formattedMessages = [
      {
        role: "system",
        content: "You are a helpful teacher assisting with generating educational questions, providing answers. Maintain context of the ongoing conversation and previous questions/answers discussed. Tone should be encouraging, friendly. From now on, structure all responses in a **clear bullet-point format** for easy understanding.  "
      },
      ...userContexts[userId].conversationHistory,
      {
        role: "user",
        content: latestMessage
      }
    ];

    console.log("formattedMessages:",formattedMessages);

    // Get AI response with proper message formatting
    const responseText = await getChatbotResponse(formattedMessages);

    // Update conversation history
    userContexts[userId].conversationHistory.push(
      { role: "user", content: latestMessage },
      { role: "assistant", content: responseText }
    );

    // Store question context if relevant
    if (latestMessage.toLowerCase().includes("generate") && latestMessage.toLowerCase().includes("question")) {
      userContexts[userId].questionContext = {
        lastQuestions: responseText,
        answersProvided: false
      };
    }

    userContexts[userId].lastInteraction = new Date();
    cleanupOldContexts();


    const chatResponse = new ChatResponse({
      userId: userId,
      userMessage: latestMessage,
      aiResponse: responseText,
      context: {
        isQuestionGeneration: isQuestionGeneration,
        isDoubtSolving: isDoubtSolving,
        questionVariables: questionVariables
      }
    });
    console.log("chatResponse:",chatResponse)


    await chatResponse.save();

    res.json({ reply: responseText });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper function to clean up old contexts
const cleanupOldContexts = () => {
  const MAX_CONTEXT_AGE = 30 * 60 * 1000; // 30 minutes
  const now = new Date();
  
  Object.keys(userContexts).forEach(userId => {
    if (now - userContexts[userId].lastInteraction > MAX_CONTEXT_AGE) {
      delete userContexts[userId];
    }
  });
};

const extractVariables = (inputString) => {
  const regex = /(\w+):\s*([^,\.]+)(?:[,\.]|$)/g;
  const matches = {};
  let match;

  while ((match = regex.exec(inputString))) {
    const key = match[1].toLowerCase();
    const value = match[2].trim();
    matches[key] = value;
  }

  

  return matches;
};

