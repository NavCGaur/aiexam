import React, { useRef, useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './CameraModal.css';

const CameraModal = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const [isCameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [availableCameras, setAvailableCameras] = useState([]);
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);

  const detectBrowserCapabilities = () => {
    const userAgent = navigator.userAgent;
    
    // Polyfill for older browsers
    if (!navigator.mediaDevices) {
      navigator.mediaDevices = {};
    }
    
    if (!navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
    
    return {
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!navigator.mediaDevices.getUserMedia,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
      isIOS: /iPhone|iPad|iPod/i.test(userAgent),
      isAndroid: /Android/i.test(userAgent)
    };
  };

  // Get available camera devices
  const getAvailableCameras = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log('enumerateDevices() not supported.');
        return [];
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available cameras:', videoDevices);
      setAvailableCameras(videoDevices);
      return videoDevices;
    } catch (err) {
      console.error('Error enumerating devices:', err);
      return [];
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
    setError('');
    setCameraReady(false);
    
    try {
      const capabilities = detectBrowserCapabilities();
      
      if (!capabilities.hasMediaDevices || !capabilities.hasGetUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }
      
      // Check for available cameras
      const cameras = await getAvailableCameras();
      
      // Set constraints with current facing mode
      let constraints = { 
        video: { 
          facingMode: cameraFacingMode 
        } 
      };
      
      console.log('Requesting camera with constraints:', JSON.stringify(constraints));
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Setup multiple event listeners to try to detect when camera is truly ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          try {
            videoRef.current.play();
          } catch (e) {
            console.error('Error playing video:', e);
          }
        };
        
        videoRef.current.oncanplay = () => {
          console.log('Video can play');
          setCameraReady(true);
        };
        
        // Special iOS fix - sometimes events don't fire properly
        if (capabilities.isIOS) {
          setTimeout(() => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
              console.log('iOS timeout check - video appears ready');
              setCameraReady(true);
            }
          }, 1000);
        }
        
        // Fallback for any browser - force ready after timeout
        setTimeout(() => {
          if (!isCameraReady && videoRef.current && videoRef.current.srcObject) {
            console.log('Forcing camera ready state after timeout');
            setCameraReady(true);
          }
        }, 3000);
      } else {
        throw new Error('Video reference not available');
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(`Camera error: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSwitchingCamera(false);
    }
  };

  const switchCamera = async () => {
    setIsSwitchingCamera(true);
    // Toggle between front and back camera
    const newFacingMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(newFacingMode);
    
    console.log(`Switching camera to ${newFacingMode} mode`);
  };

  const captureImage = () => {
    console.log("Capture image starting");
    
    if (!videoRef.current) {
      console.error("Video reference is null");
      return;
    }
    
    // Force capture even if isCameraReady is false but video element has content
    const hasVideoContent = videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0;
    
    if (!hasVideoContent) {
      console.error("Video has no content: width=", videoRef.current.videoWidth, "height=", videoRef.current.videoHeight);
      return;
    }
    
    setIsCapturing(true);
    
    try {
      console.log("Creating canvas for capture");
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      // Get actual dimensions from video element
      const width = video.videoWidth;
      const height = video.videoHeight;
      
      console.log("Video dimensions:", width, "x", height);
      
      // Only proceed if we have valid dimensions
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        
        // If using front camera, flip the image horizontally
        if (cameraFacingMode === 'user') {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }
        
        ctx.drawImage(video, 0, 0, width, height);
        
        // Convert to image
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Check if image data is valid
        if (imageData && imageData.startsWith('data:image/jpeg')) {
          console.log("Image captured successfully");
          if (onCapture) {
            onCapture(imageData);
          }
        } else {
          console.error("Generated invalid image data");
          setError("Failed to capture image - invalid image data");
        }
      } else {
        throw new Error("Cannot capture image - video dimensions are invalid");
      }
    } catch (err) {
      console.error('Capture error:', err);
      setError(`Failed to capture image: ${err.message}`);
    } finally {
      setIsCapturing(false);
    }
  };

  // Effect for camera setup
  useEffect(() => {
    startCamera();
    
    // Set up periodic checks for video readiness
    const readyCheckInterval = setInterval(() => {
      if (videoRef.current && 
          videoRef.current.videoWidth > 0 && 
          videoRef.current.videoHeight > 0 && 
          !videoRef.current.paused) {
        console.log("Video is playing with dimensions, marking as ready");
        setCameraReady(true);
        clearInterval(readyCheckInterval);
      }
    }, 500);
    
    return () => {
      clearInterval(readyCheckInterval);
      stopCamera();
    };
  }, []);

  // Effect for camera switching
  useEffect(() => {
    if (isSwitchingCamera) {
      startCamera();
    }
  }, [cameraFacingMode]);

  // Simple Camera Flip icon SVG (used instead of MUI for standalone version)
  const CameraFlipIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5H16.83L15 3H9L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5ZM12 18C9.24 18 7 15.76 7 13C7 10.24 9.24 8 12 8C14.76 8 17 10.24 17 13C17 15.76 14.76 18 12 18Z" fill="black"/>
      <path d="M12 10L10 13H11V16H13V13H14L12 10Z" fill="white"/>
      <path d="M12 16L14 13H13V10H11V13H10L12 16Z" fill="white"/>
    </svg>
  );

  return (
    <div className="camera-modal">
      {error ? (
        <div className="camera-modal__error">
          <CloseIcon 
           className="camera-modal__close-icon" 
           onClick={onClose}
          />

          <h3>Camera Error</h3>
          <p>{error}</p>
          <div className="camera-modal__troubleshooting">
            <h4>Troubleshooting Tips:</h4>
            <ul>
              <li>Make sure you're using HTTPS</li>
              <li>Check that your device has a camera</li>
              <li>Ensure camera permissions are enabled</li>
              <li>Try a different browser</li>
            </ul>
          </div>
          <button 
            className="camera-modal__retry" 
            onClick={startCamera}>
            Retry
          </button>
          
        </div>
      ) : (
        <div className="camera-modal__overlay">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            style={{transform: cameraFacingMode === 'user' ? 'scaleX(-1)' : 'none'}}
            className="camera-modal__video"
            onCanPlay={() => setCameraReady(true)}
          />
          
          <div className="camera-modal__frame">
            <div className="camera-modal__frame-outline"></div>
            <div className="camera-modal__instruction">
              Position document within frame
            </div>
          </div>
          
          <div className="camera-modal__actions">
            {/* Switch Camera Button */}
            <button 
              className="camera-modal__switch-camera"
              onClick={switchCamera}
              disabled={isSwitchingCamera || availableCameras.length < 2}
              title={cameraFacingMode === 'environment' ? 'Switch to front camera' : 'Switch to back camera'}>
              {isSwitchingCamera ? (
                <span className="camera-modal__switch-spinner"></span>
              ) : (
                <CameraFlipIcon />
              )}
            </button>
            
            <button 
              className="camera-modal__close" 
              onClick={() => {
                stopCamera();
                onClose();
              }}>
              ✕
            </button>
          </div>
          
          <button 
            className="camera-modal__capture"
            onClick={() => {
              console.log("Capture button clicked, isCameraReady:", isCameraReady);
              // Allow capture even if isCameraReady is false but video has content
              if (videoRef.current && videoRef.current.videoWidth > 0) {
                captureImage();
              } else {
                console.log("Cannot capture - no video content");
                // Try to restart camera if needed
                if (!isCameraReady) {
                  startCamera();
                }
              }
            }}
            disabled={isCapturing}>
            {isCapturing && <span className="camera-modal__capture-spinner"></span>}
          </button>

          {!isCameraReady && !error && (
            <div className="camera-modal__loading">
              <p>Initializing camera...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraModal;
