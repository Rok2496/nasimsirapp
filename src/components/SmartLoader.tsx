'use client';

import { useState, useEffect } from 'react';

interface SmartLoaderProps {
  variant?: 'default' | 'compact' | 'chat' | 'admin' | 'quantum' | 'neural';
  message?: string;
  className?: string;
}

export default function SmartLoader({ 
  variant = 'default', 
  message,
  className = '' 
}: SmartLoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const smartMessages = [
    "Initializing SmartBoard...",
    "Loading AI modules...", 
    "Connecting neural networks...",
    "Calibrating touch sensors...",
    "Preparing 4K display...",
    "Optimizing performance...",
    "Almost ready..."
  ];

  const chatMessages = [
    "Analyzing your query...",
    "Processing request...",
    "Consulting knowledge base...",
    "Generating intelligent response...",
    "Finalizing answer..."
  ];

  const quantumMessages = [
    "Quantum computing...",
    "Entangling qubits...",
    "Superposition achieved...",
    "Reality processing..."
  ];

  const neuralMessages = [
    "Neural network learning...",
    "Synapses firing...",
    "Deep thinking mode...",
    "Consciousness expanding..."
  ];

  const adminMessages = [
    "Authenticating admin...",
    "Loading dashboard...",
    "Securing connection...",
    "Preparing interface..."
  ];

  useEffect(() => {
    if (variant === 'default') {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % smartMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [variant, smartMessages.length]);

  const getMessages = () => {
    switch (variant) {
      case 'chat':
        return chatMessages;
      case 'admin':
        return adminMessages;
      case 'quantum':
        return quantumMessages;
      case 'neural':
        return neuralMessages;
      default:
        return smartMessages;
    }
  };

  const getCurrentMessage = () => {
    const messages = getMessages();
    if (message) return message;
    if (variant === 'default') return messages[messageIndex];
    return messages[0];
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <div className="relative w-5 h-5">
          <div className="absolute inset-0 border-2 border-blue-200 rounded-full smart-spinner"></div>
          <div className="absolute inset-1 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        {message && <span className="text-sm text-slate-600">{message}</span>}
      </div>
    );
  }

  if (variant === 'chat') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="relative w-10 h-6">
          {/* Professional AI Thinking Visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Outer ring with gradient */}
            <div className="absolute inset-0 border-2 border-transparent rounded-full animate-spin" style={{
              background: 'conic-gradient(transparent, #3b82f6, #8b5cf6)',
              mask: 'radial-gradient(black 55%, transparent 56%)'
            }}></div>
            
            {/* Inner pulsing core */}
            <div className="absolute inset-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            
            {/* Orbiting particles for enhanced effect */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{ 
                animationDuration: '1.5s',
                transform: 'translate(-50%, -50%)'
              }}></div>
              <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ 
                animationDuration: '2s', 
                animationDelay: '0.5s',
                transform: 'translate(50%, 50%)'
              }}></div>
            </div>
          </div>
        </div>
        <div className="relative">
          <span className="text-xs font-medium text-slate-700">{getCurrentMessage()}</span>
          <span className="absolute -right-4 top-0 text-blue-500 animate-pulse">●</span>
        </div>
      </div>
    );
  }

  if (variant === 'quantum') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 border-2 border-purple-300 rounded-full quantum-flicker"></div>
          <div className="absolute inset-1 border-2 border-blue-500 rounded-full quantum-flicker" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute inset-2 w-2 h-2 bg-cyan-400 rounded-full quantum-flicker" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative">
          <span className="text-xs text-slate-600 quantum-flicker">{getCurrentMessage()}</span>
          <div className="absolute inset-0 holographic-shimmer opacity-30"></div>
        </div>
      </div>
    );
  }

  if (variant === 'neural') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="relative w-8 h-6">
          {/* Neural Network Visualization */}
          <svg className="w-full h-full neural-pulse" viewBox="0 0 32 24">
            <g stroke="currentColor" strokeWidth="1" fill="none" className="text-blue-500">
              {/* Neurons */}
              <circle cx="6" cy="6" r="2" fill="currentColor" className="text-blue-400" />
              <circle cx="6" cy="18" r="2" fill="currentColor" className="text-purple-400" />
              <circle cx="16" cy="12" r="2" fill="currentColor" className="text-cyan-400" />
              <circle cx="26" cy="8" r="2" fill="currentColor" className="text-green-400" />
              <circle cx="26" cy="16" r="2" fill="currentColor" className="text-pink-400" />
              
              {/* Connections */}
              <line x1="8" y1="6" x2="14" y2="12" className="text-blue-300" strokeDasharray="2,2" />
              <line x1="8" y1="18" x2="14" y2="12" className="text-purple-300" strokeDasharray="2,2" />
              <line x1="18" y1="12" x2="24" y2="8" className="text-cyan-300" strokeDasharray="2,2" />
              <line x1="18" y1="12" x2="24" y2="16" className="text-green-300" strokeDasharray="2,2" />
            </g>
          </svg>
        </div>
        <div className="relative">
          <span className="text-xs text-slate-600">{getCurrentMessage()}</span>
          <span className="cursor-blink text-green-500 ml-1">●</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden ${className}`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Smart Board Loading Animation */}
        <div className="relative mb-8">
          {/* Main Smart Board Frame */}
          <div className="relative w-32 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl smart-loader mx-auto">
            {/* Screen */}
            <div className="absolute inset-2 bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl overflow-hidden">
              {/* Screen Content - Circuit Pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 60">
                <path 
                  className="circuit-path" 
                  stroke="url(#circuitGradient)" 
                  strokeWidth="0.5" 
                  fill="none"
                  d="M10,10 L30,10 L30,25 L50,25 L50,10 L70,10 L70,30 L90,30 M20,35 L40,35 L40,50 L80,50"
                />
                <defs>
                  <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Data Streams */}
              <div className="absolute inset-0">
                <div className="absolute top-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60 data-stream"></div>
                <div className="absolute top-4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60 data-stream" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-6 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 data-stream" style={{animationDelay: '2s'}}></div>
              </div>

              {/* AI Brain Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 ai-brain">
                  <svg className="w-full h-full text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Power LED */}
            <div className="absolute bottom-1 right-2 w-1.5 h-1.5 bg-green-400 rounded-full processing-dot"></div>
          </div>

          {/* Floating Tech Elements */}
          <div className="absolute -top-4 -left-4 w-6 h-6 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-300/30 processing-dot" style={{animationDelay: '0.5s'}}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="absolute -top-2 -right-6 w-8 h-6 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-300/30 processing-dot" style={{animationDelay: '1s'}}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-3 h-1 bg-purple-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="absolute -bottom-3 -right-2 w-5 h-5 bg-cyan-500/20 backdrop-blur-sm rounded-full border border-cyan-300/30 processing-dot" style={{animationDelay: '1.5s'}}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Loading Text with Typewriter Effect */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            SmartTech Loading
          </h2>
          <div className="relative inline-block">
            <span className="text-slate-600 font-medium">{getCurrentMessage()}</span>
            <span className="cursor-blink text-blue-500 ml-1">|</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-80 max-w-sm mx-auto">
          <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full data-stream"></div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 italic">
            🚀 Powered by RK3588 • 🤖 AI Enhanced • ✨ 4K Ready
          </p>
        </div>
      </div>
    </div>
  );
}