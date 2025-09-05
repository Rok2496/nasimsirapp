'use client';

import SmartLoader from '@/components/SmartLoader';

export default function LoadingDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            SmartTech Loading Animations
          </h1>
          <p className="text-slate-600 text-lg">
            Fun and engaging loading experiences for modern applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Default Loader */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/30">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Default Smart Loader</h2>
            <div className="h-64 flex items-center justify-center">
              <SmartLoader />
            </div>
          </div>

          {/* Compact Loader */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/30">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Compact Loader</h2>
            <div className="h-64 flex items-center justify-center">
              <SmartLoader variant="compact" message="Loading compact..." />
            </div>
          </div>

          {/* Chat Loader */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/30">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Chat Loader</h2>
            <div className="h-64 flex items-center justify-center">
              <SmartLoader variant="chat" />
            </div>
          </div>

          {/* Admin Loader */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/30">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Admin Loader</h2>
            <div className="h-64 flex items-center justify-center">
              <SmartLoader variant="admin" />
            </div>
          </div>

          {/* Quantum Loader */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/30">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Quantum Loader</h2>
            <div className="h-64 flex items-center justify-center">
              <SmartLoader variant="quantum" />
            </div>
          </div>

          {/* Neural Loader */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/30">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Neural Loader</h2>
            <div className="h-64 flex items-center justify-center">
              <SmartLoader variant="neural" />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500">
            All loaders are fully responsive and work seamlessly with the SmartTech design system
          </p>
        </div>
      </div>
    </div>
  );
}