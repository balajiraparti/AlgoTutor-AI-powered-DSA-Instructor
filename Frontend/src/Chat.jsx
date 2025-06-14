import React, { useState } from 'react';



   function Chat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setGenerated] = useState(false);
  const [error, setError] = useState(null);
  const [responsenew, setResponsenew] = useState('');
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
console.log(data.response);
      setResponse(data.response);
      setResponsenew(data.response);
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