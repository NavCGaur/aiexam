import React, { useState } from 'react';
import CroppingInterface from './CroppingInterface';
import CameraModal from './CameraModal'; 

const MainCameraModal = ({ onClose, onTextExtracted }) => {
    const [capturedImage, setCapturedImage] = useState(null);

    const handleRetake = () => {
      setCapturedImage(false); // Open the camera modal
    };
  
    return (
      <div>
        {!capturedImage ? (
          <CameraModal onClose={onClose} onCapture={setCapturedImage} />
        ) : (
          <CroppingInterface
            image={capturedImage}
            onTextExtracted={onTextExtracted}
            onRetake={handleRetake}
            onClose={() => {
              setCapturedImage(null);
              onClose();  // Close MainCameraModal when cropping is done
            }}
          />
        )}
      </div>
    );
  };
  

export default MainCameraModal;