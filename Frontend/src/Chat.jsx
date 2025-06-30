import React, { useState, useEffect } from 'react';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
   function Chat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setGenerated] = useState(false);
  const [error, setError] = useState(null);
    const [isActive, setIsActive] = useState(false);
  const [responsenew, setResponsenew] = useState('');
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState(null);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Check for HTTPS and microphone permissions on component mount
  useEffect(() => {
    const checkMicrophoneSupport = async () => {
      // Check if we're in a secure context (HTTPS or localhost)
      if (!window.isSecureContext && window.location.hostname !== 'localhost') {
        setMicError("Microphone requires HTTPS connection");
        return;
      }

      // Check if browser supports speech recognition
      if (!browserSupportsSpeechRecognition) {
        setMicError("Your browser doesn't support speech recognition. Try Chrome, Edge, or Safari.");
        return;
      }

      // Check if SpeechRecognition is available
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setMicError("Speech recognition not available in this browser");
        return;
      }

      // Check microphone permissions
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop the stream immediately as we just needed to check permissions
          stream.getTracks().forEach(track => track.stop());
          setMicError(null);
        } else {
          setMicError("Microphone access not supported in this browser");
        }
      } catch (err) {
        console.error('Microphone permission error:', err);
        if (err.name === 'NotAllowedError') {
          setMicError("Microphone access denied. Please allow microphone permissions and refresh the page.");
        } else if (err.name === 'NotFoundError') {
          setMicError("No microphone found. Please connect a microphone.");
        } else {
          setMicError("Unable to access microphone. Please check your browser settings.");
        }
      }
    };

    checkMicrophoneSupport();
  }, [browserSupportsSpeechRecognition]);

    const formatText = (text) => {
  return text.replace(/\*/g, '');
  };

  const startListening = async () => {
    // If microphone is currently active, stop it
    if (micActive) {
      SpeechRecognition.stopListening();
      setMicActive(false);
      return;
    }

    // Check for errors before starting
    if (micError) {
      alert(micError);
      return;
    }

    try {
      resetTranscript();
      setMicActive(true);
      await SpeechRecognition.startListening({
        continuous: false,
        language: 'en-US'
      });
    } catch (err) {
      console.error('Speech recognition error:', err);
      setMicActive(false);
      setMicError("Failed to start speech recognition. Please try again.");
    }
  };

   React.useEffect(() => {
    if (!listening && transcript) {
       setMessage(transcript);
       setMicActive(false);
    }
  }, [listening, transcript]);

  // Handle speech recognition errors
  React.useEffect(() => {
    const handleSpeechError = (event) => {
      console.error('Speech recognition error:', event.error);
      setMicActive(false);

      switch(event.error) {
        case 'no-speech':
          setMicError("No speech detected. Please try again.");
          break;
        case 'audio-capture':
          setMicError("Microphone not accessible. Please check your microphone.");
          break;
        case 'not-allowed':
          setMicError("Microphone access denied. Please allow microphone permissions.");
          break;
        case 'network':
          setMicError("Network error. Please check your internet connection.");
          break;
        default:
          setMicError("Speech recognition failed. Please try again.");
      }
    };

    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.onError = handleSpeechError;
    }

    return () => {
      if (browserSupportsSpeechRecognition) {
        SpeechRecognition.onError = null;
      }
    };
  }, [browserSupportsSpeechRecognition]);

  // Show error message if speech recognition is not supported
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="chatM">
        <div className="cht">
          <p className="qu">
            <i className="fa-solid fa-circle-question"></i> Ask any DSA question
          </p>
          <div style={{padding: '20px', textAlign: 'center', color: '#ff4d4d'}}>
            Your browser does not support speech recognition. Please use a modern browser like Chrome, Edge, or Safari.
          </div>
        </div>
      </div>
    );
  }






  const handlechat = async () => {
 
    // e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a message');
      alert("Please enter a message!");
      return;
    }
    if(isGenerated)
{
   setGenerated(false);
 setIsLoading(true);

}
else{
   setIsLoading(true);
}
   

    setError(null);

    try {
      // First test the connection
      const testResponse = await fetch('https://algo-tutor-ai-powered-dsa-instructo.vercel.app/api/test');
      if (!testResponse.ok) {
        throw new Error('Cannot connect to server');
      }

      // Send the actual message
      const result = await fetch('https://algo-tutor-ai-powered-dsa-instructo.vercel.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: message.trim() 
        }),
      });

      const data = await result.json();
      setGenerated(true);
      if (!result.ok) {
        throw new Error(data.error || 'Request failed');
      }
// alert(data.response);
const formated= formatText(data.response);
// console.log(data.response);
console.log(formated);
      setResponse(formated);
      setResponsenew(formated);
      // setResponse(data.response);
      // setResponsenew(data.response);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }

};


  const chunkSize = 3; // Number of characters per chunk
  const chunkDelay = 50; // Delay in ms between chunks
 
  // Call this function to start the typewriter effect
  function startTypewriter() {
    setResponse(""); // Clear previous text
    let i = 0;
   setResponse(prev => prev + responsenew.substring(0, 3));
    function typeChunk() {
      if (i < responsenew.length) {
        
        setResponse(prev => prev + responsenew.substring(i, i + chunkSize));
    
        i += chunkSize;
        setTimeout(typeChunk, chunkDelay);
      }
    }

    typeChunk();
  }

  // Example: call startTypewriter when isGenerated becomes true
  React.useEffect(() => {
    if (isGenerated) {
      startTypewriter();
    }
  }, [isGenerated, responsenew]);


return(
    <>
    <div className="chatM">
        <div className="cht">
        <p className="qu"> <i className="fa-solid fa-circle-question"> </i>    Ask any DSA question</p>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="txtarea" placeholder="What is Stack?" rows={12} cols={90}></textarea>
        <button disabled={isLoading} onClick={handlechat} className="bt"><img className="plimg" src="/paper-plane.png" alt='plane'></img>
    Ask DSA Instructor </button>

        {/* Microphone button with error handling */}
        <button
          className={`mic${micActive ? " active" : ""}${micError ? " error" : ""}`}
          onClick={startListening}
          disabled={!!micError}
          title={micError || (micActive ? "Stop recording" : "Start voice input")}
        >
          <i className={micError ? "fa-solid fa-microphone-slash" : "fa-solid fa-microphone"}></i>
        </button>

        {/* Show microphone error message */}
        {micError && (
          <div className="mic-error" style={{
            position: 'absolute',
            right: '60px',
            bottom: '540px',
            background: '#ff4d4d',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            maxWidth: '200px',
            zIndex: 1000
          }}>
            {micError}
          </div>
        )}
        <div className="res">
        <h3 className='rest'><i  class="fa-solid fa-graduation-cap"></i> Instructor's Response</h3>
            <div className={isLoading ? "load":"hidden"}>
                <div className="loada"></div>
                <h3 className="loadt">Evaluating your query and preparing the optimal explanation.</h3>
            </div>
       <textarea  value={response}  className={isGenerated ? "con":"hidden"} placeholder="">
      
       </textarea>
        </div>
        
        </div>

    </div>
     
    </>


);
}
export default Chat