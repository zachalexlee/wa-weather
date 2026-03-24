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

interface RadarFrame {
  path: string;
  time: number;
}

export default function RadarMap({ lat, lon, cityName }: Props) {
  const [radarLayer, setRadarLayer] = useState<'precipitation' | 'clouds' | 'temperature'>('precipitation');
  const [radarFrames, setRadarFrames] = useState<RadarFrame[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [mounted, setMounted] = useState(false);
  const position: LatLngExpression = [lat, lon];

  useEffect(() => {
    setMounted(true);
    fetchRadarData();
    
    // Update radar data every 10 minutes
    const interval = setInterval(fetchRadarData, 600000);
    return () => clearInterval(interval);
  }, []);

  const fetchRadarData = async () => {
    try {
      const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
      const data = await response.json();
      
      if (data.radar && data.radar.past) {
        setRadarFrames(data.radar.past);
        setCurrentFrame(data.radar.past.length - 1); // Use latest frame
      }
    } catch (error) {
      console.error('Error fetching radar data:', error);
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-blue-900/20 rounded-xl flex items-center justify-center">
        <p className="text-white">Loading map...</p>
      </div>
    );
  }

  const radarTileUrl = radarFrames[currentFrame]
    ? `https://tilecache.rainviewer.com${radarFrames[currentFrame].path}/256/{z}/{x}/{y}/2/1_1.png`
    : '';

  return (
    <div className="space-y-4">
      {/* Layer Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setRadarLayer('precipitation')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'precipitation'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          ☔ Live Radar
        </button>
        <button
          onClick={() => setRadarLayer('clouds')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'clouds'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          ☁️ Cloud Cover
        </button>
        <button
          onClick={() => setRadarLayer('temperature')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            radarLayer === 'temperature'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-blue-200 hover:bg-white/20'
          }`}
        >
          🌡️ Temperature
        </button>
        <button
          onClick={fetchRadarData}
          className="px-4 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-all duration-200"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Map */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden border-2 border-white/20">
        <MapContainer
          center={position}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* Base Map Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Weather Overlay Layer */}
          {radarLayer === 'precipitation' && radarTileUrl ? (
            <TileLayer
              url={radarTileUrl}
              attribution='&copy; <a href="https://www.rainviewer.com">RainViewer</a>'
              opacity={0.6}
              zIndex={10}
            />
          ) : (
            <TileLayer
              url={getOpenWeatherLayerUrl(radarLayer)}
              attribution='Weather data &copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
              opacity={0.5}
              zIndex={10}
            />
          )}

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
        <h3 className="text-white font-semibold mb-3">
          {radarLayer === 'precipitation' ? 'Precipitation Intensity' : 'Layer Information'}
        </h3>
        {radarLayer === 'precipitation' ? (
          <>
            <div className="flex items-center gap-4 text-sm text-blue-200 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 rounded" style={{ background: 'rgba(100, 200, 255, 0.8)' }}></div>
                <span>Light</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 rounded" style={{ background: 'rgba(0, 150, 255, 1)' }}></div>
                <span>Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 rounded" style={{ background: 'rgba(255, 200, 0, 1)' }}></div>
                <span>Heavy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 rounded" style={{ background: 'rgba(255, 0, 0, 1)' }}></div>
                <span>Extreme</span>
              </div>
            </div>
            <p className="text-blue-300 text-xs mt-3">
              ℹ️ Live radar data from NOAA/NWS sources via RainViewer
            </p>
          </>
        ) : (
          <p className="text-blue-200 text-sm">
            Showing {radarLayer} data for {cityName} area
          </p>
        )}
      </div>
    </div>
  );
}

function getOpenWeatherLayerUrl(layer: 'precipitation' | 'clouds' | 'temperature'): string {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '2da56c3b5f37ea8efa1783a594ef791f';
  const layerMap = {
    precipitation: 'precipitation_new',
    clouds: 'clouds_new',
    temperature: 'temp_new',
  };
  
  return `https://tile.openweathermap.org/map/${layerMap[layer]}/{z}/{x}/{y}.png?appid=${apiKey}`;
}
