import React from 'react';
import { useSelector } from 'react-redux';
import './PuzzleDisplay.css';
import puzzleImage from '../../assets/ai.png';

const PuzzleDisplay = () => {
  const { overlayOpacities } = useSelector((state) => state.puzzle);

  return (
    <div className="puzzle-display">
        <img
            src={puzzleImage} // Replace with the path to your image
            alt="Puzzle"
            className="puzzle-display__image"
        />
           <div className="puzzle-display__overlay-container">
        {overlayOpacities.map((opacity, index) => (
          <div
            key={index}
            className="puzzle-display__overlay"
            style={{ opacity }}
          />
        ))}
      </div>
   
    </div>
  );
};

export default PuzzleDisplay;