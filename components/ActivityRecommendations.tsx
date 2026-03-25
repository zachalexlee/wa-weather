'use client';

import { type CurrentWeather } from '@/lib/weather';

interface Props {
  weather: CurrentWeather;
  theme: 'light' | 'dark';
}

interface Activity {
  name: string;
  icon: string;
  score: number; // 0-10
  reason: string;
}

export default function ActivityRecommendations({ weather, theme }: Props) {
  const activities = calculateActivityScores(weather);
  const topActivities = activities.sort((a, b) => b.score - a.score).slice(0, 6);

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const textSecondary = theme === 'dark' ? 'text-blue-200' : 'text-blue-700';

  return (
    <div className={`backdrop-blur-md rounded-2xl border p-6 ${
      theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-blue-300'
    }`}>
      <h3 className={`text-2xl font-bold mb-4 ${textPrimary}`}>
        🏃 Outdoor Activity Recommendations
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topActivities.map((activity) => (
          <ActivityCard key={activity.name} activity={activity} theme={theme} />
        ))}
      </div>

      <p className={`mt-4 text-sm ${textSecondary}`}>
        Scores based on temperature, precipitation, wind, UV, and air quality.
      </p>
    </div>
  );
}

function ActivityCard({ activity, theme }: { activity: Activity; theme: 'light' | 'dark' }) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return '#16a34a'; // Green
    if (score >= 6) return '#eab308'; // Yellow
    if (score >= 4) return '#f97316'; // Orange
    return '#dc2626'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  const bgClass = theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white/70 hover:bg-white';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`${bgClass} rounded-xl p-4 border ${
      theme === 'dark' ? 'border-white/10' : 'border-blue-200'
    } transition-all duration-200 hover:scale-[1.02]`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{activity.icon}</span>
          <h4 className={`font-bold ${textPrimary}`}>{activity.name}</h4>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium ${textSecondary}`}>
            {getScoreLabel(activity.score)}
          </span>
          <span className={`text-lg font-bold`} style={{ color: getScoreColor(activity.score) }}>
            {activity.score}/10
          </span>
        </div>
        <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(activity.score / 10) * 100}%`,
              backgroundColor: getScoreColor(activity.score)
            }}
          />
        </div>
      </div>

      {/* Reason */}
      <p className={`text-sm ${textSecondary}`}>
        {activity.reason}
      </p>
    </div>
  );
}

function calculateActivityScores(weather: CurrentWeather): Activity[] {
  const temp = weather.temp;
  const feelsLike = weather.feels_like;
  const rain = weather.description.toLowerCase().includes('rain') || weather.description.toLowerCase().includes('drizzle');
  const windSpeed = weather.wind_speed;
  const uv = weather.uv_index || 5;
  const aqi = weather.aqi || 50;
  const clouds = weather.clouds;

  // Helper function to score temperature comfort
  const tempScore = (ideal: number, range: number) => {
    const diff = Math.abs(feelsLike - ideal);
    if (diff <= range) return 10 - (diff / range) * 3;
    return Math.max(0, 7 - (diff - range) / 5);
  };

  // Hiking
  const hikingScore = Math.min(10, (
    tempScore(65, 15) * 0.4 +
    (rain ? 2 : 10) * 0.3 +
    (windSpeed < 15 ? 10 : Math.max(0, 10 - windSpeed / 3)) * 0.2 +
    (aqi < 100 ? 10 : Math.max(0, 10 - (aqi - 100) / 10)) * 0.1
  ));

  // Running
  const runningScore = Math.min(10, (
    tempScore(55, 15) * 0.4 +
    (rain ? 3 : 10) * 0.2 +
    (windSpeed < 10 ? 10 : Math.max(0, 10 - windSpeed / 2)) * 0.2 +
    (aqi < 100 ? 10 : Math.max(0, 10 - (aqi - 100) / 10)) * 0.2
  ));

  // Biking
  const bikingScore = Math.min(10, (
    tempScore(60, 20) * 0.3 +
    (rain ? 1 : 10) * 0.3 +
    (windSpeed < 12 ? 10 : Math.max(0, 10 - windSpeed / 2.5)) * 0.3 +
    (aqi < 100 ? 10 : Math.max(0, 10 - (aqi - 100) / 10)) * 0.1
  ));

  // Photography
  const photographyScore = Math.min(10, (
    tempScore(65, 25) * 0.2 +
    (clouds > 30 && clouds < 80 ? 10 : clouds < 30 ? 7 : 5) * 0.4 + // Interesting clouds
    (rain ? 6 : 8) * 0.2 + // Rain can be dramatic
    (windSpeed < 20 ? 10 : Math.max(0, 10 - windSpeed / 3)) * 0.2
  ));

  // Golf
  const golfScore = Math.min(10, (
    tempScore(70, 15) * 0.4 +
    (rain ? 0 : 10) * 0.4 +
    (windSpeed < 15 ? 10 : Math.max(0, 10 - windSpeed / 2)) * 0.2
  ));

  // Fishing
  const fishingScore = Math.min(10, (
    tempScore(65, 20) * 0.3 +
    (clouds > 40 ? 10 : 7) * 0.3 + // Fish bite better in cloudy weather
    (rain && !weather.description.includes('heavy') ? 8 : rain ? 4 : 7) * 0.2 +
    (windSpeed < 15 ? 10 : Math.max(0, 10 - windSpeed / 2)) * 0.2
  ));

  // Gardening
  const gardeningScore = Math.min(10, (
    tempScore(68, 20) * 0.3 +
    (rain ? 4 : 9) * 0.2 +
    (windSpeed < 10 ? 10 : Math.max(0, 10 - windSpeed / 2)) * 0.2 +
    (uv < 8 ? 10 : Math.max(0, 10 - (uv - 8))) * 0.15 +
    (aqi < 100 ? 10 : Math.max(0, 10 - (aqi - 100) / 10)) * 0.15
  ));

  // Picnic
  const picnicScore = Math.min(10, (
    tempScore(72, 12) * 0.4 +
    (rain ? 0 : 10) * 0.4 +
    (windSpeed < 10 ? 10 : Math.max(0, 10 - windSpeed / 2)) * 0.2
  ));

  return [
    {
      name: 'Hiking',
      icon: '🥾',
      score: Math.round(hikingScore * 10) / 10,
      reason: hikingScore >= 7 ? 'Great conditions for hitting the trails!' :
              hikingScore >= 5 ? 'Decent conditions, bring layers.' :
              'Not ideal, but doable if you dress right.'
    },
    {
      name: 'Running',
      icon: '🏃',
      score: Math.round(runningScore * 10) / 10,
      reason: runningScore >= 7 ? 'Perfect running weather!' :
              runningScore >= 5 ? 'Good conditions for a run.' :
              aqi > 100 ? 'Air quality makes outdoor exercise difficult.' :
              'Too hot/cold or windy for comfortable running.'
    },
    {
      name: 'Biking',
      icon: '🚴',
      score: Math.round(bikingScore * 10) / 10,
      reason: bikingScore >= 7 ? 'Ideal for cycling!' :
              bikingScore >= 5 ? 'Decent biking conditions.' :
              rain ? 'Wet roads, be cautious.' :
              'Wind or weather not ideal for biking.'
    },
    {
      name: 'Photography',
      icon: '📷',
      score: Math.round(photographyScore * 10) / 10,
      reason: photographyScore >= 7 ? 'Beautiful light and conditions!' :
              photographyScore >= 5 ? 'Good photo opportunities.' :
              'Flat light or challenging conditions.'
    },
    {
      name: 'Golf',
      icon: '⛳',
      score: Math.round(golfScore * 10) / 10,
      reason: golfScore >= 7 ? 'Excellent golfing weather!' :
              golfScore >= 5 ? 'Playable conditions.' :
              rain ? 'Too wet for golf.' :
              'Wind or temperature not ideal.'
    },
    {
      name: 'Fishing',
      icon: '🎣',
      score: Math.round(fishingScore * 10) / 10,
      reason: fishingScore >= 7 ? 'Fish are likely biting!' :
              fishingScore >= 5 ? 'Decent fishing conditions.' :
              'Challenging conditions for fishing.'
    },
    {
      name: 'Gardening',
      icon: '🌱',
      score: Math.round(gardeningScore * 10) / 10,
      reason: gardeningScore >= 7 ? 'Perfect for outdoor gardening!' :
              gardeningScore >= 5 ? 'Good time to tend your garden.' :
              'Too hot/cold or poor air quality.'
    },
    {
      name: 'Picnic',
      icon: '🧺',
      score: Math.round(picnicScore * 10) / 10,
      reason: picnicScore >= 7 ? 'Perfect picnic weather!' :
              picnicScore >= 5 ? 'Bring a blanket and enjoy!' :
              rain ? 'Too wet for outdoor dining.' :
              'Wind or temperature not comfortable.'
    }
  ];
}
