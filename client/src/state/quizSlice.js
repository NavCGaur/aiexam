import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  topic: 'Math',
  questions: [],
  currentQuestionIndex: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  isQuizCompleted: false,
  hintsUsed: 0,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setTopic: (state, action) => {
      state.topic = action.payload;
    },
    setQuestions: (state, action) => {
      console.log("Setting questions:", action.payload);
      state.questions = action.payload;
    },
    answerQuestion: (state, action) => {
      const { isCorrect } = action.payload;
      if (isCorrect) {
        state.correctAnswers += 1;
      } else {
        state.incorrectAnswers += 1;
      }
      
      // Check if the quiz is completed before incrementing the index
      if (state.currentQuestionIndex >= state.questions.length - 1) {
        state.isQuizCompleted = true;
      } else {
        state.currentQuestionIndex += 1; // Increment the index only if the quiz is not completed
      }
      console.log("Current index after:", state.currentQuestionIndex);

    },
    useHint: (state) => {
      state.hintsUsed += 1;
    },
    resetQuiz: (state) => {
      return initialState;
    },
  },
});

export const { setTopic, setQuestions, answerQuestion, useHint, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;