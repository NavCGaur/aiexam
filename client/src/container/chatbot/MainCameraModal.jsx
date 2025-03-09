import React, { useState } from 'react';
import CroppingInterface from './CroppingInterface';
import CameraModal from './CameraModal'; 

const MainCameraModal = ({ onClose, onTextExtracted }) => {
    const [capturedImage, setCapturedImage] = useState(null);
  
    return (
      <div>
        {!capturedImage ? (
          <CameraModal onClose={onClose} onCapture={setCapturedImage} />
        ) : (
          <CroppingInterface
            image={capturedImage}
            onTextExtracted={onTextExtracted}
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