import React, { useState } from 'react';
import './DoubtSolver.css';

const LANGUAGES = [
  { 
    id: 'english', 
    label: '🌐 English',
    placeholder: 'Enter your doubt here...',
    submitText: 'Submit'
  },
  { 
    id: 'hindi', 
    label: '🇮🇳 हिन्दी',
    placeholder: 'अपना प्रश्न यहां लिखें...',
    submitText: 'भेजें'
  }
];

const EXPERTISE_LEVELS = [
  { id: 'beginner', label: '🌱 Starter (Class 5-9)' },
  { id: 'explorer', label: '🚀 Explorer  (Class 10-12)' },
  { id: 'expert', label: '🎓 Expert (Graduation and Up)' }
];

const DoubtSolver = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    language: null,
    expertise: null,
    doubt: ''
  });

  const handleLanguageSelect = (language) => {
    setSelections(prev => ({ ...prev, language }));
    setStep(2);
  };

  const handleExpertiseSelect = (expertise) => {
    setSelections(prev => ({ ...prev, expertise }));
    setStep(3);
  };

  const handleDoubtSubmit = () => {
    if (selections.doubt.trim()) {
      console.log(selections.language, selections.expertise, selections.doubt);
      onComplete(selections.language, selections.expertise, selections.doubt);
    }
  };

  const renderLanguageSelection = () => (
    <div className="doubt-solver__options">
      {LANGUAGES.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => handleLanguageSelect(id)}
          className="doubt-solver__button"
        >
          {label}
        </button>
      ))}
    </div>
  );

  const renderExpertiseSelection = () => (
    <div className="doubt-solver__options">
      {EXPERTISE_LEVELS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => handleExpertiseSelect(id)}
          className="doubt-solver__button"
        >
          {label}
        </button>
      ))}
    </div>
  );

  const renderDoubtInput = () => {
    const selectedLanguage = LANGUAGES.find(lang => lang.id === selections.language);
    
    return (
      <div className="doubt-solver__doubt-container">
        <textarea
          value={selections.doubt}
          onChange={(e) => setSelections(prev => ({ ...prev, doubt: e.target.value }))}
          placeholder={selectedLanguage.placeholder}
          className="doubt-solver__input"
        />
        <button
          onClick={handleDoubtSubmit}
          disabled={!selections.doubt.trim()}
          className="doubt-solver__button doubt-solver__button--primary"
        >
          {selectedLanguage.submitText}
        </button>
      </div>
    );
  };

  const stepTitles = {
    1: 'Select Language',
    2: 'Select Expertise Level',
    3: {
      english: 'Enter Your Doubt',
      hindi: 'अपना प्रश्न यहां लिखें',
    }
  };

  const getCurrentTitle = () => {
    if (step === 1) return stepTitles[1];
    if (step === 2) return stepTitles[2];
    return stepTitles[3][selections.language] || stepTitles[3].english;
  };

  return (
    <div className="doubt-solver">
      <div className="doubt-solver__title">{getCurrentTitle()}</div>
      {step === 1 && renderLanguageSelection()}
      {step === 2 && renderExpertiseSelection()}
      {step === 3 && renderDoubtInput()}
      <div className="doubt-solver__progress">
        <span className="doubt-solver__step">Step {step} of 3</span>
     
      </div>
    </div>
  );
};

export default DoubtSolver;
