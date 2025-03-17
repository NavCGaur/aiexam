import React from 'react';
import './header.css';
//import ai from '../../../assets/ai.png';
import tickmark from '../../../assets/tickmark.png';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useDispatch } from "react-redux";
import { toggleChatbot } from "../../../state/chatbotSlice";



const Header = () => {


  const dispatch = useDispatch();

  return (
    <div>
      <div className="gpt4__header" id="home">
        <div className='gpt4__header-content'>
          <h1 className='gradient__text'>🎓 AI-Powered Tutoring</h1>
          <h2 className='gradient__text'> Personalized, Context-Aware AI Tutor</h2>

          <p className='gpt4__header-subtitle'>
        Why sift through hundreds of search results? Instant, structured answers from our AI tutor.
          </p>

          <div className='gpt4__header-features'>
            <div className='gpt4__header-features-icon'>📚 </div>
            <p> Chatbot remembers your learning progress.</p>
          </div>
          <div className='gpt4__header-features'>
            <div className='gpt4__header-features-icon'>🎯 </div>
            <p>Explanations match your understanding level.</p>
          </div>
          <div className='gpt4__header-features'>
            <div className='gpt4__header-features-icon'>✅ </div>
            <p> Ask follow-up questions & get real-time feedback.</p>
          </div>
       

          <div className='gpt4__header-features'>
            <p className='gradient__text-subtitle'><b>🔍 "Your AI Tutor That Learns With You!"</b></p>
          </div>
        </div>

        <div className='gpt4__header-image'>
          <div className='gpt4__header-imageContainer'>
            <div className='gpt4__header-features-cta'>
              <a href='#Chatbot' className="gpt4__cta-button" onClick={() => dispatch(toggleChatbot())}>
              Start Learning
              </a>
            </div>
            <DotLottieReact
              src="https://lottie.host/34ce58dd-27c5-469a-8f7b-e669b0c2f5eb/HMJ99AaKfk.lottie"
              loop
              autoplay
              className='gpt4__header-imageLottie'
            />            
          </div>
        </div>
      </div>
    </div>
  );

};

export default Header;