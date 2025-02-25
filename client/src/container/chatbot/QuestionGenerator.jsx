import React, { useState, useRef } from 'react';
import { CLASS_OPTIONS, SUBJECTS_BY_CLASS, QUESTION_TYPES, LANGUAGES } from './data';
import './QuestionGenerator.css';

const QuestionGenerator = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    class: null,
    subject: null,
    chapter: '',
    questionType: null,
    language: null,
    noOfQuestions: 1,
  });
  const selectionsRef = useRef(selections); // Ref to track the latest state
  const languageRef = useRef(null); // Using useRef for language selection
  const [chapterSearch, setChapterSearch] = useState('');
  const [chapterSuggestions, setChapterSuggestions] = useState([]);
  
  const sampleChapters = {
    Math: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
    Physics: ['Motion', 'Forces', 'Energy', 'Waves', 'Electricity'],
    Chemistry: ['Atoms', 'Molecules', 'Reactions', 'Acids and Bases', 'Organic Chemistry'],
  };

  const updateSelection = (field, value) => {
    const updatedSelections = { ...selectionsRef.current, [field]: value };
    setSelections(updatedSelections);
    selectionsRef.current = updatedSelections; // Update the ref with the latest state
    setStep((prev) => prev + 1);
  };

  const handleChapterInput = (value) => {
    setChapterSearch(value);
    const subjectChapters = sampleChapters[selectionsRef.current.subject] || [];
    const filteredChapters = subjectChapters.filter((chapter) =>
      chapter.toLowerCase().includes(value.toLowerCase())
    );
    setChapterSuggestions(filteredChapters);
  };

  const handleChapterSelect = (chapter) => {
    setChapterSearch(chapter);
    setChapterSuggestions([]);
  };

  const handleChapterSubmit = () => {
    if (chapterSearch.trim()) {
      updateSelection('chapter', chapterSearch.trim());
    }
  };

  const handleLanguageSelect = (lang) => {
    languageRef.current = lang; // Update language reference
    const updatedSelections = { ...selectionsRef.current, language: lang };
    setSelections(updatedSelections);
    selectionsRef.current = updatedSelections; // Update the ref with the latest state

    // After language selection, check if all selections are made
    if (
      selectionsRef.current.class &&
      selectionsRef.current.subject &&
      selectionsRef.current.chapter &&
      selectionsRef.current.questionType
    ) {
      const noOfQuestions = determineNumberOfQuestions(selectionsRef.current.questionType);
      const finalSelections = { ...selectionsRef.current, noOfQuestions };
      setSelections(finalSelections);
      selectionsRef.current = finalSelections; // Update the ref with the latest state

      console.log('Final selections:', selectionsRef.current);
      onComplete({ ...selectionsRef.current }); // Call onComplete with the latest state
    }
  };

  const renderChapterStep = () => {
    return (
      <div className="question-generator__chapter">
        <div className="question-generator__search-container">
          <input
            type="text"
            value={chapterSearch}
            onChange={(e) => handleChapterInput(e.target.value)}
            placeholder="Enter or search chapter name"
            className="question-generator__input"
          />
          {chapterSuggestions.length > 0 && (
            <div className="question-generator__suggestions">
              {chapterSuggestions.map((chapter) => (
                <div
                  key={chapter}
                  className="question-generator__suggestion-item"
                  onClick={() => handleChapterSelect(chapter)}
                >
                  {chapter}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleChapterSubmit}
          disabled={!chapterSearch.trim()}
          className="question-generator__button question-generator__button--primary"
        >
          Continue
        </button>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="question-generator__options-class">
            {CLASS_OPTIONS.map((classNum) => (
              <button
                key={classNum}
                onClick={() => updateSelection('class', classNum)}
                className="question-generator__button-class question-generator__button--round"
              >
                {classNum}
              </button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="question-generator__options">
            {SUBJECTS_BY_CLASS[selections.class]?.map((subject) => (
              <button
                key={subject}
                onClick={() => updateSelection('subject', subject)}
                className="question-generator__button"
              >
                {subject}
              </button>
            ))}
          </div>
        );

      case 3:
        return renderChapterStep();

      case 4:
        return (
          <div className="question-generator__options">
            {QUESTION_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => updateSelection('questionType', type)}
                className="question-generator__button"
              >
                {type}
              </button>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="question-generator__options">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                className="question-generator__button"
              >
                {lang}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = {
    1: 'Select Class',
    2: 'Select Subject',
    3: 'Enter Chapter',
    4: 'Select Question Type',
    5: 'Select Language',
  };

  const determineNumberOfQuestions = (questionType) => {
    if (['MCQ', 'Short Answer', 'Fill In The Blanks', 'Assertion Reason'].includes(questionType)) {
      return 2;
    } else if (['Medium Answer', 'Long Answer'].includes(questionType)) {
      return 2;
    } else if (['Case Based', 'Match The Following'].includes(questionType)) {
      return 1;
    }
    return 0; // Default case (if questionType is missing or unknown)
  };

  return (
    <div className="question-generator">
      <div className="question-generator__title">{stepTitles[step]}</div>
      {renderStep()}
      <div className="question-generator__progress">
        <span className="question-generator__step">Step {step} of 5</span>
        <span className="question-generator__selection">
          {selections.class ? `Class ${selections.class}` : ''}
          {selections.subject ? ` • ${selections.subject}` : ''}
          {selections.chapter ? ` • ${selections.chapter}` : ''}
        </span>
      </div>
    </div>
  );
};

export default QuestionGenerator;