import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes } from 'react-icons/fa';
import Chatbot from './Chatbot';

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <motion.button
          onClick={toggleChat}
          className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 ${
            isChatOpen 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isChatOpen ? 'Close chat' : 'Open healthcare assistant'}
        >
          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimes className="text-xl" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaComments className="text-xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notification dot for new features */}
        {!isChatOpen && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </motion.div>
        )}

        {/* Pulse animation ring */}
        {!isChatOpen && (
          <motion.div
            className="absolute inset-0 bg-blue-600 rounded-full opacity-75"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.75, 0, 0.75]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        )}
      </motion.div>

      {/* Chatbot Component */}
      <AnimatePresence>
        {isChatOpen && (
          <Chatbot 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatButton;