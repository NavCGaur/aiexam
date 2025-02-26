import React, { useRef, useState, useEffect } from 'react';
import './CameraModal.css';

const CameraModal = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [isCameraReady, setCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [errorMessage, setErrorMessage] = useState('');

  const checkPermissions = async () => {
    try {
      // Check if permissions API is available
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'camera' });
        setPermissionState(result.state);
        
        // Listen for permission changes
        result.onchange = () => {
          setPermissionState(result.state);
        };
        
        return result.state;
      } else {
        console.log('Permissions API not supported, will try direct access');
        return 'prompt'; // Assume we need to prompt if we can't check
      }
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      return 'prompt'; // Assume we need to prompt on error
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    stopCamera();
    setErrorMessage('');
    setCameraReady(false);
    
    try {
      console.log(`Requesting camera with facingMode: ${facingMode}`);
      
      // Try with ideal constraints first
      const constraints = {
        audio: false,
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      // For iOS Safari - try to be very explicit with what we're requesting
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        constraints.video = {
          facingMode: facingMode,
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 }
        };
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
          setPermissionState('granted');
          console.log('Camera stream loaded successfully');
        };
        
        // iOS Safari sometimes doesn't trigger onloadedmetadata
        setTimeout(() => {
          if (!isCameraReady) {
            setCameraReady(true);
            console.log('Forcing camera ready state after timeout');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      if (error.name === 'NotAllowedError') {
        setPermissionState('denied');
        setErrorMessage('Camera access denied. Please check your browser settings and allow camera access.');
      } else if (error.name === 'NotFoundError') {
        setErrorMessage('No camera found on this device.');
      } else if (error.name === 'NotReadableError') {
        setErrorMessage('Camera already in use by another application.');
      } else if (error.name === 'OverconstrainedError') {
        // Try again with minimal constraints
        try {
          const simpleConstraints = { video: true };
          const stream = await navigator.mediaDevices.getUserMedia(simpleConstraints);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraReady(true);
            setPermissionState('granted');
          }
        } catch (fallbackError) {
          setErrorMessage('Could not access camera: constraints not satisfied.');
        }
      } else {
        setErrorMessage(`Camera error: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const requestCameraAccess = async () => {
    const currentPermission = await checkPermissions();
    if (currentPermission !== 'denied') {
      startCamera();
    }
  };

  const switchCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
  };

  const captureImage = () => {
    if (!videoRef.current || !isCameraReady) return;
    
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/jpeg');
    if (onCapture) {
      onCapture(imageData);
    }
  };

  useEffect(() => {
    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Camera API not supported in this browser.');
      return;
    }
    
    // Check permissions and start camera if allowed
    requestCameraAccess();
    
    // Cleanup function
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  return (
    <div className="camera-modal">
      {permissionState === 'denied' ? (
        <div className="camera-modal__error">
          <p>Camera access denied. Please update your browser settings to allow camera access.</p>
          <button onClick={onClose}>Close</button>
        </div>
      ) : errorMessage ? (
        <div className="camera-modal__error">
          <p>{errorMessage}</p>
          <button onClick={onClose}>Close</button>
        </div>
      ) : (
        <div className="camera-modal__overlay">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="camera-modal__video"
          />
          
          {isCameraReady && (
            <>
              <div className="camera-modal__frame">
                <div className="camera-modal__frame-outline"></div>
                <div className="camera-modal__instruction">
                  Position document within frame
                </div>
              </div>
              
              <button 
                className="camera-modal__capture" 
                onClick={captureImage}>
              </button>
            </>
          )}
          
          <div className="camera-modal__actions">
            {isCameraReady && (
              <button 
                className="camera-modal__switch" 
                onClick={switchCamera}>
                Switch Camera
              </button>
            )}
            <button 
              className="camera-modal__close" 
              onClick={() => {
                stopCamera();
                onClose();
              }}>
              Close
            </button>
          </div>
          
          {!isCameraReady && permissionState !== 'denied' && (
            <div className="camera-modal__permission-prompt">
              <p>Please allow camera access when prompted</p>
              <button onClick={requestCameraAccess}>
                Request Camera Access
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraModal;