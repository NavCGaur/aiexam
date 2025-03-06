import React, { useRef, useState } from "react";
import { Cropper } from "react-cropper";
import './CroppingInterface.css';

const CroppingInterface = ({ image, onTextExtracted, onClose }) => {
  const cropperRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Function to crop image 
  const handleCropButtonClick = async () => {
    if (!cropperRef.current) return;
    
    setIsProcessing(true);
    try {
      const croppedImage = cropperRef.current.cropper.getCroppedCanvas().toDataURL();  
      console.log("Cropped Image:", croppedImage);
      
      // Here, send `croppedImage` to OCR or process it
      const text = "text sent to google"; // Simulating extracted text
      setExtractedText(text);
      setIsEditing(true);
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Failed to crop image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle text submission
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
              ref={cropperRef}
              src={image}
              style={{ height: "400px", width: "100%" }}
              aspectRatio={NaN} // Freeform crop (Set to 16/9 for fixed)
              viewMode={1} // Restrict image from going out of bounds
              dragMode="move" // Allow moving the image
              guides={false} // Hide grid guides
              scalable={true} // Enable resizing
              cropBoxMovable={true} // Allow moving crop box
              cropBoxResizable={true} // Allow resizing crop box
              background={false} // Disable background shading
              responsive={true} // Make it responsive
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
