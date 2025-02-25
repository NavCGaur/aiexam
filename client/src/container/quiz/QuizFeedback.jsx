import React from 'react';
import { useSelector } from 'react-redux';

import './QuizFeedback.css';

const QuizFeedback = ({ onReset }) => {
  const { correctAnswers, incorrectAnswers, questions } = useSelector((state) => state.quiz);

  return (
    <div className="quiz-feedback">
      <h2 className="quiz-feedback__title">Quiz Completed!</h2>
      <p className="quiz-feedback__score">
        You scored {correctAnswers} out of {questions.length}.
      </p>
      {incorrectAnswers > 0 && (
        <p className="quiz-feedback__incorrect">
          You answered {incorrectAnswers} questions incorrectly.
        </p>
      )}
      <button className="quiz-feedback__button" onClick={onReset}>
        Retry Quiz
      </button>
    </div>
  );
};

export default QuizFeedback;