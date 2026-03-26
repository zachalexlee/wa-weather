'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OfflineMode() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [cacheSize, setCacheSize] = useState<string>('Calculating...');

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set last update time
    setLastUpdate(new Date().toLocaleString());

    // Estimate cache size
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        const size = ((estimate.usage || 0) / 1024 / 1024).toFixed(2);
        setCacheSize(`${size} MB`);
      });
    } else {
      setCacheSize('Not available');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      alert('Cache cleared successfully!');
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-teal-500/10 to-green-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
        <h2 className="text-3xl font-bold mb-2">📴 Offline Mode</h2>
        <p className="text-sm text-white/70 mb-6">View cached weather data without internet</p>

        {/* Connection Status */}
        <div className={`mb-6 p-6 rounded-2xl border-2 ${
          isOnline 
            ? 'bg-green-500/20 border-green-500/50' 
            : 'bg-red-500/20 border-red-500/50'
        }`}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{isOnline ? '🟢' : '🔴'}</div>
            <div>
              <div className="text-2xl font-bold">
                {isOnline ? 'Online' : 'Offline Mode'}
              </div>
              <div className="text-sm text-white/70">
                {isOnline 
                  ? 'Connected to internet - data is live' 
                  : 'No connection - showing cached data'}
              </div>
            </div>
          </div>
        </div>

        {/* Cache Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-sm text-white/70 mb-1">Last Updated</div>
            <div className="text-lg font-bold">{lastUpdate}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-sm text-white/70 mb-1">Cache Size</div>
            <div className="text-lg font-bold">{cacheSize}</div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-black/20 rounded-xl p-4 mb-6">
          <h3 className="font-semibold mb-3">✨ Offline Features</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>View last loaded weather forecast</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Access cached city data</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Browse historical weather views</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Use saved commute/dashboard settings</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">○</span>
              <span className="text-white/50">Live radar updates (requires connection)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">○</span>
              <span className="text-white/50">Real-time alerts (requires connection)</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={clearCache}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl p-4 transition-all font-medium"
          >
            🗑️ Clear Cache
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl p-4 transition-all font-medium"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <p className="text-sm">
            <strong>ℹ️ How it works:</strong> This app automatically caches weather data as you use it. 
            When offline, you can still view the most recent forecast. Reconnect to get live updates!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
