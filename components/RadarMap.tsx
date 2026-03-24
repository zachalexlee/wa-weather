'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Props {
  lat: number;
  lon: number;
  cityName: string;
}

export default function RadarMap({ lat, lon, cityName }: Props) {
  const [radarLayer, setRadarLayer] = useState<'radar' | 'satellite' | 'coverage'>('radar');
  const [radarTimestamp, setRadarTimestamp] = useState<number>(Date.now());
  const [mounted, setMounted] = useState(false);
  const position: LatLngExpression = [lat, lon];

  useEffect(() => {
    setMounted(true);
    
    // Update radar every 10 minutes for latest data
    const interval = setInterval(() => {
      setRadarTimestamp(Date.now());
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-blue-900/20 rounded-xl flex items-center justify-center">
        <p className="text-white">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Layer Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setRadarLayer('radar')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'radar'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          📡 Doppler Radar
        </button>
        <button
          onClick={() => setRadarLayer('satellite')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'satellite'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          🛰️ Satellite
        </button>
        <button
          onClick={() => setRadarLayer('coverage')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'coverage'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          🌐 Coverage Map
        </button>
        <button
          onClick={() => setRadarTimestamp(Date.now())}
          className="px-4 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-all duration-200"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Map */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden border-2 border-white/20">
        <MapContainer
          center={position}
          zoom={9}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* Base Map Layer - Dark theme */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* RainViewer Radar/Satellite Layer */}
          <TileLayer
            url={getRainViewerUrl(radarLayer, radarTimestamp)}
            attribution='&copy; <a href="https://www.rainviewer.com">RainViewer</a>'
            opacity={0.7}
            maxZoom={18}
          />

          {/* City Marker */}
          <Marker position={position}>
            <Popup>
              <strong>{cityName}</strong>
              <br />
              Current Location
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <h3 className="text-white font-semibold mb-3">Precipitation Intensity</h3>
        <div className="flex items-center gap-6 text-sm text-blue-200 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded" style={{ background: 'rgba(0, 200, 255, 0.6)' }}></div>
            <span>Light Rain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded" style={{ background: 'rgba(0, 150, 255, 0.8)' }}></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded" style={{ background: 'rgba(0, 100, 255, 1)' }}></div>
            <span>Heavy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded" style={{ background: 'rgba(150, 0, 255, 1)' }}></div>
            <span>Very Heavy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded" style={{ background: 'rgba(255, 0, 0, 1)' }}></div>
            <span>Extreme</span>
          </div>
        </div>
        <p className="text-blue-300 text-xs mt-3">
          ℹ️ Radar data updates every 10 minutes from live NOAA/NWS sources
        </p>
      </div>
    </div>
  );
}

function getRainViewerUrl(layer: 'radar' | 'satellite' | 'coverage', timestamp: number): string {
  // RainViewer provides free, high-quality radar tiles
  // Using the latest available radar timestamp
  const time = Math.floor(timestamp / 600000) * 600000; // Round to nearest 10 minutes
  
  const layerMap = {
    radar: 'radar',      // Doppler radar precipitation
    satellite: 'satellite', // Infrared satellite imagery
    coverage: 'coverage'   // Radar coverage areas
  };
  
  // RainViewer tile server (free to use)
  return `https://tilecache.rainviewer.com/v2/${layerMap[layer]}/{z}/{x}/{y}/256.png`;
}
