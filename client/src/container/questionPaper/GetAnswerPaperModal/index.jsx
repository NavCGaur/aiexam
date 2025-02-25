import React, { useState } from 'react';
import './index.css';

const GetAnswerPaperModal = ({ isOpen, onClose }) => {
  const [paperId, setPaperId] = useState('');
  const [validationStatus, setValidationStatus] = useState(null);

  const handlePaperIdChange = (e) => {
    const value = e.target.value;
    setPaperId(value);
    
    // Auto-validate when 11 digits are entered
    if (value.length === 11) {
      // Mock validation - replace with actual validation logic
      const isValid = /^\d{11}$/.test(value);
      setValidationStatus(isValid ? 'success' : 'error');
    } else {
      setValidationStatus(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button 
          onClick={onClose}
          className="modal-close-button"
        >
          ✕
        </button>

        <div className="modal-content">
          
          <p className="modal-info-text">
            Enter the Paper ID mentioned at the top of the paper or the last 11 digits of your Question Paper.
          </p>

          <div className="modal-input-container">
            <input
              type="text"
              value={paperId}
              onChange={handlePaperIdChange}
              placeholder="Enter Paper ID"
              className={`modal-input ${
                validationStatus === 'success' ? 'success' : 
                validationStatus === 'error' ? 'error' : ''
              }`}
              maxLength={11}
            />

            {validationStatus === 'success' && (
              <p className="validation-message success">
                Paper ID verified! Redirecting to payment...
              </p>
            )}
            {validationStatus === 'error' && (
              <p className="validation-message error">
                🔴 Invalid Paper ID. Please enter a valid one.
              </p>
            )}
          </div>

          <div className="modal-extra-section">
            <p className="extra-section-text">Haven't created a question paper yet?</p>
            <a
              href="#formatChoser"
              className="gpt4__cta-button"
            >
              Make your Question Paper for Free instantly!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAnswerPaperModal;

