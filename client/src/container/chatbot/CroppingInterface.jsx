import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './utils/CropImage'; // Utility function to crop the image

const CroppingInterface = ({ image, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = ( croppedAreaPixels) => {

    if (!croppedAreaPixels) {
        console.error("No crop area selected");
        return;
      }
    console.log("Cropping image  using React easy crop handleCropComplete...");
    console.log("Cropped Area Pixels:", croppedAreaPixels); // Debugging line

    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    console.log("Cropping image after user clicks Crop button...");
    console.log("Cropped Area Pixels:", croppedAreaPixels); // Debugging line
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
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
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="crop-actions">
        {console.log("Cropping image  using React easy crop crop actions...")}
        <button onClick={handleCrop}>Crop</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default CroppingInterface;