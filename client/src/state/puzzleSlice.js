import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    overlayOpacities: Array(100).fill(1), // 64 overlay divs, initially fully opaque
  };
  
  const puzzleSlice = createSlice({
    name: 'puzzle',
    initialState,
    reducers: {
      revealPiece: (state, action) => {
        const { currentQuestionIndex, totalQuestions } = action.payload;

        const opaqueIndices = state.overlayOpacities
          .map((opacity, index) => (opacity === 1 ? index : null))
          .filter((index) => index !== null);
  
          if (opaqueIndices.length > 0) {
            let piecesToReveal;
    
            if (currentQuestionIndex < totalQuestions - 1) {
              // Reveal 5 pieces for the first 9 questions
              piecesToReveal = 5;
            } else {
              // Reveal all remaining pieces on the 10th question
              piecesToReveal = opaqueIndices.length;
            }
  
          // Shuffle the opaque indices to randomize which pieces are revealed
          const shuffledIndices = opaqueIndices.sort(() => Math.random() - 0.5);
  
          // Reveal the first `piecesToReveal` pieces
          for (let i = 0; i < piecesToReveal && i < shuffledIndices.length; i++) {
            state.overlayOpacities[shuffledIndices[i]] = 0;
          }
        }
      },
      resetPuzzle: (state) => {
        state.overlayOpacities = Array(100).fill(1);
      },
    },
  });
  
  export const { revealPiece, resetPuzzle } = puzzleSlice.actions;
  export default puzzleSlice.reducer;

