import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTopic, setQuestions, answerQuestion, resetQuiz } from '../../state/quizSlice';
import { revealPiece, resetPuzzle } from '../../state/puzzleSlice';
import QuizHeader from './QuizHeader';
import QuizQuestion from './QuizQuestion';
import PuzzleDisplay from './PuzzleDisplay';
import QuizFeedback from './QuizFeedback';

import './QuizContainer.css';


const dummyQuestions = [
    {
      id: 1,
      text: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Paris",
      hint: "It's known as the 'City of Light'.",
    },
    {
      id: 2,
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
      hint: "It's the number of seasons in a year.",
    },
    {
      id: 3,
      text: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Ernest Hemingway"],
      correctAnswer: "Harper Lee",
      hint: "The author's first name starts with 'H'.",
    },
    {
      id: 4,
      text: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Paris",
      hint: "It's known as the 'City of Light'.",
    },
    {
      id: 5,
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
      hint: "It's the number of seasons in a year.",
    },
    {
      id: 6,
      text: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Ernest Hemingway"],
      correctAnswer: "Harper Lee",
      hint: "The author's first name starts with 'H'.",
    },
    {
      id: 7,
      text: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Paris",
      hint: "It's known as the 'City of Light'.",
    },
    {
      id: 8,
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
      hint: "It's the number of seasons in a year.",
    },
    {
      id: 9,
      text: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Ernest Hemingway"],
      correctAnswer: "Harper Lee",
      hint: "The author's first name starts with 'H'.",
    },
  ];

const QuizContainer = ({ selectedTopic }) => { // Pass selectedTopic as a prop

  const dispatch = useDispatch();
  const { topic, questions, currentQuestionIndex } = useSelector((state) => state.quiz);

  const { overlayOpacities } = useSelector((state) => state.puzzle);

  useEffect(() => {
    dispatch(setTopic(selectedTopic));        
    dispatch(setQuestions(dummyQuestions));
  }, [dispatch, selectedTopic]); // Run when `selectedTopic` changes
  
     
  

  const handleAnswer = (isCorrect) => {
    dispatch(answerQuestion({ isCorrect }));
    if (isCorrect) {
      dispatch(revealPiece({ currentQuestionIndex, totalQuestions: questions.length }));
    }
  };

  const handleReset = () => {
    dispatch(resetQuiz());
    dispatch(resetPuzzle());
  };

  return (
    <div className="quiz-container">

      <QuizHeader topic={topic} />
     
    
      <div className="quiz__content">
      {questions.length > 0 && (
        <div className="quiz__question">
          <QuizQuestion
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
          />
        </div>
      )}
    
      <div className="quiz__puzzle">
        <PuzzleDisplay overlayOpacities={overlayOpacities} />
      </div>
    </div>
    
      
        <QuizFeedback onReset={handleReset} />
      
    </div>
  );
};

export default QuizContainer;