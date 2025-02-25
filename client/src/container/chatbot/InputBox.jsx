import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import "./chatbot.css";


const InputBox = ({ handleSend, isProcessing }) => {
  const [input, setInput] = useState("");

  const handleUserInput = () => {
    console.log(input)
    handleSend(input, input);
    setInput(""); // Clear input after sending
  };

  return (
    <div className="input-box">
      <input
        className="input-box__input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleUserInput()}
        placeholder="Type a message..."
        disabled={isProcessing}
      />
      <button 
        className="input-box__send" 
        onClick={handleUserInput}
        disabled={isProcessing}
      >
        <SendIcon />
      </button>
    </div>
  );
};


export default InputBox;