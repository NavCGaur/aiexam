  import React, {useState} from "react";
  import QuestionGenerator from "./QuestionGenerator";
  import DoubtSolver from "./DoubtSolver";



  import "./chatbot.css";
  const MessageBubble = ({ text = "", sender, handleSend }) => {
    const [showGenerator, setShowGenerator] = useState(false);
    const [showDoubtSolver, setShowDoubtSolver] = useState(false);
  
    const isNumberedOption = (line) => {
      return /^\d️⃣/.test(line.trim());
    };
  
    const handleOptionClick = (option) => {
      console.log("option",option)
      if (option === "Generate Questions.") {
        setShowGenerator(true);
        setShowDoubtSolver(false);
      } else if (option === "Doubt Solving.") {
        console.log("Inside Doubt solver")
        setShowDoubtSolver(true);
        setShowGenerator(false);
      } else {
        handleSend(option);
      }
    };
  
    const handleQuestionGeneratorComplete = (selections) => {
      const fullMessage = `Generate ${selections.noOfQuestions} questions for CBSE Class: ${selections.class}, Subject: ${selections.subject}, Chapter: ${selections.chapter}, Type: ${selections.questionType}, Language: ${selections.language}. Please generate the questions now. After providing the questions, ask: "Would you like me to provide answers for these questions as well?"`;
      const displayMessage = `Generate ${selections.noOfQuestions} questions for Class: ${selections.class}, Subject: ${selections.subject}, Chapter: ${selections.chapter}, Type: ${selections.questionType}, Language: ${selections.language}.`;
      
      handleSend(fullMessage, displayMessage);
      setShowGenerator(false);
    };

    const handleDoubtSolverComplete = ( language, expertise, doubt ) => {
      const fullMessage = `Explain doubt in Language: ${language}, Expertise: ${expertise}, Doubt: ${doubt} `;
      const displayMessage = `${doubt}`;
      handleSend(fullMessage, displayMessage);
      setShowDoubtSolver(false); // Hide DoubtSolver after sending
    };
  
  
    const formatMessage = () => {
      if (showGenerator) {
        return <QuestionGenerator onComplete={handleQuestionGeneratorComplete} />;
      }
  
      if (showDoubtSolver) {
        return <DoubtSolver onComplete={handleDoubtSolverComplete} />;
      }
      

   
      return text.split("\n").map((line, index) => {
        const trimmedLine = line.trim();
  
        if (isNumberedOption(trimmedLine)) {
          const cleanText = trimmedLine.replace(/^\d️⃣\s*/, "").trim();
          return (
            <div
              key={index}
              onClick={() => handleOptionClick(cleanText)}
              className="option-button"
              style={{
                cursor: "pointer",
                padding: "8px",
                margin: "4px 0",
                borderRadius: "4px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)")
              }
            >
              {trimmedLine}
            </div>
          );
        }
  
        return trimmedLine ? <p key={index}>{trimmedLine}</p> : null;
      }).filter(Boolean);
    };
  
    return (
      <div className={`message-bubble message-bubble--${sender}`}>{formatMessage()}</div>
    );
  };
  

  export default MessageBubble;