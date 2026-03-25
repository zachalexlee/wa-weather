// Push notification management for weather alerts

export interface NotificationPreferences {
  enabled: boolean;
  severeWeather: boolean;
  dailyForecast: boolean;
  rainAlerts: boolean;
  temperatureAlerts: boolean;
  airQualityAlerts: boolean;
  mountainPassAlerts: boolean;
  ferryDelayAlerts: boolean;
  quietHoursStart: number; // 0-23
  quietHoursEnd: number; // 0-23
  savedLocations: string[]; // city names to monitor
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: false,
  severeWeather: true,
  dailyForecast: true,
  rainAlerts: true,
  temperatureAlerts: false,
  airQualityAlerts: true,
  mountainPassAlerts: false,
  ferryDelayAlerts: false,
  quietHoursStart: 22, // 10 PM
  quietHoursEnd: 7, // 7 AM
  savedLocations: []
};

export function getNotificationPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  
  try {
    const stored = localStorage.getItem('notificationPreferences');
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load notification preferences:', error);
  }
  
  return DEFAULT_PREFERENCES;
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('notificationPreferences', JSON.stringify(prefs));
  } catch (error) {
    console.error('Failed to save notification preferences:', error);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function showNotification(title: string, options?: NotificationOptions): void {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    // Check quiet hours
    const prefs = getNotificationPreferences();
    const currentHour = new Date().getHours();
    
    const inQuietHours = prefs.quietHoursStart < prefs.quietHoursEnd
      ? currentHour >= prefs.quietHoursStart && currentHour < prefs.quietHoursEnd
      : currentHour >= prefs.quietHoursStart || currentHour < prefs.quietHoursEnd;
    
    if (inQuietHours && !options?.tag?.includes('severe')) {
      return; // Skip non-severe notifications during quiet hours
    }

    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });
  }
}

export interface WeatherAlert {
  type: 'severe' | 'rain' | 'temperature' | 'airQuality' | 'pass' | 'ferry';
  title: string;
  message: string;
  urgent: boolean;
}

export function shouldShowAlert(alert: WeatherAlert, prefs: NotificationPreferences): boolean {
  if (!prefs.enabled) return false;
  
  switch (alert.type) {
    case 'severe':
      return prefs.severeWeather;
    case 'rain':
      return prefs.rainAlerts;
    case 'temperature':
      return prefs.temperatureAlerts;
    case 'airQuality':
      return prefs.airQualityAlerts;
    case 'pass':
      return prefs.mountainPassAlerts;
    case 'ferry':
      return prefs.ferryDelayAlerts;
    default:
      return false;
  }
}

export function scheduleAlert(alert: WeatherAlert, delayMinutes: number): void {
  if (typeof window === 'undefined') return;
  
  setTimeout(() => {
    const prefs = getNotificationPreferences();
    if (shouldShowAlert(alert, prefs)) {
      showNotification(alert.title, {
        body: alert.message,
        tag: alert.type,
        requireInteraction: alert.urgent
      });
    }
  }, delayMinutes * 60 * 1000);
}
