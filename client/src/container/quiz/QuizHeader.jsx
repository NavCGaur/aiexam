import React from 'react';
import { useSelector } from 'react-redux';

import './QuizHeader.css';

const QuizHeader = () => {
  const { topic, currentQuestionIndex, questions } = useSelector((state) => state.quiz);

  return (
    <div className="quiz-header">
      <h2 className="quiz-header__topic">{topic}</h2>
      <p className="quiz-header__progress">
        Question {currentQuestionIndex + 1} of {questions.length}
      </p>
    </div>
  );
};

export default QuizHeader;