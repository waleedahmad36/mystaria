import { getWeather } from './weather.js'; // Adjust the path if needed
import { getRandomJoke } from './jokes.js';
import { getRandomFact } from './randomFacts.js';
import { useEffect, useState } from 'react';
import userAtom from './atoms/userAtom.js';
import { useRecoilValue } from 'recoil';
import { useSocket } from './context/SocketContext.jsx';
import useLogout from './hooks/useLogout.js';

const useCommands = () => {
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const [jarvisData, setJarvisData] = useState({
    city: '',
    linkedIn_URL: '',
    fb_URL: '',
    customCommands: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJarvisData = async () => {
      try {
        const response = await fetch(`/api/jarvis/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jarvisOwner: user._id }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setJarvisData(data);
          }
        } else {
          console.error('Error fetching Jarvis data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching Jarvis data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJarvisData();
  }, [user._id]);

  // Define static commands
  const staticCommands = {
    "who are you": () => 'Hello Friend, I am Jarvis. How can I assist you today?',
    "what is yourname": () => 'Hello Friend, I am Jarvis. How can I assist you today?',
    "hello": () => 'Hello! How can I assist you today?',
    "hello jarvis": () => 'Hello! How can I assist you today?',
    "hi": () => 'Hi! How can I assist you today?',
    "open youtube": () => {
        window.open('https://www.youtube.com', '_blank');
        return 'Opening YouTube';
    },
    "open home page": () => {
        window.open('http://localhost:3000', '_blank');
        return 'Opening HomePage';
    },
    "open linkedin": () => {
        window.open('https://www.linkedin.com', '_blank');
        return 'Opening LinkedIn';
    },
    "who is active member": () => {
        return `Currently logged in person is ${user.username}`;
    },
    "open my linkedin profile": () => {
        window.open(jarvisData.linkedIn_URL, '_blank');
        return 'Opening your LinkedIn profile';
    },
    "open profile": () => {
        window.open(`https://mystaria.onrender.com/${user.username}`, '_blank');
        return 'Opening your Mystaria profile';
    },
    "what you know about me":()=>{
      return `Sir your logged in account name is ${user.name} and username is ${user.username} and your email is ${user.email}`
    },
    "open google": () => {
        window.open('https://www.google.com', '_blank');
        return 'Opening Google';
    },
    "open facebook": () => {
        window.open('https://www.facebook.com', '_blank');
        return 'Opening Facebook';
    },
    "open wikipedia": () => {
        window.open('https://www.wikipedia.org', '_blank');
        return 'Opening Wikipedia';
    },
    "what's the weather": async () => await getWeather(),
    "tell me a joke": async () => await getRandomJoke(),
    "tell me a random fact": async () => await getRandomFact(),
    "what time is it": () => {
        const currentTime = new Date().toLocaleTimeString();
        return `The current time is ${currentTime}.`;
    },
    "logout": () => {
        logout();
        return `You are logged out sir.`;
    },
  };

  // Dynamically add custom commands
  const dynamicCommands = jarvisData.customCommands.reduce((acc, command) => {
    acc[command.commandText.toLowerCase()] = () => {
      window.open(command.url, '_blank');
      return `Opening ${command.commandText}`;
    };
    return acc;
  }, {});

  
  const commands = { ...staticCommands, ...dynamicCommands };

  return commands;
};

export default useCommands;
