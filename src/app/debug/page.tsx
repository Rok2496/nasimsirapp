'use client';

import { useState } from 'react';
import { publicApi } from '@/lib/api';

export default function DebugPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testChatAPI = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      console.log('Testing chat API...');
      const response = await publicApi.sendChatMessage({
        message: 'Hello, this is a test message',
        session_id: 'debug-session',
        language: 'en'
      });
      console.log('API Response:', response);
      setTestResult(`Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error('API Error:', error);
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setTestResult('Testing API service...');
    
    try {
      console.log('Testing API service...');
      const response = await publicApi.sendChatMessage({
        message: 'Hello, this is a direct test message',
        session_id: 'direct-debug-session',
        language: 'en'
      });
      
      console.log('API service response data:', response);
      setTestResult(`API service success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error('API service error:', error);
      setTestResult(`API service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Debug Chat API</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testChatAPI}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Testing...' : 'Test Chat API Service'}
          </button>
          
          <button
            onClick={testDirectFetch}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Testing...' : 'Test Direct Fetch'}
          </button>
        </div>
        
        {testResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Test Result:</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-4 rounded border">
              {testResult}
            </pre>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
          <p className="text-yellow-700">
            This page helps debug the chat API functionality by testing both the API service layer 
            and direct fetch requests to identify any issues with the frontend-backend communication.
          </p>
        </div>
      </div>
    </div>
  );
}