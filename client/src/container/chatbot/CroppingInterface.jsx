import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './utils/CropImage'; // Update path as needed
import './CroppingInterface.css';

const CroppingInterface = ({ image, onTextExtracted, onClose }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
  
    const handleCropAreaChange = (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    };
  
    const handleCropButtonClick = async () => {
      if (!croppedAreaPixels) {
        alert("Please select a crop area.");
        return;
      }
  
      setIsProcessing(true);
      try {
        const croppedImageResult = await getCroppedImg(image, croppedAreaPixels);
        console.log("croppedImageResult",croppedImageResult)
        //const text = await sendToGoogleVision(croppedImageResult);
        const text="text sent to google"
        setExtractedText(text);
        setIsEditing(true);
      } catch (error) {
        console.error("Error cropping image:", error);
        alert("Failed to crop image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    };
  
    const handleTextSubmit = () => {
      if (onTextExtracted) {
        onTextExtracted(extractedText);
      }
    };
  
    return (
      <div className="cropping-interface">
        {!isEditing ? (
          <>
            <div className="crop-container">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onCropComplete={handleCropAreaChange}
                onZoomChange={setZoom}
              />
            </div>
            <div className="crop-actions">
              <button onClick={onClose} disabled={isProcessing}>Cancel</button>
              <button onClick={handleCropButtonClick} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Crop"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-review">
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder="Edit the extracted text..."
            />
            <div className="crop-actions">
              <button onClick={() => setIsEditing(false)}>Recrop</button>
              <button onClick={handleTextSubmit}>Submit to ChatGPT</button>
            </div>
          </div>
        )}
      </div>
    );
  };

export default CroppingInterface;