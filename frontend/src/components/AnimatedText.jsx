import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "Welcome to Mystaria",
  "the largest community"
];

const AnimatedText = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessage, setDisplayedMessage] = useState(messages[0]);
  const [animationCount, setAnimationCount] = useState(0);

  useEffect(() => {
    if (animationCount < 2) {
      const intervalId = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setAnimationCount((prevCount) => prevCount + 1);
      }, 6000); // 6 seconds for each message (adjust as needed)

      return () => clearInterval(intervalId);
    }
  }, [animationCount]);

  useEffect(() => {
    setDisplayedMessage(messages[currentMessageIndex]);
  }, [currentMessageIndex]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 200,
      },
    },
  };

  const exitVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 0, transition: { duration: 2 } },
  };

  return (
    <div className="flex justify-center items-center h-[20vh] w-[25vw] overflow-hidden absolute top-[60vh]">
      <AnimatePresence>
        {animationCount < 2 && (
          <motion.div
            key={currentMessageIndex}
            className="text-center text-2xl font-extrabold text-gray-500"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={exitVariants}
          >
            <motion.div
              className="inline-block"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {displayedMessage.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  style={{ color: `hsl(${(index * 10) % 360}, 100%, 50%)` }} // subtle color change effect
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedText;
