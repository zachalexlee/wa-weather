'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  event: string;
  headline: string;
  description: string;
  severity: string;
  urgency: string;
  areas: string;
  start: number;
  end: number;
}

interface Props {
  lat: number;
  lon: number;
  cityName: string;
}

export default function WeatherAlerts({ lat, lon, cityName }: Props) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetchAlerts();
    // Refresh alerts every 5 minutes
    const interval = setInterval(fetchAlerts, 300000);
    return () => clearInterval(interval);
  }, [lat, lon]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      // Using National Weather Service API (free, no key needed)
      const response = await fetch(
        `https://api.weather.gov/alerts/active?point=${lat},${lon}`
      );
      
      if (!response.ok) {
        setAlerts([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const formattedAlerts = data.features.map((feature: any) => ({
          event: feature.properties.event,
          headline: feature.properties.headline,
          description: feature.properties.description,
          severity: feature.properties.severity,
          urgency: feature.properties.urgency,
          areas: feature.properties.areaDesc,
          start: new Date(feature.properties.onset).getTime(),
          end: new Date(feature.properties.ends).getTime(),
        }));
        
        setAlerts(formattedAlerts);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span className="text-white">Checking for weather alerts...</span>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="text-white font-semibold">No Active Alerts</h3>
            <p className="text-green-200 text-sm">
              No weather warnings or advisories for {cityName}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`backdrop-blur-sm rounded-xl border-2 overflow-hidden ${getSeverityStyle(alert.severity)}`}
        >
          <button
            onClick={() => setExpanded(expanded === index ? null : index)}
            className="w-full p-4 text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">
                {getSeverityIcon(alert.severity)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-lg">
                    {alert.event}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-white/90 text-sm mb-2">
                  {alert.headline}
                </p>
                <div className="flex items-center gap-4 text-xs text-white/70">
                  <span>📍 {alert.areas}</span>
                  <span>⏰ Until {new Date(alert.end).toLocaleString()}</span>
                </div>
              </div>
              <span className="text-white/50 text-2xl flex-shrink-0">
                {expanded === index ? '▼' : '▶'}
              </span>
            </div>
          </button>
          
          <AnimatePresence>
            {expanded === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-white/20"
              >
                <div className="p-4 bg-black/20">
                  <h4 className="text-white font-semibold mb-2">Details:</h4>
                  <p className="text-white/80 text-sm whitespace-pre-wrap">
                    {alert.description.split('\n').slice(0, 5).join('\n')}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded ${getUrgencyBadge(alert.urgency)}`}>
                      {alert.urgency} Urgency
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function getSeverityStyle(severity: string): string {
  switch (severity?.toLowerCase()) {
    case 'extreme':
      return 'bg-red-500/30 border-red-500';
    case 'severe':
      return 'bg-orange-500/30 border-orange-500';
    case 'moderate':
      return 'bg-yellow-500/30 border-yellow-500';
    default:
      return 'bg-blue-500/30 border-blue-500';
  }
}

function getSeverityIcon(severity: string): string {
  switch (severity?.toLowerCase()) {
    case 'extreme':
      return '🚨';
    case 'severe':
      return '⚠️';
    case 'moderate':
      return '⚡';
    default:
      return 'ℹ️';
  }
}

function getSeverityBadge(severity: string): string {
  switch (severity?.toLowerCase()) {
    case 'extreme':
      return 'bg-red-600 text-white';
    case 'severe':
      return 'bg-orange-600 text-white';
    case 'moderate':
      return 'bg-yellow-600 text-white';
    default:
      return 'bg-blue-600 text-white';
  }
}

function getUrgencyBadge(urgency: string): string {
  switch (urgency?.toLowerCase()) {
    case 'immediate':
      return 'bg-red-600 text-white';
    case 'expected':
      return 'bg-orange-600 text-white';
    default:
      return 'bg-blue-600 text-white';
  }
}
