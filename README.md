# ☀️ Washington Weather Hub

A beautiful, modern weather application for Washington State featuring real-time conditions, 10-day forecasts, and interactive doppler radar maps.

## ✨ Features

- **Current Weather** - Real-time conditions with comprehensive data
  - Temperature (current, feels like, high/low)
  - Wind speed & direction
  - Humidity, pressure, visibility
  - Cloud cover
  - Sunrise & sunset times

- **10-Day Forecast** - Detailed daily forecasts
  - High/low temperatures
  - Weather conditions & descriptions
  - Precipitation probability
  - Wind speed
  - Humidity levels

- **Interactive Radar Map** - Live weather visualization
  - Switchable layers: Precipitation, Clouds, Temperature
  - Zoom & pan controls
  - Real-time weather overlays
  - Location markers for 25 Washington cities

- **Beautiful UI** - Modern, animated interface
  - Gradient backgrounds
  - Glassmorphism design
  - Smooth animations (Framer Motion)
  - Fully responsive (mobile, tablet, desktop)

- **25 Washington Cities** - Coverage across the state
  - Puget Sound: Seattle, Tacoma, Bellevue, Everett, etc.
  - Eastern WA: Spokane, Spokane Valley
  - Tri-Cities: Kennewick, Pasco, Richland
  - And more!

## 🚀 Quick Start

### 1. Get an OpenWeatherMap API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click "Get API Key" or "Sign Up"
3. Create a free account
4. Navigate to "API keys" in your account
5. Copy your API key

**Free Tier Limits:**
- 1,000 API calls per day
- 60 calls per minute
- Perfect for personal use!

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local and add your API key
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📦 Tech Stack

- **Framework:** Next.js 15 (React 19, App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Maps:** Leaflet + React Leaflet
- **Weather Data:** OpenWeatherMap API
- **Deployment:** Vercel-ready

## 🌐 Deploy to Vercel

**One-click deployment:**

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variable:
   - Key: `NEXT_PUBLIC_OPENWEATHER_API_KEY`
   - Value: Your OpenWeatherMap API key
6. Click "Deploy"

**Your weather app will be live in ~2 minutes!**

Custom domain setup available in Vercel settings.

## 🏗️ Project Structure

```
wa-weather/
├── app/
│   ├── page.tsx              # Main page with location selector
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── CurrentWeatherCard.tsx   # Current conditions display
│   ├── ForecastList.tsx         # 10-day forecast grid
│   └── RadarMap.tsx             # Interactive Leaflet map
├── lib/
│   ├── cities.ts             # Washington cities data
│   └── weather.ts            # Weather API utilities
├── .env.local.example        # Environment template
└── README.md
```

## 🎨 Customization

### Add More Cities

Edit `lib/cities.ts`:

```typescript
export const washingtonCities = [
  { name: 'Your City', lat: 47.1234, lon: -122.5678, region: 'Your Region' },
  // ... existing cities
];
```

### Change Color Scheme

Edit `app/page.tsx` gradient:

```typescript
<div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-900">
```

### Modify Map Layers

Add custom layers in `components/RadarMap.tsx`:

```typescript
<TileLayer
  url="https://your-custom-tile-server/{z}/{x}/{y}.png"
  attribution="Your attribution"
/>
```

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📊 API Usage

**OpenWeatherMap Calls:**
- Current weather: 1 call per location change
- Forecast: 1 call per location change
- Map tiles: Loaded as user pans/zooms

**Optimization Tips:**
- Cache API responses (add React Query or SWR)
- Limit auto-refresh frequency
- Use localStorage for last-selected city

## 🐛 Troubleshooting

**Map not loading?**
- Check browser console for errors
- Verify Leaflet CSS is imported
- Try refreshing the page

**Weather data not showing?**
- Verify `.env.local` has correct API key
- Check API key is active at OpenWeatherMap
- Ensure you haven't exceeded rate limits

**Styles look broken?**
- Run `npm run build` to regenerate Tailwind
- Clear browser cache
- Check for CSS conflicts

## 📝 License

MIT License - Free to use and modify!

## 🙏 Credits

- Weather data: [OpenWeatherMap](https://openweathermap.org/)
- Maps: [OpenStreetMap](https://www.openstreetmap.org/) & [Leaflet](https://leafletjs.com/)
- Icons: OpenWeatherMap weather icons
- Built with [Next.js](https://nextjs.org/)

---

**Enjoy your Washington weather!** ☀️🌧️❄️
