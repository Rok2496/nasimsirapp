'use client';

import { useState } from 'react';
import { publicApi } from '@/lib/api';

export default function CorsTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testCors = async () => {
    setLoading(true);
    setResult('Testing CORS...');
    
    try {
      console.log('Testing CORS with API service');
      const response = await publicApi.sendChatMessage({
        message: 'Hello, CORS test',
        session_id: 'cors-test-session',
        language: 'en'
      });
      
      console.log('CORS test response data:', response);
      setResult(`CORS test success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error('CORS test error:', error);
      setResult(`CORS test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">CORS Test</h1>
        
        <div className="mb-6">
          <button
            onClick={testCors}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Testing...' : 'Test CORS'}
          </button>
        </div>
        
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Test Result:</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-4 rounded border">
              {result}
            </pre>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">CORS Test Information</h3>
          <p className="text-yellow-700">
            This test checks if the frontend can directly communicate with the backend API.
            If there are CORS issues, you&apos;ll see errors in the browser console.
          </p>
        </div>
      </div>
    </div>
  );
}