'use client';

import { useState } from 'react';
import { publicApi } from '@/lib/api';

export default function SimpleChat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const result = await publicApi.sendChatMessage({
        message: message,
        session_id: 'simple-chat-session',
        language: 'en'
      });
      setResponse(result.response);
    } catch (err) {
      console.error('Chat error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Simple Chat Test</h1>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Type your message here..."
          />
        </div>
        
        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
            <h2 className="font-semibold mb-2">Error:</h2>
            <p>{error}</p>
          </div>
        )}
        
        {response && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
            <h2 className="font-semibold mb-2">Response:</h2>
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}