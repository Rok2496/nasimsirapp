'use client';

import { useState, useEffect, useRef } from 'react';
import { publicApi } from '@/lib/api';
import SmartLoader from './SmartLoader';

interface ChatMessage {
  message: string;
  response: string;
  isUser: boolean;
}

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatLoading(true);

    // Add user message to chat
    const newUserMessage: ChatMessage = { 
      message: userMessage, 
      response: '', 
      isUser: true 
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);

    try {
      console.log('Sending chat message:', {
        message: userMessage,
        session_id: chatSessionId || undefined,
        language: 'en'
      });
      
      const response = await publicApi.sendChatMessage({
        message: userMessage,
        session_id: chatSessionId || undefined,
        language: 'en'
      });

      console.log('Received chat response:', response);
      
      if (!chatSessionId) {
        setChatSessionId(response.session_id);
      }

      // Add AI response as a new message
      const aiResponse: ChatMessage = {
        message: '',
        response: response.response,
        isUser: false
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message as AI response
      let errorMessage = 'Sorry, I\'m having trouble right now. Please contact us at 01678-134547.';
      if (error instanceof Error && error.message.includes('demand')) {
        errorMessage = 'I\'m experiencing high demand right now. Please wait a moment and try again, or contact us directly at 01678-134547 for immediate assistance.';
      } else if (error instanceof Error && error.message.includes('Network')) {
        errorMessage = 'Unable to connect to the AI service. Please check your internet connection or try again later.';
      }
      
      const errorResponse: ChatMessage = {
        message: '',
        response: errorMessage,
        isUser: false
      };
      
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center ${
            isOpen ? 'scale-95' : 'hover:scale-110'
          }`}
        >
          {/* Pulse Animation */}
          <div className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-ping"></div>
          
          {/* Icon */}
          <div className="relative z-10 text-white transition-transform duration-300">
            {isOpen ? (
              <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            )}
          </div>
          
          {/* Notification Badge */}
          {chatMessages.length === 0 && !isOpen && (
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          )}
        </button>
      </div>

      {/* AI Assistant Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 w-72 sm:w-80 md:w-96 h-[400px] sm:h-[500px] md:h-[600px] bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 z-40 flex flex-col overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 md:p-6 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white/20 rounded-full -translate-y-8 -translate-x-8 sm:-translate-y-12 sm:translate-x-12 md:-translate-y-16 md:translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-white/10 rounded-full translate-y-4 -translate-x-4 sm:translate-y-8 sm:-translate-x-8 md:translate-y-12 md:-translate-x-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-1.5 md:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-white/20 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base md:text-xl font-bold">SmartTech AI</h3>
                  <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80 text-[10px] sm:text-xs md:text-sm">Online Assistant</span>
                  </div>
                </div>
              </div>
              <p className="text-white/80 text-[10px] sm:text-xs md:text-sm">Ask me anything about our Interactive Smart Board!</p>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-6 space-y-2 sm:space-y-3 md:space-y-4 bg-gradient-to-b from-slate-50 to-blue-50">
            {chatMessages.length === 0 && (
              <div className="text-center py-3 sm:py-4 md:py-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium mb-1 sm:mb-1.5 md:mb-2 text-xs sm:text-sm md:text-base">👋 Hi! I&apos;m your AI assistant.</p>
                <p className="text-slate-500 text-[10px] sm:text-xs md:text-sm">Ready to help with your Smart Board questions!</p>
                
                {/* Quick Action Buttons */}
                <div className="mt-3 sm:mt-4 md:mt-6 space-y-1 sm:space-y-1.5 md:space-y-2">
                  <button
                    onClick={() => setChatInput('What are the key features of the Smart Board?')}
                    className="w-full text-left p-1.5 sm:p-2 md:p-3 bg-white/80 hover:bg-white rounded-lg sm:rounded-xl border border-white/50 hover:shadow-md transition-all duration-300 text-[10px] sm:text-xs md:text-sm text-slate-700"
                  >
                    💡 What are the key features?
                  </button>
                  <button
                    onClick={() => setChatInput('What is the price and how can I order?')}
                    className="w-full text-left p-1.5 sm:p-2 md:p-3 bg-white/80 hover:bg-white rounded-lg sm:rounded-xl border border-white/50 hover:shadow-md transition-all duration-300 text-[10px] sm:text-xs md:text-sm text-slate-700"
                  >
                    💰 Pricing and ordering info?
                  </button>
                  <button
                    onClick={() => setChatInput('Do you provide technical support?')}
                    className="w-full text-left p-1.5 sm:p-2 md:p-3 bg-white/80 hover:bg-white rounded-lg sm:rounded-xl border border-white/50 hover:shadow-md transition-all duration-300 text-[10px] sm:text-xs md:text-sm text-slate-700"
                  >
                    🔧 Technical support?
                  </button>
                </div>
              </div>
            )}
            
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[80%] ${
                  msg.isUser 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl md:rounded-2xl rounded-br-md' 
                    : 'bg-white/80 backdrop-blur-sm text-slate-800 border border-white/50 rounded-lg sm:rounded-xl md:rounded-2xl rounded-bl-md'
                } p-2 sm:p-3 md:p-4 shadow-lg`}>
                  <p className="text-[10px] sm:text-xs md:text-sm leading-relaxed">{msg.isUser ? msg.message : msg.response}</p>
                  {!msg.isUser && (
                    <div className="mt-1 sm:mt-1.5 md:mt-2 flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 text-[10px] sm:text-xs text-slate-500">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="4"/>
                        </svg>
                      </div>
                      <span>SmartTech AI</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl rounded-bl-md shadow-lg border border-white/50">
                  <SmartLoader variant="chat" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

          </div>
          
          {/* Input Form */}
          <div className="p-2 sm:p-3 md:p-6 bg-white/80 backdrop-blur-sm border-t border-white/20">
            <form onSubmit={handleChatSubmit} className="flex gap-1.5 sm:gap-2 md:gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 p-1.5 sm:p-2 md:p-3 border-2 border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white text-slate-800 placeholder-slate-500 shadow-sm text-xs sm:text-sm md:text-base"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}