import React, { useState } from 'react';
import CroppingInterface from './CroppingInterface';
import CameraModal from './CameraModal'; 

const MainCameraModal = ({ onClose, onTextExtracted }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleCapture = (imageData) => {

    setCapturedImage(imageData);
  };

  const handleCropComplete = async (croppedImage) => {

    console.log('Cropped image sent to Google Cloud vision:' ,  croppedImage);
    // Send cropped image to Google Vision API for OCR
    //const text = await sendToGoogleVision(croppedImage);
    const text = "THis is testing text";

    setExtractedText(text);
    setIsEditing(true);
  };

  const sendToGoogleVision = async (image) => {
    // Implement Google Vision API call here
    // Return the extracted text
    return 'Extracted text from Google Vision API';
  };

  const handleTextSubmit = () => {
    if (onTextExtracted) {
      onTextExtracted(extractedText);
    }
  };

  return (
    <div>
      {!capturedImage ? (
        <CameraModal onClose={onClose} onCapture={handleCapture} />
      ) : !isEditing ? (
        <CroppingInterface
          image={capturedImage}
          onCropComplete={handleCropComplete}
          onClose={() => setCapturedImage(null)}
        />
      ) : (
        <div className="text-review">
          <textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            placeholder="Edit the extracted text..."
          />
          <button onClick={handleTextSubmit}>Submit to ChatGPT</button>
        </div>
      )}
    </div>
  );
};

export default MainCameraModal;