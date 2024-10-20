import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MdDeleteSweep } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";

// API URLs (update with your actual URLs)
const API_BASE_URL = '/api/jarvis'; 

const JarvisForm = () => {
  const user = useRecoilValue(userAtom);
  const [jarvisData, setJarvisData] = useState({
    city: '',
    linkedIn_URL: '',
    fb_URL: '',
    customCommands: [],
  });
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const fetchJarvisData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get`, {
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
        setFormVisible(true);
        setLoading(false);
      }
    };

    fetchJarvisData();
  }, [user._id]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newCommands = [...jarvisData.customCommands];
    newCommands[index] = { ...newCommands[index], [name]: value };
    setJarvisData({ ...jarvisData, customCommands: newCommands });
  };

  const handleAddCommand = () => {
    setJarvisData({
      ...jarvisData,
      customCommands: [...jarvisData.customCommands, { commandText: '', url: '' }],
    });
  };

  const handleRemoveCommand = (index) => {
    const newCommands = jarvisData.customCommands.filter((_, i) => i !== index);
    setJarvisData({ ...jarvisData, customCommands: newCommands });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const method = jarvisData._id ? 'PUT' : 'POST';
      const response = await fetch(`${API_BASE_URL}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jarvisData,
          jarvisOwner: user._id,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Success:', result);
      } else {
        console.error('Error submitting Jarvis data:', response.status);
      }
    } catch (error) {
      console.error('Error submitting Jarvis data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-full mx-auto   rounded-lg shadow-lg">
      <h1 className="text-3xl  mb-4 font-extrabold">Jarvis Settings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : formVisible ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={jarvisData.city}
              onChange={(e) => setJarvisData({ ...jarvisData, city: e.target.value })}
              className="w-full p-2 border border-gray-600 rounded bg-transparent text-slate-400"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="linkedIn_URL" className="block text-sm font-medium mb-2">LinkedIn URL</label>
            <input
              type="url"
              id="linkedIn_URL"
              name="linkedIn_URL"
              value={jarvisData.linkedIn_URL}
              onChange={(e) => setJarvisData({ ...jarvisData, linkedIn_URL: e.target.value })}
              className="w-full p-2 border border-gray-600 rounded bg-transparent text-slate-400"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="fb_URL" className="block text-sm font-medium mb-2 ">Facebook URL</label>
            <input
              type="url"
              id="fb_URL"
              name="fb_URL"
              value={jarvisData.fb_URL}
              onChange={(e) => setJarvisData({ ...jarvisData, fb_URL: e.target.value })}
              className="w-full p-2 border border-gray-600 rounded bg-transparent text-slate-400"
              required
            />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
            <label className="block text-2xl font-extrabold mb-2">Custom Commands</label>
            <button
              type="button"
              onClick={handleAddCommand}
              className="bg-black/60 text-white w-10 h-10 rounded-full flex justify-center items-center hover:bg-black "
            > <IoAddOutline  className='text-xl font-extrabold' />
            </button>
            </div>
            {jarvisData.customCommands && jarvisData.customCommands.map((command, index) => (
              <motion.div
                key={index}
                className="mb-2 p-4 border border-gray-600 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <input
                  type="text"
                  name="commandText"
                  value={command.commandText}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="Command Text"
                  className="w-full p-2 border border-gray-600 rounded mb-2 bg-transparent"
                  required
                />
                <input
                  type="url"
                  name="url"
                  value={command.url}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="URL"
                  className="w-full p-2 border border-gray-600 rounded bg-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCommand(index)}
                  className="text-red-500 mt-2 bg-black/60 py-2 px-4 rounded-lg font-bold"
                > <MdDeleteSweep/>
                </button>
              </motion.div>
            ))}
          </div>
          <div className="flex  justify-between">
          <button
            type="submit"
            className=" bg-[rgba(0,0,100,0.7)] text-white px-4 py-2 rounded hover:bg-black font-semibold"
          >
            {jarvisData._id ? 'Update' : 'Create'} Entries
          </button>
          <Link  to='/jarvis'  className='bg-black/60 text-white px-4 py-2 rounded hover:bg-black font-semibold' >Open Jarvis</Link>
          </div>
        </form>
      ) : (
        <p>No Jarvis data found. Please add details.</p>
      )}
    </div>
  );
};

export default JarvisForm;
