import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleChatbot } from "../../state/chatbotSlice";
import ChatIcon from "@mui/icons-material/Chat";
import "./chatbot.css";

const ChatbotWidget = () => {
  const dispatch = useDispatch();
  const isChatbotOpen = useSelector((state) => state.chatbot.isOpen);

  return (
    <div className="chatbot-widget">
      {!isChatbotOpen && (
        <button className="chatbot-widget__button" onClick={() => dispatch(toggleChatbot())}>
          <ChatIcon fontSize="large" />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
