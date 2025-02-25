//React import
import React from 'react';

//Style import
import './footer.css';



const Footer = () => {

  const Links = ['Overons', 'Social', 'Media', 'Counters', 'Contact'];
  const Company = ['Terms and Conditions', 'Privacy Policy', 'Contact'];
  const Touch = ['Crechterwoord K12 182 DK Alknjkcb', '085-132567', 'info@payme.net'];





  return (
    <div className='gpt4__footer section__padding'>

      <div className='gpt4__footer-heading '>
        <h1 className='gradient__text'>Do you want to step in to the future before others</h1>
      </div>

      <div className='gpt4__footer-button'>
        <button>Request Early access</button>
      </div>

      <div className='gpt4__footer-links'>
        <div className='gpt4__footer-links__logo'>
            <div className='gpt4__footer-links__logo-image'>
              <h1>GPT-4</h1>
            </div>
            <div className='gpt4__footer-links__logo-text'>
              <p>Crechterwoord K12 182 DK Alknjkcb, All Rights Reserved</p>
            </div>
        </div>

        
         <div className='gpt4__footer-links__info'>
              <h3>Links</h3>
              {Links.map((items,index)=> <p>{items}</p>)}
          </div>

          <div className='gpt4__footer-links__info'>
            <h3>Company</h3>
            {Company.map((items,index)=> <p>{items}</p>)}              
          </div>

          <div className='gpt4__footer-links__info'>
            <h3>Touch</h3>
            {Touch.map((items,index)=> <p>{items}</p>)}
          </div>
          
       </div>

       <div className='gpt4__footer-copyright'>
          <p>© 2024 GPT-4. All rights reserved.</p>
        </div>


    </div>
  )
}

export default Footer
