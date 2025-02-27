import React, { useState } from "react";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import "./chatbot.css";
import MainCameraModal from "./MainCameraModal";


const InputBox = ({ handleSend, isProcessing }) => {
  const [input, setInput] = useState("");
  const [showCamera, setShowCamera] = useState(false);


  const handleUserInput = () => {
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
        className="input-box__camera"
        onClick={() => setShowCamera(true)}
        disabled={isProcessing}
      >
        <CameraIcon className="custom-camera-icon"/>
      </button>
      <button 
        className="input-box__send" 
        onClick={handleUserInput}
        disabled={isProcessing}
      >
        <SendIcon />
      </button>

      {showCamera && (
        <MainCameraModal onClose={() => setShowCamera(false)} />
      )}

    </div>
  );
};


export default InputBox;