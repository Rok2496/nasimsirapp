'use client';

import { useState } from 'react';
import { publicApi } from '@/lib/api';

export default function TestChatPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      console.log('Sending message:', message);
      const result = await publicApi.sendChatMessage({
        message: message,
        session_id: 'test-session',
        language: 'en'
      });
      console.log('Received response:', result);
      setResponse(result.response);
    } catch (error) {
      console.error('Error sending message:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Chat API Test</h1>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your message"
          />
        </div>
        
        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
        
        {response && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Response:</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}