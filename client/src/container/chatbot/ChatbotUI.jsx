import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleChatbot, addMessage, setTyping, setUserId } from "../../state/chatbotSlice";
import CloseIcon from "@mui/icons-material/Close";
import ChatWindow from "./ChatWindow";
import InputBox from "./InputBox";
import { useSendMessageMutation } from "../../state/chatbotApi";
import ThemeToggleIcon from './ThemeToggleIcon'; 


import "./chatbot.css";

const ChatbotUI = () => {
  const dispatch = useDispatch();
  const isChatbotOpen = useSelector((state) => state.chatbot.isOpen);
  const messages = useSelector((state) => state.chatbot.messages);
  const userId = useSelector((state) => state.chatbot.userId);
  const [sendMessage] = useSendMessageMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState('dark'); // Default theme is dark

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (!userId) {
      const newUserId = 'user_' + Math.random().toString(36).slice(2, 11);
      dispatch(setUserId(newUserId));
    }
  }, [userId, dispatch]);

  const handleSend = async (fullMessage, displayMessage) => {
    if (!fullMessage.trim()) return;

    dispatch(addMessage({ text: displayMessage, sender: "user" }));
    setIsProcessing(true);
    dispatch(setTyping(true));

    try {
      const response = await sendMessage({
        userId,
        messages: [...messages, { text: fullMessage, sender: "user" }]
      }).unwrap();

      dispatch(addMessage({ text: response.reply, sender: "bot" }));
    } catch (error) {
      console.error("Chatbot API Error:", error);
      dispatch(addMessage({ text: "Error: Unable to get response.", sender: "bot" }));
    } finally {
      dispatch(setTyping(false));
      setIsProcessing(false);
    }
  };

  if (!isChatbotOpen) return null;

  return (
    <div className={`chatbot-ui ${theme}`}>
      <div className="chatbot-ui__header">
        <span>AI Tutor</span>
        <div className="chatbot-ui__actions">
          <ThemeToggleIcon onClick={toggleTheme} />
          <CloseIcon className="chatbot-ui__close" onClick={() => dispatch(toggleChatbot())} />
        </div>
      </div>
      <ChatWindow handleSend={handleSend} />
      <InputBox handleSend={handleSend} isProcessing={isProcessing} />
    </div>
  );
};

export default ChatbotUI;
