# 🚀 Deployment Guide - Washington Weather Hub

## Deploy to Vercel (Recommended - Easiest)

### Step 1: Get OpenWeatherMap API Key

1. Go to https://openweathermap.org/api
2. Click "Sign Up" (it's free!)
3. Verify your email
4. Go to "API keys" in your account dashboard
5. Copy your API key (looks like: `a1b2c3d4e5f6g7h8i9j0`)

### Step 2: Push to GitHub

```bash
# Initialize git (if not already)
cd /root/clawd/wa-weather
git init

# Create .gitignore (Next.js template already includes this)
# It will ignore .env.local, node_modules, .next, etc.

# Add and commit
git add .
git commit -m "Initial commit - Washington Weather Hub"

# Create a new repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/wa-weather.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

**Method A: Via Vercel Website**

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New..." → "Project"
4. Import your `wa-weather` repository
5. **Add Environment Variable:**
   - Name: `NEXT_PUBLIC_OPENWEATHER_API_KEY`
   - Value: (paste your API key)
6. Click "Deploy"

**Your app will be live in ~2 minutes!**

URL will be: `https://wa-weather-YOUR_USERNAME.vercel.app`

**Method B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
cd /root/clawd/wa-weather
vercel

# Follow prompts, then add environment variable:
vercel env add NEXT_PUBLIC_OPENWEATHER_API_KEY
# Paste your API key when prompted

# Redeploy with env variable
vercel --prod
```

### Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `waweather.com`)
4. Follow DNS configuration instructions
5. Done! Your app will be live at your custom domain

---

## Deploy to Netlify

### Via Netlify Website

1. Push code to GitHub (see Step 2 above)
2. Go to https://netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. **Add Environment Variable:**
   - Key: `NEXT_PUBLIC_OPENWEATHER_API_KEY`
   - Value: (your API key)
7. Click "Deploy"

---

## Deploy to Your Own Server (VPS)

### Requirements
- Node.js 18+ installed
- Port 3000 open (or configure different port)

### Setup

```bash
# 1. Clone your repo on server
git clone https://github.com/YOUR_USERNAME/wa-weather.git
cd wa-weather

# 2. Install dependencies
npm install

# 3. Create .env.local
nano .env.local
# Add: NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here

# 4. Build for production
npm run build

# 5. Start production server
npm start
```

### Run with PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start app with PM2
pm2 start npm --name "wa-weather" -- start

# Save PM2 config
pm2 save

# Auto-start on reboot
pm2 startup
```

### Configure Nginx (Optional - for custom domain)

```nginx
server {
    listen 80;
    server_name waweather.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Environment Variables

### Required

- `NEXT_PUBLIC_OPENWEATHER_API_KEY` - Your OpenWeatherMap API key

### Optional (for future enhancements)

- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - Google Analytics tracking
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Alternative map provider
- `NEXT_PUBLIC_WEATHERBIT_API_KEY` - Alternative weather API

---

## Performance Tips

### After Deployment

1. **Enable Caching:**
   - Vercel/Netlify handle this automatically
   - For custom servers, configure Nginx/Apache caching

2. **Add Analytics:**
   ```bash
   npm install @vercel/analytics
   ```
   Then add to `app/layout.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

3. **Monitor API Usage:**
   - Check OpenWeatherMap dashboard
   - Free tier: 1,000 calls/day
   - Upgrade if needed

4. **SEO Optimization:**
   - Already configured in `app/layout.tsx`
   - Add sitemap: `app/sitemap.ts`
   - Add robots.txt: `public/robots.txt`

---

## Troubleshooting

**Build fails?**
- Check Node.js version: `node --version` (should be 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

**API not working on production?**
- Verify environment variable is set correctly
- Check browser console for CORS errors
- Ensure API key is active at OpenWeatherMap

**Map not loading?**
- Check browser console for Leaflet errors
- Verify `leaflet` CSS is imported in `globals.css`
- Try hard refresh: Ctrl+Shift+R

---

## Monitoring & Maintenance

### Check Deployment Status

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Deployments tab shows build logs & status

**Netlify:**
- Dashboard: https://app.netlify.com
- Deploys tab shows build history

### Update Weather App

```bash
# 1. Make changes locally
# 2. Commit and push
git add .
git commit -m "Update: your changes"
git push

# Vercel/Netlify will auto-deploy on push!
```

### Monitor API Usage

- OpenWeatherMap dashboard: https://home.openweathermap.org/api_keys
- Check daily calls remaining
- Upgrade plan if needed (paid plans start at $40/mo for 100k calls)

---

## Support & Issues

Having trouble? Check:
- GitHub Issues (if you publish as open source)
- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs
- OpenWeatherMap API docs: https://openweathermap.org/api

---

**Your weather app is now live!** 🎉

Share it with friends, add it to your portfolio, or keep improving it!
