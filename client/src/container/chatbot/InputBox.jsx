import React, { useState, useEffect, useRef } from "react";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { useTranscribeAudioMutation } from "../../state/speechApi";

import MainCameraModal from "./MainCameraModal";
import "./chatbot.css";



const InputBox = ({ handleSend, isProcessing }) => {
  const [input, setInput] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false); // New state for transcription progress
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [transcribeAudio] = useTranscribeAudioMutation();

  const handleUserInput = () => {
    handleSend(input, input);
    setInput(""); // Clear input after sending
  };

  const toggleListening = async () => {
    if (isListening) {
      console.log("Stopping recording...");

      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
      setIsTranscribing(true); // Start transcription process
    } else {
      try {
        console.log("Requesting microphone access...");

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 48000, // 🔹 Force correct sample rate
            channelCount: 1, // Use mono audio to improve recognition
          },
        });
        console.log("Microphone access granted");

        setIsListening(true);

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          console.log("Data available event, data size:", event.data.size);
          audioChunksRef.current.push(event.data);
          console.log("Audio chunk added, total chunks:", audioChunksRef.current.length);
        };

        mediaRecorder.onstop = async () => {
          console.log("MediaRecorder stopped");

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log("Audio blob created, size:", audioBlob.size, "bytes, type:", audioBlob.type);

          const formData = new FormData();
          formData.append('audio', audioBlob);

          try {
            console.log("Sending audio to backend for transcription...");

            const response = await transcribeAudio(formData).unwrap();
            console.log("Transcription response received:", response);

            if (response.transcript) {
              // Append to existing text or replace it based on your needs
              setInput((prev) => prev + ' ' + response.transcript.trim());
            }
          } catch (error) {
            console.error('Speech recognition error:', error);
          } finally {
            setIsTranscribing(false); // End transcription process
          }

          // Close all tracks to properly release the microphone
          stream.getTracks().forEach((track) => track.stop());
        };

        // Start recording
        mediaRecorder.start();
      } catch (error) {
        console.error("Microphone access error:", error);
        alert("Please allow microphone access to use voice input");
      }
    }
  };

  const inputRef = useRef(null);


  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "54px"; // Reset to base height
      const scrollHeight = textarea.scrollHeight; // Get the scroll height
      const bufferSpace = 10; // Add buffer space
      textarea.style.height = `${scrollHeight + bufferSpace}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]); // Trigger whenever `input` changes

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };





  return (
    <div className="input-box">
      <textarea
        className={`input-box__input ${isTranscribing ? "input-box__input--loading" : ""}`}
        value={isTranscribing ? "" : input} // Clear input during transcription
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleUserInput(e)}
        placeholder={isTranscribing ? "Getting text. Please wait..." : isListening ? "Listening..." : "Type a message..."}
        disabled={isProcessing || isTranscribing} // Disable during processing or transcription
        rows={1} // Default rows, auto-expands
        ref={inputRef}
      />

      {/* Mic Button inside Input Box */}
      <button
        className={`input-box__mic ${isListening ? "input-box__mic--active" : ""}`}
        onClick={toggleListening}
        disabled={isProcessing || isTranscribing} // Disable during processing or transcription
        aria-label={isListening ? "Stop recording" : "Start recording"}
      >
        {isListening ? <MicIcon /> : <MicOffIcon />}
      </button>

      {/* Send Button inline */}
      <button
        className="input-box__send"
        onClick={handleUserInput}
        disabled={isProcessing || isTranscribing} // Disable during processing or transcription
      >
        <SendIcon />
      </button>

      {/* Floating Camera Button */}
      <button
        className="input-box__camera-floating"
        onClick={() => setShowCamera(true)}
        disabled={isProcessing || isTranscribing} // Disable during processing or transcription
      >
        <CameraIcon />
      </button>

      {showCamera && <MainCameraModal onClose={() => setShowCamera(false)} />}
    </div>
  );
};


export default InputBox;