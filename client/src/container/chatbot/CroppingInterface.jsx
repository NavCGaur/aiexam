import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './utils/CropImage'; // Utility function to crop the image

const CroppingInterface = ({ image, onCropComplete, onClose }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
    // This function is called by react-easy-crop when crop area changes
    const handleCropAreaComplete = (croppedArea, croppedAreaPixels) => {
      console.log("Crop area adjusted in the interface");
      console.log("Cropped Area Pixels:", croppedAreaPixels);
      setCroppedAreaPixels(croppedAreaPixels);
    };
  
    // This function is called when the user clicks the "Crop" button
    const handleCropButtonClick = async () => {
      console.log("CROP BUTTON CLICKED");
      
      if (!croppedAreaPixels) {
        console.error("No crop area selected");
        return;
      }
      
      try {
        const croppedImageResult = await getCroppedImg(image, croppedAreaPixels);
        console.log("Image cropped successfully, sending to parent component");
        // This calls the prop passed from MainCameraModal
        onCropComplete(croppedImageResult);
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    };
  
    return (
      <div className="cropping-interface">
        <div className="crop-container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onCropComplete={handleCropAreaComplete} 
            onZoomChange={setZoom}
          />
        </div>
        <div className="crop-actions">
          <button 
            onClick={handleCropButtonClick} 
            className="crop-button"
          >
            Crop
          </button>
          <button 
            onClick={onClose} 
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

export default CroppingInterface;