import React from 'react';
import { trackEvent } from '../../../analytics/analytics';
import './header.css';
//import ai from '../../../assets/ai.png';
import tickmark from '../../../assets/tickmark.png';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



const Header = () => {




  return (
    <div>
      <div className="gpt4__header" id="home">
        <div className='gpt4__header-content'>
          <h1 className='gradient__text'>🎓 AI-Powered Tutoring</h1>
          <h2 className='gradient__text'> Learn Smarter. Learn Faster.</h2>

          <div className='gpt4__header-features'>
            <img src={tickmark} alt=''></img>
            <p>Step-by-Step Explanations.  </p>
          </div>
          <div className='gpt4__header-features'>
            <img src={tickmark} alt=''></img>
            <p>Quizzes and practice questions to reinforce learning.</p>
          </div>
          <div className='gpt4__header-features'>
            <img src={tickmark} alt=''></img>
            <p>Instant feedback on answers with detailed explanations.  </p>
          </div>
          <div className='gpt4__header-features'>
            <img src={tickmark} alt=''></img>
            <p>Multiple languages Support - Hindi & English. </p>
          </div>
          <div className='gpt4__header-features'>
            <p className='gradient__text-subtitle'><b>🧠 "Instant, AI-Powered Answers to All Your Questions!"</b> </p>
          </div>
        </div>
        <div className='gpt4__header-image'>
          <div className='gpt4__header-imageContainer'>
            <DotLottieReact
              src="https://lottie.host/34ce58dd-27c5-469a-8f7b-e669b0c2f5eb/HMJ99AaKfk.lottie"
              loop
              autoplay
              className='gpt4__header-imageLottie'
            />            
            <div className='gpt4__header-features-cta'>
              <a href='#formatChoser' className="gpt4__cta-button" onClick={() => trackEvent("User", "Clicked Make Your Paper Button", "Make Your Paper Link")}>
              Talk to AI Tutor
              </a>
            </div>
            
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default Header;