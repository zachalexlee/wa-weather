'use client';

import { useEffect, useState } from 'react';

interface Props {
  theme: 'light' | 'dark';
}

interface MarineConditions {
  location: string;
  windSpeed: number;
  waveHeight: number;
  visibility: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'hazardous';
  warnings: string[];
}

export default function PugetSoundMarine({ theme }: Props) {
  const [conditions, setConditions] = useState<MarineConditions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarineConditions() {
      try {
        // Using Seattle waterfront as reference point for Puget Sound
        const lat = 47.6062;
        const lon = -122.3321;
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,visibility&hourly=wind_speed_10m&wind_speed_unit=mph&timezone=auto`
        );
        
        if (response.ok) {
          const data = await response.json();
          const windSpeed = data.current?.wind_speed_10m || 0;
          const visibility = (data.current?.visibility || 10000) / 1609; // Convert to miles
          
          // Estimate wave height based on wind (rough approximation)
          // Puget Sound wave formula: wave height ≈ wind speed / 10 (in feet)
          const waveHeight = windSpeed / 10;
          
          // Determine status
          let status: MarineConditions['status'] = 'excellent';
          const warnings: string[] = [];
          
          if (windSpeed > 25 || waveHeight > 4) {
            status = 'hazardous';
            warnings.push('Small Craft Advisory - Dangerous conditions');
            warnings.push('Ferry delays possible');
          } else if (windSpeed > 20 || waveHeight > 3) {
            status = 'poor';
            warnings.push('Rough conditions for small craft');
            warnings.push('Choppy ferry crossings expected');
          } else if (windSpeed > 15 || waveHeight > 2) {
            status = 'fair';
            warnings.push('Moderate conditions - use caution');
          } else if (windSpeed > 10) {
            status = 'good';
          }
          
          if (visibility < 2) {
            warnings.push('⚠️ Low visibility - fog advisory');
            if (status === 'excellent') status = 'good';
          }
          
          setConditions({
            location: 'Puget Sound',
            windSpeed,
            waveHeight,
            visibility,
            status,
            warnings
          });
        }
      } catch (error) {
        console.error('Failed to fetch marine conditions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMarineConditions();
    // Refresh every 30 minutes
    const interval = setInterval(fetchMarineConditions, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`backdrop-blur-md rounded-2xl border p-6 ${
        theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300'
      }`}>
        <div className={`text-center ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
          Loading Puget Sound marine conditions...
        </div>
      </div>
    );
  }

  if (!conditions) return null;

  const statusConfig = getStatusConfig(conditions.status);
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const textSecondary = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';

  return (
    <div className={`backdrop-blur-md rounded-2xl border-2 p-6 ${
      theme === 'dark' 
        ? `bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-${statusConfig.borderColor}-500/50`
        : `bg-gradient-to-br from-blue-100/80 to-cyan-100/80 border-${statusConfig.borderColor}-400`
    }`}>
      <div className="flex items-start gap-4">
        <div className="text-5xl">⛴️</div>

        <div className="flex-1">
          <h3 className={`text-2xl font-bold mb-2 ${textPrimary}`}>
            🌊 Puget Sound Marine & Ferry Conditions
          </h3>

          {/* Status Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white mb-4"
            style={{ backgroundColor: statusConfig.color }}
          >
            <span>{statusConfig.icon}</span>
            <span>{statusConfig.text}</span>
          </div>

          {/* Conditions Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <ConditionCard
              icon="💨"
              label="Wind Speed"
              value={`${Math.round(conditions.windSpeed)} mph`}
              theme={theme}
            />
            <ConditionCard
              icon="🌊"
              label="Wave Height"
              value={`${conditions.waveHeight.toFixed(1)} ft`}
              theme={theme}
            />
            <ConditionCard
              icon="👁️"
              label="Visibility"
              value={`${conditions.visibility.toFixed(1)} mi`}
              theme={theme}
            />
          </div>

          {/* Warnings */}
          {conditions.warnings.length > 0 && (
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-black/30' : 'bg-white/70'
            }`}>
              <h4 className={`font-bold mb-2 ${textPrimary}`}>
                ⚠️ Current Advisories:
              </h4>
              <ul className={`list-disc list-inside space-y-1 text-sm ${textSecondary}`}>
                {conditions.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Ferry Info */}
          <div className={`mt-4 p-3 rounded-lg ${
            theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
          }`}>
            <p className={`text-sm ${textSecondary} mb-2`}>
              <strong>🚢 Ferry Tips:</strong>
            </p>
            <ul className={`list-disc list-inside space-y-1 text-sm ${textSecondary}`}>
              <li>Check <a href="https://wsdot.wa.gov/ferries" target="_blank" rel="noopener noreferrer" className={`font-medium hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>WA State Ferries</a> for real-time schedules</li>
              <li>High winds may cause delays or cancellations</li>
              <li>Arrive early during peak travel times</li>
              <li>Consider motion sickness medication in rough conditions</li>
            </ul>
          </div>

          {/* Boating Safety */}
          {conditions.status !== 'excellent' && conditions.status !== 'good' && (
            <div className={`mt-4 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50'
            }`}>
              <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-900'}`}>
                ⚠️ Boating Safety:
              </p>
              <ul className={`list-disc list-inside space-y-1 text-sm ${theme === 'dark' ? 'text-yellow-100' : 'text-yellow-800'}`}>
                <li>Wear life jackets at all times</li>
                <li>Check vessel before departure</li>
                <li>File a float plan with someone on shore</li>
                <li>Monitor marine radio (VHF Channel 16)</li>
                {conditions.status === 'hazardous' && (
                  <li className="font-bold">⚠️ Consider postponing non-essential trips</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConditionCard({ icon, label, value, theme }: {
  icon: string;
  label: string;
  value: string;
  theme: 'light' | 'dark';
}) {
  const bgClass = theme === 'dark' ? 'bg-white/10' : 'bg-white/90';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  
  return (
    <div className={`${bgClass} rounded-lg p-3 text-center`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {label}
      </div>
      <div className={`text-lg font-bold ${textClass}`}>
        {value}
      </div>
    </div>
  );
}

function getStatusConfig(status: MarineConditions['status']): {
  color: string;
  borderColor: string;
  icon: string;
  text: string;
} {
  switch (status) {
    case 'excellent':
      return { color: '#16a34a', borderColor: 'green', icon: '✅', text: 'Excellent Conditions' };
    case 'good':
      return { color: '#3b82f6', borderColor: 'blue', icon: '👍', text: 'Good Conditions' };
    case 'fair':
      return { color: '#eab308', borderColor: 'yellow', icon: '⚠️', text: 'Fair - Use Caution' };
    case 'poor':
      return { color: '#f97316', borderColor: 'orange', icon: '🌊', text: 'Poor - Rough Conditions' };
    case 'hazardous':
      return { color: '#dc2626', borderColor: 'red', icon: '⛔', text: 'HAZARDOUS - Small Craft Advisory' };
    default:
      return { color: '#6b7280', borderColor: 'gray', icon: '❓', text: 'Unknown' };
  }
}
