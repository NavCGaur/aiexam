import express from "express";
import { processChatMessage } from "../controllers/chatbotController.js";

const router = express.Router();

// POST request to handle chatbot messages
router.post("/", processChatMessage);

export default router;
