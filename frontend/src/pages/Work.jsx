import React, { useState } from 'react';
import useCommands from '../useCommands';

const Work = () => {
  const [status, setStatus] = useState('');
  const commands = useCommands();

  const handleStartListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    setStatus('Listening...');

    recognition.onresult = async (event) => {
      let transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Transcript:', transcript);

      if (transcript.startsWith('jarvis')) {
        transcript = transcript.replace(/^jarvis\s*/, '').trim();
      }

      const responseFunction = commands[transcript];
      if (responseFunction) {
        const responseMessage = await responseFunction();
        updateStatus(responseMessage);
      } else {
        updateStatus('This command is not supported');
      }
    };

    recognition.onerror = () => {
      updateStatus('Error occurred while listening.');
    };

    recognition.onend = () => {
      console.log('Speech recognition ended.');
    };
  };

  const speak = (message) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const updateStatus = async (message) => {
    console.log('Updating status:', message);
    setStatus(message);
    await speak(message);
    setStatus('');
  };

  return (
    <div className="flex flex-col  bg-black rounded-lg text-white font-sans">
      <div className="text-center py-10">
        <div className="max-w-lg mx-auto mt-4 flex justify-center">
          <img src="https://cdn.dribbble.com/users/1907563/screenshots/6470979/loader_sci-fi.gif" alt="jarvis" className="w-[300px] h-auto " />
        </div>
        <button onClick={handleStartListening} className="mt-4 px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-700">Start Listening</button>
        <div id="status" className="mt-4 text-lg text-slate-300">{status}</div>
      </div>
    </div>
  );
};

export default Work;
