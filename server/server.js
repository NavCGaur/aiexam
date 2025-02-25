
import './config/dotenvConfig.js';

import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/db.js';
import { initializeFirebase } from './config/firebase.js';
//import autoGenerateQuestions from './utils/dataBaseActions/autoGenerateQuestions.js';
//import {insertData, updateData,copyData, deleteData, backupData } from "./utils/dataBaseActions/index.js";
//import {updateQuestionsWithHash} from './utils/dataBaseActions/updateQuestionsWithHash.js';
//import {deleteDuplicateQuestions} from './utils/dataBaseActions/deleteDuplicateQuestions.js'
//import translateAndUpdateQuestions from './utils/dataBaseActions/translateAndUpdateQuestions.js';




const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Temporarily allow all origins for webhook testing
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-webhook-signature', 'x-webhook-timestamp', 'x-webhook-version'],
}));

// Allow preflight requests
app.options('*', cors());

app.use(express.json());

// Database and Firebase initialization
connectToDatabase();
initializeFirebase();

import paperRoutes from './routes/paperRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import questionRoutes from './routes/questionRoutes.js'; 
import chatbotRoutes from './routes/chatbotRoutes.js';


// Routes
app.use('/api/papers', paperRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/questions', questionRoutes); 
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/education", questionRoutes);



//autoGenerateQuestions();

//insertData();

//updateData();

//copyData();

//deleteData();

//backupData();

//translateAndUpdateQuestions();

//updateQuestionsWithHash();

//deleteDuplicateQuestions();


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});