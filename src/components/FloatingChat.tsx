'use client';

import { useState } from 'react';
import { publicApi } from '@/lib/api';
import SmartLoader from './SmartLoader';

interface ChatMessage {
  message: string;
  response: string;
  isUser: boolean;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatLoading(true);

    // Add user message to chat with empty response initially
    const newUserMessage: ChatMessage = { 
      message: userMessage, 
      response: '', 
      isUser: true 
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await publicApi.sendChatMessage({
        message: userMessage,
        session_id: chatSessionId || undefined,
        language: 'en'
      });

      if (!chatSessionId) {
        setChatSessionId(response.session_id);
      }

      // Update the last message with the actual response
      setChatMessages(prev => {
        const updatedMessages = [...prev];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        if (lastMessage && lastMessage.isUser) {
          lastMessage.response = response.response;
        }
        return updatedMessages;
      });
    } catch (error) {
      console.error('Chat error:', error);
      // Update the last message with error response
      setChatMessages(prev => {
        const updatedMessages = [...prev];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        if (lastMessage && lastMessage.isUser) {
          // Check if it's a rate limiting error
          let errorMessage = 'Sorry, I\'m having trouble right now. Please contact us at 01678-134547.';
          if (error instanceof Error && error.message.includes('demand')) {
            errorMessage = 'I\'m experiencing high demand right now. Please wait a moment and try again, or contact us directly at 01678-134547 for immediate assistance.';
          }
          lastMessage.response = errorMessage;
        }
        return updatedMessages;
      });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            
            {/* Floating Text */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Chat with AI Assistant
            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
          }`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">AI Assistant</h3>
                    <p className="text-white/80 text-xs">Always here to help</p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 h-80">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-slate-600 font-medium mb-1 text-sm">👋 Hi! How can I help?</p>
                      <p className="text-slate-500 text-xs">Ask me about our Smart Board!</p>
                    </div>
                  )}
                  
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                        msg.isUser 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md' 
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md shadow-sm'
                      }`}>
                        <p>{msg.isUser ? msg.message : msg.response}</p>
                      </div>
                    </div>
                  ))}
                  
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-200">
                        <SmartLoader variant="chat" />
                      </div>
                    </div>
                  )}

                </div>
                
                {/* Input Form */}
                <form onSubmit={handleChatSubmit} className="p-4 bg-white rounded-b-2xl border-t border-slate-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm bg-white"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}