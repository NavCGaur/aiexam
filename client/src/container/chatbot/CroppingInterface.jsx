import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, toggleChatbot } from "../../state/chatbotSlice"; 
import { useSendMessageMutation } from "../../state/chatbotApi"; 


import { Cropper } from "react-cropper";
import './CroppingInterface.css';
import { useExtractTextMutation } from "../../state/ocrApi";

const CroppingInterface = ({ image, onTextExtracted, onClose }) => {
  const cropperRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.chatbot.userId); // Get userId from Redux
  const [sendMessage] = useSendMessageMutation(); // Hook for sending message

  const [extractText] = useExtractTextMutation();


  // Function to crop image 
  const handleCropButtonClick = async () => {
    if (!cropperRef.current) return;
  
    setIsProcessing(true);
    try {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (!croppedCanvas) throw new Error("Failed to get cropped canvas.");
  
      const croppedImageDataUrl = croppedCanvas.toDataURL("image/png");
      console.log("Cropped Image:", croppedImageDataUrl);
  
      // Convert Base64 to File (Multer expects a file)
      const blob = await fetch(croppedImageDataUrl).then((res) => res.blob());
      const file = new File([blob], "cropped-image.png", { type: "image/png" });
  
      // Send file to backend OCR API
      const formData = new FormData();
      formData.append("image", file);

      console.log("sending file to backend")
      const response = await extractText(formData);
  
      console.log("extracted text: ",response)
      setExtractedText(response.data.text);
      setIsEditing(true);
    } catch (error) {
      console.error("Error in image processing:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle text submission
  const handleSubmitToAI = () => {
    if (!extractedText.trim()) return;

    const formattedMessage = `OCR Question: ${extractedText}`;

    // Send extracted text to ChatbotUI
    dispatch(addMessage({ text: extractedText, sender: "user" })); 
    
    // Open Chatbot UI
    dispatch(toggleChatbot());

    // Send to backend
    dispatch(sendMessage({ userId, messages: [{ text: formattedMessage, sender: "user" }] }));

    onClose(); // Close CroppingInterface
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
            <button onClick={handleSubmitToAI}>Submit to Ai</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CroppingInterface;
