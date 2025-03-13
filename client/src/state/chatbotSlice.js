import { createSlice } from "@reduxjs/toolkit";

const chatbotSlice = createSlice({
  name: "chatbot",
    initialState: {
      isOpen: false,
      isTyping: false,
      messages: [
                 {   text: "Hey Champ! 👋\n\nI can help explain concepts and solve problems.\n\nChoose your expertise level to let me help you better!",
                     sender: "bot",},
    
              ],        
    userId: null,
    expertise: null, // Add expertise to store


  },
  reducers: {
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setExpertise: (state, action) => {
      state.expertise = action.payload;
    }

  }
});

export const { toggleChatbot, addMessage, setTyping, setUserId, setExpertise } = chatbotSlice.actions;
export default chatbotSlice.reducer;
