import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setExpertise } from "../../state/chatbotSlice";

import './chatbot.css'

const EXPERTISE_LEVELS = [
  { id: "Beginner", label: "🌱 Starter (Class 5-9)" },
  { id: "Explorer", label: "🚀 Explorer  (Class 10-12)" },
  { id: "Expert", label: "🎓 Expert (Grad and Up)" },
];

const MessageBubble = ({ text = "", sender  }) => {
  const expertise = useSelector((state) => state.chatbot.expertise);
  const dispatch = useDispatch();

  const formatMessage = (text) => {
    return text.split("\n").map((line, index) => (
      <p key={index} style={{ margin: "18px 0" }}>{line}</p>
    ));
  };

  const handleExpertiseSelect = (level) => {
    dispatch(setExpertise(level)); // Update expertise in Redux
  };

  // For welcome message special handling
  const isWelcomeMessage = sender === "bot" && text.includes("Hey Champ!");

  return (
    <div className={`message-bubble message-bubble--${sender}`}>
      {/* Render message text */}
      {formatMessage(text)}
      
      {/* Expertise selection buttons (only for welcome message) */}
      {isWelcomeMessage && !expertise && (
        <div className="doubt-solver__options">
          {EXPERTISE_LEVELS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleExpertiseSelect(id)}
              className="doubt-solver__button"
            >
              {label}
            </button>
          ))}
        </div>
      )}
      
      {/* Prompt after expertise selection */}
      {isWelcomeMessage && expertise && <>
        <p style={{marginTop:".5rem"}}>{expertise} selected! </p>
        <p style={{marginTop:"1.5rem"}}>Type, speak, or scan your doubt!</p>
        </>

        }
       
    </div>
  );
};



export default MessageBubble;
