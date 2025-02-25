import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useHint } from '../../state/quizSlice';

import './QuizQuestion.css';

const QuizQuestion = ({ question, onAnswer }) => {
    const dispatch = useDispatch();
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [hintUsed, setHintUsed] = useState(false);
  
    const handleSubmit = () => {
      if (selectedOption !== null) {
        const isCorrect = selectedQuestion === question.correctAnswer;
        setSelectedOption(null)
        onAnswer(isCorrect);
      }
    };
  
    const handleHint = () => {
      if (!hintUsed) {
        dispatch({ type: 'useHint' }); // Dispatch the useHint action directly
        setHintUsed(true);
        alert(`Hint: ${question.hint}`);
      }
    };
  
    return (
      <div className="quiz-question">
        <h3 className="quiz-question__text">{question.text}</h3>
        <ul className="quiz-question__options">
          {question.options.map((option, index) => (
            <li key={index} className="quiz-question__option">
              <button
                className={`quiz-question__button ${selectedOption === index ? 'quiz-question__button--selected' : ''}`}
                onClick={() => {setSelectedOption(index); setSelectedQuestion(option)}}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
        <button className="quiz-question__submit" onClick={handleSubmit}>
          Submit
        </button>
        <button className="quiz-question__hint" onClick={handleHint} disabled={hintUsed}>
          Use Hint
        </button>
      </div>
    );
  };
  

export default QuizQuestion;