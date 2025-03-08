import { createSlice } from '@reduxjs/toolkit';

const speechSlice = createSlice({
  name: 'speech',
  initialState: {
    isListening: false,
    transcript: '',
    error: null
  },
  reducers: {
    setListeningStatus: (state, action) => {
      state.isListening = action.payload;
    },
    setTranscript: (state, action) => {
      state.transcript = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearTranscript: (state) => {
      state.transcript = '';
    }
  }
});

export const { setListeningStatus, setTranscript, setError, clearTranscript } = speechSlice.actions;
export default speechSlice.reducer;