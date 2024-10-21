import React, { useState, useEffect, useRef } from 'react';
import { BsSend } from 'react-icons/bs';


const commands = {
  "how are you": "I am fine sir, how are you",
  "who are you": 'Hello Friend, I am ai offered by Mystaria. How can I assist you today?',
  "hello": 'Hello! How can I assist you today?',
  "hi": 'Hi! How can I assist you today?',
  "what is mystaria": 'Mystaria is a website buid by Waleed Ahmad',
  "thank you": 'Hey listen , you are my brother, dont say it again🥰',
  "who is waleed": 'waleed is my brother🥰',
  "open linkedin": () => {
    window.open('https://www.linkedin.com', '_blank');
    return 'Opening LinkedIn';
  },
};

const Mystaria = ({ detailed = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typingData, setTypingData] = useState(''); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);


  const typeEffect = (text, callback) => {
    const typingSpeed = 10; 
    let index = 0;
    const type = () => {
      if (index < text.length) {
        setTypingData((prev) => prev + text.charAt(index));
        index++;
        setTimeout(() => {
          type();
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, typingSpeed);
      } else {
        callback();
      }
    };
    type();
  };

  const fetchData = async () => {
    setLoading(true);
    try {

      const commandResponse = commands[searchTerm.toLowerCase()];
      if (commandResponse) {

        typeEffect(commandResponse, () => {
          setChatHistory((prev) => [
            ...prev,
            { type: 'response', text: commandResponse },
          ]);
          setTypingData(''); 
        });
        setLoading(false);
        return;
      }
  
      
      const url = detailed
        ? `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=${encodeURIComponent(
            searchTerm
          )}&redirects=1&origin=*`
        : `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=${encodeURIComponent(
            searchTerm
          )}&redirects=1&origin=*&exintro`;
  
      const response = await fetch(url);
      const result = await response.json();
  
      const pages = result.query.pages;
      const pageId = Object.keys(pages)[0];
  
      let chatResponse;
      if (pageId !== '-1') {
        const page = pages[pageId];
        chatResponse = page.extract
          ? page.extract
          : 'No content available for this page.';
      } else {
        chatResponse = 'No results found.';
      }
  
      const sanitizedResponse = chatResponse.replace(/p class="mw-empty-elt">/gi, '');
  

      const maxChars = 400;
      const truncatedResponse = sanitizedResponse.slice(0, maxChars);
  
 
      typeEffect(truncatedResponse, () => {
        setChatHistory((prev) => [
          ...prev,
          { type: 'response', text: truncatedResponse },
        ]);
        setTypingData(''); 
      });
  
      setError(null);
    } catch (error) {
      setTypingData('An error occurred while fetching data.');
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      setChatHistory((prev) => [...prev, { type: 'user', text: searchTerm }]);
      setTypingData(''); 
      fetchData();
      setSearchTerm('');
    }
  };

  return (
    <div className="flex flex-col h-[80vh]  text-white">
      <img src="./mystaria.jpeg" alt=""  className='w-[200px] h-[200px] rounded-full object-cover absolute top-40 left-[45vw] opacity-40 ' />
      <div className="flex-grow p-4 overflow-y-auto scrollbar">
        <div className="flex flex-col space-y-4">
        {chatHistory.map((chat, index) => {

  let cleanedText = chat.text.trim();

  if (cleanedText.startsWith('<') ) {
    cleanedText = cleanedText.slice(1).trim(); // Remove '<' and trim again to remove any resulting leading spaces
  }

  return (
    <div
      key={index}
      className={`max-w-lg px-3 py-2 rounded-md ${
        chat.type === 'user'
          ? 'bg-gray-700 text-white self-end'
          : 'bg-black text-white self-start'
      }`}
    >
      <div
        dangerouslySetInnerHTML={{ __html: cleanedText }}
        className="whitespace-pre-wrap"
      />
    </div>
  );
})}
          {loading && (
            <div className="self-start flex items-center space-x-2">
              <div className="dot-typing"></div>
              <div className="dot-typing"></div>
              <div className="dot-typing"></div>
            </div>
          )}
          {typingData && (
            <div
              className={`max-w-lg p-3 rounded-md bg-gray-900 text-white self-start`}
            >
              <div dangerouslySetInnerHTML={{ __html: typingData }} />
            </div>
          )}
          <div ref={chatEndRef} /> 
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-4 pr-8 flex justify-between">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type a message..."
          className="w-full text-gray-400 p-2 rounded-md bg-transparent  focus:outline-none "
        />
        <button
          type="submit"
          className="md:hidden text-gray-400 px-4 py-2 rounded-lg"
        >
          <BsSend/>
        </button>
      </form>
    </div>
  );
};

export default Mystaria;
