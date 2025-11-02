import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPaperPlane, 
  FaRobot, 
  FaUser, 
  FaTrash,
  FaDownload,
  FaSpinner,
  FaExclamationTriangle,
  FaLightbulb,
  FaArrowLeft,
  FaCopy,
  FaCheck,
  FaArrowCircleLeft
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import chatService from '../utils/chatService';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionInfo, setSessionInfo] = useState({ isActive: false });
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session
  useEffect(() => {
    initializeChat();
    
    // Focus input on load
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await chatService.startChatSession();
      
      if (response.success) {
        setSessionInfo(chatService.getSessionInfo());
        
        // Add welcome message
        const welcomeMessage = {
          id: Date.now(),
          type: 'bot',
          message: response.data.welcomeMessage,
          timestamp: new Date().toISOString()
        };
        
        setMessages([welcomeMessage]);
        setShowSuggestions(true);
        console.log('Chat initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setError('Failed to start chat session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const response = await chatService.sendMessage(userMessage.message);
      
      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: response.data.botResponse,
          timestamp: response.data.timestamp
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError(error.message);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        message: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const clearChat = () => {
    setMessages([]);
    chatService.clearHistory();
    setShowSuggestions(true);
    setError(null);
    
    // Re-add welcome message
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      message: 'Welcome to Healthcare Assistant! How can I help you today?',
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  };

  const exportChat = () => {
    const conversation = chatService.exportConversation();
    const dataStr = JSON.stringify(conversation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthcare-chat-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const copyMessage = async (message) => {
    try {
      await navigator.clipboard.writeText(message.message);
      setCopiedMessageId(message.id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const retryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find(msg => msg.type === 'user');
    if (lastUserMessage) {
      setInputMessage(lastUserMessage.message);
      setError(null);
    }
  };

  const refreshChat = () => {
    chatService.endChatSession();
    setMessages([]);
    setError(null);
    initializeChat();
  };

  const suggestions = chatService.getSuggestedPrompts();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Go back"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <FaRobot className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Healthcare Assistant</h1>
                <p className="text-sm text-gray-600">
                  {sessionInfo.isActive ? 'Online' : 'Connecting...'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshChat}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Refresh chat"
            >
              <FaArrowCircleLeft className="text-gray-600" />
            </button>
            
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear chat"
            >
              <FaTrash className="text-gray-600" />
            </button>
            
            <button
              onClick={exportChat}
              disabled={messages.length === 0}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export chat"
            >
              <FaDownload className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl px-6 py-4 relative group ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white ml-12'
                      : message.type === 'error'
                      ? 'bg-red-50 text-red-800 border border-red-200 mr-12'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm mr-12'
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {message.type === 'user' ? (
                        <FaUser className="text-sm opacity-70" />
                      ) : message.type === 'error' ? (
                        <FaExclamationTriangle className="text-sm" />
                      ) : (
                        <FaRobot className="text-sm opacity-70" />
                      )}
                      <span className="text-sm font-medium">
                        {message.type === 'user' ? 'You' : message.type === 'error' ? 'Error' : 'Healthcare Assistant'}
                      </span>
                      <span className="text-xs opacity-60">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    
                    {/* Copy button */}
                    <button
                      onClick={() => copyMessage(message)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black hover:bg-opacity-10 rounded"
                      title="Copy message"
                    >
                      {copiedMessageId === message.id ? (
                        <FaCheck className="text-xs text-green-600" />
                      ) : (
                        <FaCopy className="text-xs" />
                      )}
                    </button>
                  </div>
                  
                  {/* Message Content */}
                  <div className="text-base leading-relaxed whitespace-pre-wrap">
                    {message.message}
                  </div>
                  
                  {/* Retry button for error messages */}
                  {message.type === 'error' && (
                    <button
                      onClick={retryLastMessage}
                      className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg transition-colors"
                    >
                      Retry Last Message
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 mr-12 shadow-sm">
                <div className="flex items-center space-x-3">
                  <FaSpinner className="animate-spin text-blue-600" />
                  <span className="text-gray-600">Healthcare Assistant is typing...</span>
                </div>
              </div>
            </motion.div>
          )}

            <div ref={messagesEndRef} />
          {/* Suggestions */}
          {showSuggestions && messages.length <= 1 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center text-gray-600 mb-4">
                <FaLightbulb className="mr-2" />
                <span className="font-medium">Try asking about:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm"
                  >
                    <span className="text-gray-800">{suggestion}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <div className="flex items-center text-red-800">
                <FaExclamationTriangle className="mr-3" />
                <div>
                  <p className="font-medium">Something went wrong</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your health question here..."
                disabled={isLoading || !sessionInfo.isActive}
                rows={1}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                style={{
                  minHeight: '56px',
                  maxHeight: '160px'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                }}
              />
              
              {/* Character count */}
              <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                {inputMessage.length}/1000
              </div>
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading || !sessionInfo.isActive}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-4 rounded-2xl transition-colors disabled:cursor-not-allowed shrink-0"
              title="Send message"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin text-xl" />
              ) : (
                <FaPaperPlane className="text-xl" />
              )}
            </button>
          </div>
          
          {/* Input hints */}
          <div className="text-sm text-gray-500 mt-3 text-center">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> to send • 
            <kbd className="px-2 py-1 bg-gray-100 rounded mx-1">Shift+Enter</kbd> for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;