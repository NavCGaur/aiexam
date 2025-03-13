import React, { useRef, useState , useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../state/chatbotSlice"; 
import { useSendMessageMutation } from "../../state/chatbotApi"; 

import { CircularProgress } from "@mui/material"; 

import { Cropper } from "react-cropper";
import './CroppingInterface.css';
import { useExtractTextMutation } from "../../state/ocrApi";

const CroppingInterface = ({ image, onTextExtracted, onRetake, onClose }) => {
  const cropperRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [noTextDetected, setNoTextDetected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const messages = useSelector((state) => state.chatbot.messages);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.chatbot.userId);
  const [sendMessage] = useSendMessageMutation();
  const [extractText] = useExtractTextMutation();

  // Function to crop image 
  const handleCropButtonClick = async () => {
    if (!cropperRef.current) return;

    setIsProcessing(true);
    try {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (!croppedCanvas) throw new Error("Failed to get cropped canvas.");

      const croppedImageDataUrl = croppedCanvas.toDataURL("image/png");

      // Convert Base64 to File
      const blob = await fetch(croppedImageDataUrl).then((res) => res.blob());
      const file = new File([blob], "cropped-image.png", { type: "image/png" });

      // Send file to backend OCR API
      const formData = new FormData();
      formData.append("image", file);

      console.log("sending file to backend");
      const response = await extractText(formData);

      console.log("extracted text: ", response);
      
      if (response.data.text === "No text detected. Please try another image.") {
        setNoTextDetected(true);
        setExtractedText(response.data.text); // Show message in review container
      } else {
        setNoTextDetected(false);
        setExtractedText(response.data.text);
      }
  
      setIsEditing(true); // Ensure text review container is always shown
      
    } catch (error) {
      console.error("Error in image processing:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle text submission
  const handleSubmitToAI = async () => {
    if (!extractedText.trim()) return;
    
    setIsSubmitting(true); // Show loading indicator

    const formattedMessage = `OCR Question: ${extractedText}`;

    dispatch(addMessage({ text: extractedText, sender: "user" })); // Show user message

    try {
      const response = await sendMessage({
        userId,
        messages: [...messages, { text: formattedMessage, sender: "user" }]
      }).unwrap();

      console.log("Chatbot response:", response);

      dispatch(addMessage({ text: response.reply, sender: "bot" }));

    } catch (err) {
      console.error("Error sending message:", err);
      dispatch(addMessage({ text: "Error: Unable to get response.", sender: "bot" }));
    } finally {
      setIsSubmitting(false);
      onClose(); // Close cropping interface **only after** processing
    }
  };




  const inputRef = useRef(null);
    
    const adjustTextareaHeight = () => {
      const textarea = inputRef.current;
      if (textarea) {
        textarea.style.height = "auto"; 
        const scrollHeight = textarea.scrollHeight; // Get the scroll height
        const bufferSpace = 30; // Add buffer space
        textarea.style.height = `${scrollHeight + bufferSpace}px`;
      }
    };
  
    useEffect(() => {
      adjustTextareaHeight();
    }, [extractedText]); // Trigger whenever `extractedText` changes
  
    const handleInputChange = (e) => {
      setExtractedText(e.target.value); // Update extractedText state
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
            aspectRatio={NaN}
            viewMode={0} /* More flexibility */
            dragMode="crop" /* Improves touch interactions */
            guides={false}
            scalable={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            background={false}
            responsive={true}
            checkOrientation={false} /* Avoids rotation issues on mobile */

          />

          </div>
          <div className="crop-actions">
            <button onClick={onClose} disabled={isProcessing} className="cancel-button">
              Cancel</button>
              
            <button onClick={handleCropButtonClick} disabled={isProcessing} className="crop-button">
              {isProcessing ? "Processing..." : "Crop"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-review-container">
          <div className={`text-review ${isSubmitting ? "loading" : ""}`}>
            <textarea
              value={extractedText}
              onChange={handleInputChange}

              placeholder="Edit the extracted text..."
              rows={1} // Default rows, auto-expands

              disabled={isProcessing} // Prevent editing while loading
              ref={inputRef}

              style={{
                overflow: "hidden", // Hide scrollbar
                resize: "none", // Disable manual resizing by the user
                fontFamily:"Sans-serif",
                fontSize:"16px",  
                lineHeight  :"1.5",
                letterSpacing:"0.7px",
              }}
            />

            <div className="crop-actions">
              <button className= "crop-actions-retake" onClick={onRetake} disabled={isSubmitting}>
                ReTake
              </button>
              <button className= "crop-actions-submittoAi" onClick={handleSubmitToAI} disabled={isSubmitting||noTextDetected}>
                Submit to AI
              </button>
            </div>
        </div>
      
        {/* Loading Indicator (Overlayed) */}
        {isSubmitting && (
          <div className="loading-overlay">
            <CircularProgress size={80} style={{ color: "rgba(0, 0, 0, 0.5)" }} />
          </div>
        )}
      </div>
      
      )}
    </div>
  );
};

export default CroppingInterface;
