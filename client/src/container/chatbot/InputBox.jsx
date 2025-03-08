import React, { useState, useRef } from "react";
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
      } else {
        try {
          console.log("Requesting microphone access...");

          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              sampleRate: 48000, // 🔹 Force correct sample rate
              channelCount: 1, // Use mono audio to improve recognition
            }
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

            
            // For debugging - create an audio element to verify recording
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log("Created audio URL for debugging:", audioUrl);
            
            
                // Ensure proper playback using an audio element
                const audioElement = document.createElement("audio");
                audioElement.src = audioUrl;
                audioElement.controls = true;
                document.body.appendChild(audioElement);
                
                // 🔹 Force metadata loading before playback
                audioElement.onloadedmetadata = () => {
                  console.log("Metadata loaded. Duration:", audioElement.duration);
                  if (audioElement.duration === Infinity) {
                    console.log("Duration is still Infinity, retrying...");
                    setTimeout(() => {
                      console.log("Updated duration:", audioElement.duration);
                    }, 1000);
                  }
                };
              
                try {
                  await audioElement.play();
                  console.log("Audio is playing");
                } catch (err) {
                  console.error("Playback failed:", err);
                }
              
                // 🔹 Provide Download Option
                const downloadLink = document.createElement("a");
                downloadLink.href = audioUrl;
                downloadLink.download = "recorded_audio.webm";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                console.log("Audio downloaded for debugging.");
              


            const formData = new FormData();
            formData.append('audio', audioBlob);
            
            try {

              console.log("Sending audio to backend for transcription...");

              const response = await transcribeAudio(formData).unwrap();

              console.log("Transcription response received:", response);

              if (response.transcript) {
                // Append to existing text or replace it based on your needs
                setInput(prev => prev + ' ' + response.transcript.trim());
              }
            } catch (error) {
              console.error('Speech recognition error:', error);
            }
            
            // Close all tracks to properly release the microphone
            stream.getTracks().forEach(track => track.stop());
          };
          
          // Start recording
          mediaRecorder.start();
        } catch (error) {
          console.error("Microphone access error:", error);
          alert("Please allow microphone access to use voice input");
        }
      }
    };

    return (
      <div className="input-box">
        <input
          className="input-box__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUserInput()}
          placeholder={isListening ? "Listening..." : "Type a message..."}
          disabled={isProcessing}
        />
    
        {/* Mic Button inside Input Box */}
        <button
          className={`input-box__mic ${isListening ? "input-box__mic--active" : ""}`}
          onClick={toggleListening}
          disabled={isProcessing}
          aria-label={isListening ? "Stop recording" : "Start recording"}
        >
        {isListening ? <MicIcon /> : <MicOffIcon />}
        </button>
    
        {/* Send Button inline */}
        <button 
          className="input-box__send" 
          onClick={handleUserInput}
          disabled={isProcessing}
        >
          <SendIcon />
        </button>
    
        {/* Floating Camera Button */}
        <button
          className="input-box__camera-floating"
          onClick={() => setShowCamera(true)}
          disabled={isProcessing}
        >
          <CameraIcon />
        </button>
    
        {showCamera && (
          <MainCameraModal onClose={() => setShowCamera(false)} />
        )}
      </div>
    );
    
    
};


export default InputBox;