# 🚀 Deploy to Netlify - Quick Guide

Your Washington Weather Hub is ready to deploy!

## Option 1: Deploy via Netlify UI (Easiest - 5 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `wa-weather`
3. Make it Public or Private (your choice)
4. Click "Create repository"

### Step 2: Push Code to GitHub

```bash
cd /root/clawd/wa-weather

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/wa-weather.git

# Push code
git branch -M main
git push -u origin main
```

If it asks for authentication, use a Personal Access Token:
- Go to https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Give it `repo` permissions
- Use the token as your password when pushing

### Step 3: Deploy on Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub
5. Select the `wa-weather` repository
6. Build settings (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `.next`
7. **Add Environment Variable:**
   - Click "Add environment variables"
   - Key: `NEXT_PUBLIC_OPENWEATHER_API_KEY`
   - Value: Get your API key from https://openweathermap.org/api
8. Click "Deploy site"

**Your site will be live in 2-3 minutes!**

Netlify will give you a URL like: `https://wa-weather-abc123.netlify.app`

### Step 4: Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add domain"
3. Enter your domain (e.g., `waweather.com`)
4. Follow DNS configuration instructions
5. Done! Your site will be live at your custom domain

---

## Option 2: Deploy via Netlify CLI

```bash
# 1. Install Netlify CLI (already done)
npm install -g netlify-cli

# 2. Login to Netlify
netlify login
# This will open a browser window to authorize

# 3. Initialize Netlify site
cd /root/clawd/wa-weather
netlify init

# Follow prompts:
# - Create & configure a new site? Yes
# - Team: Select your team
# - Site name: wa-weather (or custom name)
# - Build command: npm run build
# - Publish directory: .next

# 4. Set environment variable
netlify env:set NEXT_PUBLIC_OPENWEATHER_API_KEY your_api_key_here

# 5. Deploy!
netlify deploy --prod
```

**Your site is now live!**

---

## Get Your OpenWeatherMap API Key

1. Go to https://openweathermap.org/api
2. Click "Sign Up" (free tier is perfect!)
3. Verify your email
4. Go to https://home.openweathermap.org/api_keys
5. Copy your API key

**Free tier includes:**
- 1,000 API calls per day
- 60 calls per minute
- More than enough for personal use!

---

## Troubleshooting

### Build fails with "Module not found"

Make sure all dependencies are in `package.json`:
```bash
cd /root/clawd/wa-weather
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

Netlify will auto-redeploy.

### Map not loading

1. Check environment variable is set correctly in Netlify
2. Make sure `NEXT_PUBLIC_` prefix is included
3. Redeploy: Netlify dashboard → "Deploys" → "Trigger deploy"

### API not working

1. Verify API key is active at OpenWeatherMap
2. Check you haven't exceeded free tier limits
3. Wait 10 minutes after creating API key (activation time)

---

## Update Your Deployed Site

```bash
# Make changes locally
# Commit and push
git add .
git commit -m "Update: your changes"
git push

# Netlify auto-deploys on push!
```

---

## Monitor Your Site

**Netlify Dashboard:**
- https://app.netlify.com
- View deploy logs, build history, analytics
- Configure custom domains, SSL certificates
- Set up form handling, serverless functions

**OpenWeatherMap Dashboard:**
- https://home.openweathermap.org
- Monitor API usage
- Upgrade plan if needed

---

**Your weather app is ready to go live!** 🌤️

Any issues? Let me know!
