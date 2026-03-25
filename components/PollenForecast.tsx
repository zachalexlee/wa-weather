'use client';

import { useEffect, useState } from 'react';

interface Props {
  lat: number;
  lon: number;
  theme: 'light' | 'dark';
}

interface PollenData {
  overall: number; // 0-5 scale
  tree: number;
  grass: number;
  weed: number;
  level: 'None' | 'Low' | 'Moderate' | 'High' | 'Very High';
  predominant: string;
}

export default function PollenForecast({ lat, lon, theme }: Props) {
  const [pollen, setPollen] = useState<PollenData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPollenData() {
      try {
        // Using Open-Meteo Air Quality API for pollen data
        const response = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=alder_pollen,birch_pollen,grass_pollen,ragweed_pollen&timezone=auto`
        );

        if (response.ok) {
          const data = await response.json();
          
          // Aggregate pollen levels
          const alder = data.current?.alder_pollen || 0;
          const birch = data.current?.birch_pollen || 0;
          const grass = data.current?.grass_pollen || 0;
          const ragweed = data.current?.ragweed_pollen || 0;

          const tree = Math.max(alder, birch);
          const weed = ragweed;
          const overall = Math.max(tree, grass, weed);

          // Determine predominant type
          let predominant = 'None';
          if (overall > 0) {
            if (tree === overall) predominant = 'Tree';
            else if (grass === overall) predominant = 'Grass';
            else if (weed === overall) predominant = 'Weed';
          }

          // Convert to 0-5 scale and determine level
          const level = getPollenLevel(overall);

          setPollen({
            overall,
            tree,
            grass,
            weed,
            level,
            predominant
          });
        }
      } catch (error) {
        console.error('Failed to fetch pollen data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPollenData();
    // Refresh every 6 hours
    const interval = setInterval(fetchPollenData, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lon]);

  if (loading) {
    return (
      <div className={`backdrop-blur-md rounded-2xl border p-6 ${
        theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300'
      }`}>
        <div className={`text-center ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
          Loading pollen forecast...
        </div>
      </div>
    );
  }

  if (!pollen || pollen.overall === 0) {
    return null; // Don't show if no pollen
  }

  const bgColor = getPollenBgColor(pollen.level, theme);
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';

  return (
    <div className={`backdrop-blur-md rounded-2xl border-2 p-6 ${bgColor}`}>
      <div className="flex items-start gap-4">
        <div className="text-5xl">🌼</div>

        <div className="flex-1">
          <h3 className={`text-2xl font-bold mb-2 ${textPrimary}`}>
            Pollen Forecast
          </h3>

          {/* Overall Level */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white mb-4"
            style={{ backgroundColor: getPollenColor(pollen.level) }}
          >
            <span>{getPollenIcon(pollen.level)}</span>
            <span>{pollen.level} Pollen Levels</span>
          </div>

          {/* Pollen Types */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <PollenTypeCard
              label="Tree"
              value={pollen.tree}
              icon="🌳"
              theme={theme}
            />
            <PollenTypeCard
              label="Grass"
              value={pollen.grass}
              icon="🌾"
              theme={theme}
            />
            <PollenTypeCard
              label="Weed"
              value={pollen.weed}
              icon="🌿"
              theme={theme}
            />
          </div>

          <p className={`text-sm mb-3 ${textSecondary}`}>
            <strong>Predominant:</strong> {pollen.predominant} pollen
          </p>

          {/* Recommendations */}
          {pollen.level !== 'None' && pollen.level !== 'Low' && (
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-black/30' : 'bg-white/70'
            }`}>
              <h4 className={`font-bold mb-2 ${textPrimary}`}>
                💊 Allergy Tips:
              </h4>
              <ul className={`list-disc list-inside space-y-1 text-sm ${textSecondary}`}>
                {getPollenRecommendations(pollen.level).map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PollenTypeCard({ 
  label, 
  value, 
  icon, 
  theme 
}: { 
  label: string; 
  value: number; 
  icon: string;
  theme: 'light' | 'dark';
}) {
  const level = getPollenLevel(value);
  const bgClass = theme === 'dark' ? 'bg-white/10' : 'bg-white/90';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  
  return (
    <div className={`${bgClass} rounded-lg p-3 text-center`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {label}
      </div>
      <div className={`text-sm font-bold ${textClass}`} style={{ color: getPollenColor(level) }}>
        {level}
      </div>
    </div>
  );
}

function getPollenLevel(value: number): PollenData['level'] {
  if (value === 0) return 'None';
  if (value < 20) return 'Low';
  if (value < 50) return 'Moderate';
  if (value < 100) return 'High';
  return 'Very High';
}

function getPollenColor(level: PollenData['level']): string {
  switch (level) {
    case 'None': return '#16a34a';
    case 'Low': return '#3b82f6';
    case 'Moderate': return '#eab308';
    case 'High': return '#f97316';
    case 'Very High': return '#dc2626';
    default: return '#6b7280';
  }
}

function getPollenIcon(level: PollenData['level']): string {
  switch (level) {
    case 'None': return '✅';
    case 'Low': return '🟢';
    case 'Moderate': return '🟡';
    case 'High': return '🟠';
    case 'Very High': return '🔴';
    default: return '❓';
  }
}

function getPollenBgColor(level: PollenData['level'], theme: 'light' | 'dark'): string {
  if (theme === 'dark') {
    switch (level) {
      case 'Very High': return 'bg-red-900/40 border-red-500/50';
      case 'High': return 'bg-orange-900/40 border-orange-500/50';
      case 'Moderate': return 'bg-yellow-900/40 border-yellow-500/50';
      default: return 'bg-white/10 border-white/20';
    }
  } else {
    switch (level) {
      case 'Very High': return 'bg-red-100 border-red-400';
      case 'High': return 'bg-orange-100 border-orange-400';
      case 'Moderate': return 'bg-yellow-100 border-yellow-400';
      default: return 'bg-white/90 border-blue-300';
    }
  }
}

function getPollenRecommendations(level: PollenData['level']): string[] {
  switch (level) {
    case 'Very High':
      return [
        'Take allergy medication before going outside',
        'Limit outdoor activities, especially in morning/evening',
        'Keep windows closed',
        'Shower and change clothes after being outside',
        'Wear sunglasses and a hat',
        'Use HEPA air filters indoors'
      ];
    case 'High':
      return [
        'Take preventive allergy medication',
        'Reduce outdoor exercise',
        'Keep windows closed during peak hours',
        'Wash hands and face after outdoor exposure',
        'Monitor symptoms closely'
      ];
    case 'Moderate':
      return [
        'Take medication if you have allergies',
        'Limit time outside during peak pollen hours',
        'Check pollen forecast before outdoor activities',
        'Keep rescue medications handy'
      ];
    case 'Low':
      return [
        'Minimal precautions needed',
        'Those with severe allergies may want to take medication',
        'Enjoy outdoor activities'
      ];
    default:
      return [];
  }
}
