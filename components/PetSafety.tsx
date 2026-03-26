'use client';

import { motion } from 'framer-motion';
import { CurrentWeather, HourlyForecast } from '@/lib/weather';

interface PetSafetyProps {
  currentWeather: CurrentWeather;
  hourlyForecast: HourlyForecast[];
}

export default function PetSafety({ currentWeather, hourlyForecast }: PetSafetyProps) {
  const temp = currentWeather.temp;
  const feelsLike = currentWeather.feels_like;
  
  // Calculate paw safety
  let pawSafety: 'safe' | 'caution' | 'danger' = 'safe';
  let pawMessage = '';
  
  if (temp > 85) {
    pawSafety = 'danger';
    pawMessage = 'Too hot for paws! Pavement can be 140°F+';
  } else if (temp > 77) {
    pawSafety = 'caution';
    pawMessage = 'Warm pavement - walk on grass when possible';
  } else if (temp < 20) {
    pawSafety = 'danger';
    pawMessage = 'Too cold! Risk of frostbite on paws';
  } else if (temp < 32) {
    pawSafety = 'caution';
    pawMessage = 'Cold conditions - consider booties';
  } else {
    pawMessage = 'Perfect for walks!';
  }
  
  // Walk recommendations
  const walkScore = temp > 85 || temp < 20 ? 'Avoid' : temp > 77 || temp < 32 ? 'Short Walks' : 'Great';
  
  // Heat stress risk
  const heatStressRisk = feelsLike > 85 ? 'High' : feelsLike > 75 ? 'Moderate' : 'Low';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
        <h2 className="text-3xl font-bold mb-2">🐾 Pet Safety</h2>
        <p className="text-sm text-white/70 mb-6">Weather safety tips for your furry friends</p>

        {/* Paw Safety Alert */}
        <div className={`mb-6 p-6 rounded-2xl border-2 ${
          pawSafety === 'danger' 
            ? 'bg-red-500/20 border-red-500/50' 
            : pawSafety === 'caution'
            ? 'bg-yellow-500/20 border-yellow-500/50'
            : 'bg-green-500/20 border-green-500/50'
        }`}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">
              {pawSafety === 'danger' ? '🚫' : pawSafety === 'caution' ? '⚠️' : '✅'}
            </div>
            <div>
              <div className="text-2xl font-bold">
                {pawSafety === 'danger' ? 'Paw Danger!' : pawSafety === 'caution' ? 'Paw Caution' : 'Paw Safe'}
              </div>
              <div className="text-lg">{pawMessage}</div>
              <div className="text-sm text-white/70 mt-2">
                Current: {Math.round(temp)}°F • Feels like: {Math.round(feelsLike)}°F
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🚶</div>
            <div className="text-sm text-white/70">Walking</div>
            <div className="font-bold">{walkScore}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🌡️</div>
            <div className="text-sm text-white/70">Heat Stress</div>
            <div className="font-bold">{heatStressRisk}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">💦</div>
            <div className="text-sm text-white/70">Hydration</div>
            <div className="font-bold">{temp > 75 ? 'Critical' : 'Normal'}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-sm text-white/70">Best Time</div>
            <div className="font-bold text-xs">{temp > 80 ? 'Early/Late' : 'Anytime'}</div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-black/20 rounded-xl p-4 mb-6">
          <h3 className="font-semibold mb-3">💡 Today's Recommendations</h3>
          <div className="space-y-2">
            {temp > 85 && (
              <div className="flex items-start gap-3 bg-red-500/10 rounded-lg p-3">
                <span className="text-xl">🥵</span>
                <div>
                  <div className="font-medium">Extreme Heat Alert</div>
                  <div className="text-sm text-white/70">
                    • Walk only early morning or late evening<br/>
                    • Never leave pets in car<br/>
                    • Provide constant water access<br/>
                    • Watch for panting/drooling
                  </div>
                </div>
              </div>
            )}
            
            {temp < 32 && (
              <div className="flex items-start gap-3 bg-blue-500/10 rounded-lg p-3">
                <span className="text-xl">🥶</span>
                <div>
                  <div className="font-medium">Cold Weather Alert</div>
                  <div className="text-sm text-white/70">
                    • Consider dog sweaters for short-haired breeds<br/>
                    • Wipe paws after walks (salt/ice melt)<br/>
                    • Limit outdoor time for small dogs<br/>
                    • Check paws for ice/cracks
                  </div>
                </div>
              </div>
            )}
            
            {temp >= 32 && temp <= 85 && (
              <div className="flex items-start gap-3 bg-green-500/10 rounded-lg p-3">
                <span className="text-xl">✅</span>
                <div>
                  <div className="font-medium">Great Weather for Pets!</div>
                  <div className="text-sm text-white/70">
                    Perfect conditions for outdoor activities. Enjoy walks, playtime, and exercise!
                  </div>
                </div>
              </div>
            )}
            
            {currentWeather.humidity > 80 && temp > 70 && (
              <div className="flex items-start gap-3 bg-yellow-500/10 rounded-lg p-3">
                <span className="text-xl">💦</span>
                <div>
                  <div className="font-medium">High Humidity</div>
                  <div className="text-sm text-white/70">
                    Dogs can't cool off as easily. Take frequent breaks and provide water.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Breed-Specific Tips */}
        <div className="bg-black/20 rounded-xl p-4">
          <h3 className="font-semibold mb-3">🐕 Breed Considerations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold mb-1">🐕 Large Breeds</div>
              <div className="text-xs text-white/70">
                More heat-sensitive. Watch German Shepherds, Golden Retrievers in summer.
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold mb-1">🐩 Short-Haired</div>
              <div className="text-xs text-white/70">
                Need protection in cold. Consider sweaters under 40°F.
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="font-bold mb-1">🐾 Small Dogs</div>
              <div className="text-xs text-white/70">
                Cool/heat faster. More frequent breaks in extreme weather.
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Signs */}
        <div className="mt-6 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
          <p className="text-sm">
            <strong>⚠️ Emergency Signs:</strong> Excessive panting, drooling, lethargy, vomiting, 
            unsteady gait, or glazed eyes require immediate vet attention. Heat stroke and hypothermia 
            are life-threatening!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
