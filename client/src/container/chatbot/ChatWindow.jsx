import React, {  useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

import "./chatbot.css";

const ChatWindow = ({ handleSend }) => {
  const messages = useSelector((state) => state.chatbot.messages);
  const isTyping = useSelector((state) => state.chatbot.isTyping);
  const chatWindowRef = useRef(null);
  const messageRefs = useRef({});
  
  // Adjust TOP_PADDING for better spacing in full-screen mode
  const TOP_PADDING = 120;
  
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;
    
    const lastMessageRef = messageRefs.current[messages.length - 1];
    if (!lastMessageRef) return;
    
    // Always scroll to show user messages at the bottom
    if (lastMessage.sender === 'user') {
      chatWindowRef.current?.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth'
      });
      return;
    }
    
    // For bot messages, scroll to show the start of the message
    if (lastMessage.sender === 'bot') {
      requestAnimationFrame(() => {
        const messageTop = lastMessageRef.offsetTop;
        
        chatWindowRef.current?.scrollTo({
          top: messageTop - TOP_PADDING,
          behavior: 'smooth'
        });
      });
    }
  }, [messages]);
  
  return (
    <div
      ref={chatWindowRef}
      className="chat-window relative overflow-y-auto"
    >
      <div className="flex flex-col gap-4 pb-6 pt-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            ref={el => messageRefs.current[index] = el}
            className="message-container"
          >
            <MessageBubble
              text={msg.text}
              sender={msg.sender}
              handleSend={handleSend}
            />
          </div>
        ))}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
};

export default ChatWindow;