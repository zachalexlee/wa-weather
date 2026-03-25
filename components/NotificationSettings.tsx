'use client';

import { useState, useEffect } from 'react';
import { 
  getNotificationPreferences, 
  saveNotificationPreferences, 
  requestNotificationPermission,
  type NotificationPreferences 
} from '@/lib/notifications';

interface Props {
  theme: 'light' | 'dark';
  onClose: () => void;
}

export default function NotificationSettings({ theme, onClose }: Props) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(getNotificationPreferences());
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermission('granted');
      setPrefs({ ...prefs, enabled: true });
    } else {
      setPermission(Notification.permission);
    }
  };

  const handleSave = () => {
    setSaving(true);
    saveNotificationPreferences(prefs);
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 500);
  };

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgClass = theme === 'dark' ? 'bg-blue-900' : 'bg-white';
  const borderClass = theme === 'dark' ? 'border-white/20' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
      <div className={`${bgClass} rounded-2xl border-2 ${borderClass} p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${textPrimary}`}>
            🔔 Notification Settings
          </h2>
          <button
            onClick={onClose}
            className={`text-2xl ${textSecondary} hover:opacity-70`}
          >
            ✕
          </button>
        </div>

        {permission !== 'granted' ? (
          <div className={`p-4 rounded-lg mb-6 ${
            theme === 'dark' ? 'bg-blue-800/30' : 'bg-blue-50'
          }`}>
            <p className={`mb-3 ${textPrimary}`}>
              Enable notifications to receive weather alerts and updates.
            </p>
            <button
              onClick={handleEnableNotifications}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Enable Notifications
            </button>
            {permission === 'denied' && (
              <p className={`mt-3 text-sm ${textSecondary}`}>
                Notifications are blocked. Please enable them in your browser settings.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Master Toggle */}
            <div className={`p-4 rounded-lg mb-4 ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <label className="flex items-center justify-between cursor-pointer">
                <span className={`font-medium ${textPrimary}`}>
                  Enable All Notifications
                </span>
                <input
                  type="checkbox"
                  checked={prefs.enabled}
                  onChange={(e) => setPrefs({ ...prefs, enabled: e.target.checked })}
                  className="w-5 h-5"
                />
              </label>
            </div>

            {/* Alert Types */}
            <div className="space-y-3 mb-6">
              <h3 className={`font-bold mb-2 ${textPrimary}`}>Alert Types</h3>
              
              <SettingToggle
                label="⚠️ Severe Weather Alerts"
                description="Thunderstorms, high winds, flooding"
                checked={prefs.severeWeather}
                onChange={(checked) => setPrefs({ ...prefs, severeWeather: checked })}
                disabled={!prefs.enabled}
                theme={theme}
              />

              <SettingToggle
                label="🌧️ Rain Alerts"
                description="Rain starting soon notifications"
                checked={prefs.rainAlerts}
                onChange={(checked) => setPrefs({ ...prefs, rainAlerts: checked })}
                disabled={!prefs.enabled}
                theme={theme}
              />

              <SettingToggle
                label="🌡️ Temperature Alerts"
                description="Freezing temps, extreme heat"
                checked={prefs.temperatureAlerts}
                onChange={(checked) => setPrefs({ ...prefs, temperatureAlerts: checked })}
                disabled={!prefs.enabled}
                theme={theme}
              />

              <SettingToggle
                label="🔥 Air Quality Alerts"
                description="Smoke, poor AQI warnings"
                checked={prefs.airQualityAlerts}
                onChange={(checked) => setPrefs({ ...prefs, airQualityAlerts: checked })}
                disabled={!prefs.enabled}
                theme={theme}
              />

              <SettingToggle
                label="🏔️ Mountain Pass Alerts"
                description="Pass closures, chain requirements"
                checked={prefs.mountainPassAlerts}
                onChange={(checked) => setPrefs({ ...prefs, mountainPassAlerts: checked })}
                disabled={!prefs.enabled}
                theme={theme}
              />

              <SettingToggle
                label="⛴️ Ferry Delay Alerts"
                description="Rough conditions, cancellations"
                checked={prefs.ferryDelayAlerts}
                onChange={(checked) => setPrefs({ ...prefs, ferryDelayAlerts: checked })}
                disabled={!prefs.enabled}
                theme={theme}
              />

              <SettingToggle
                label="📅 Daily Forecast"
                description="Morning weather summary"
                checked={prefs.dailyForecast}
                onChange={(checked) => setPrefs({ ...prefs, dailyForecast: checked })}
                disabled={!prefs.enabled}
                theme={theme}
              />
            </div>

            {/* Quiet Hours */}
            <div className={`p-4 rounded-lg mb-6 ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <h3 className={`font-bold mb-3 ${textPrimary}`}>
                🌙 Quiet Hours
              </h3>
              <p className={`text-sm mb-3 ${textSecondary}`}>
                No non-urgent notifications during these hours
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${textSecondary} block mb-1`}>
                    Start Time
                  </label>
                  <select
                    value={prefs.quietHoursStart}
                    onChange={(e) => setPrefs({ ...prefs, quietHoursStart: parseInt(e.target.value) })}
                    disabled={!prefs.enabled}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-blue-800 text-white' 
                        : 'bg-white border border-gray-300 text-gray-900'
                    }`}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`text-sm ${textSecondary} block mb-1`}>
                    End Time
                  </label>
                  <select
                    value={prefs.quietHoursEnd}
                    onChange={(e) => setPrefs({ ...prefs, quietHoursEnd: parseInt(e.target.value) })}
                    disabled={!prefs.enabled}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-blue-800 text-white' 
                        : 'bg-white border border-gray-300 text-gray-900'
                    }`}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-bold transition-colors"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              <button
                onClick={onClose}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SettingToggle({ 
  label, 
  description, 
  checked, 
  onChange, 
  disabled,
  theme 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  disabled: boolean;
  theme: 'light' | 'dark';
}) {
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  
  return (
    <label className={`flex items-start justify-between p-3 rounded-lg cursor-pointer ${
      disabled ? 'opacity-50' : ''
    } ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
      <div className="flex-1">
        <div className={`font-medium ${textPrimary}`}>{label}</div>
        <div className={`text-sm ${textSecondary}`}>{description}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-5 h-5 mt-1"
      />
    </label>
  );
}
