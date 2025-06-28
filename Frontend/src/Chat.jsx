import React, { useState } from 'react';

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
    const [isSupported, setIsSupported] = useState(true);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
//   useEffect(() => {
//    navigator.mediaDevices.getUserMedia({ audio: true });
//  }, []);
  if(!isSupported){

    alert("microphone isn't supported!");
  }
    const formatText = (text) => {
  return text.replace(/\*/g, '');
  };
//     
  const startListening = () => {
       setMicActive((prev) => !prev);
    resetTranscript(); // Optional: Clear previous transcript
    SpeechRecognition.startListening({ continuous: false});
    if(micActive)
    {
         SpeechRecognition.stopListening();
        setMicActive(false);
    }
  };
  
   React.useEffect(() => {
    if (!listening && transcript) {
       setMessage(transcript);
       setMicActive(false);
    
    }
  }, [listening, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }






  const handlechat = async (e) => {
 
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
        <p className="qu"> <i  class="fa-solid fa-circle-question"> </i>    Ask any DSA question</p>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="txtarea" placeholder="What is Stack?" rows={12} cols={90}></textarea>
        <button disabled={isLoading} onClick={handlechat} className="bt"><img className="plimg" src="/paper-plane.png"></img> 
    Ask DSA Instructor </button>
<button className={`mic${micActive ? " active" : ""}`} onClick={startListening}><i class="fa-solid fa-microphone"></i>  </button>
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