# 🚀 DEPLOY NOW - Easiest Method (5 Minutes)

Your Washington Weather Hub is **READY TO DEPLOY!**

## 🎯 Quick Deploy via Netlify Drop

This is the **EASIEST** way - no Git, no CLI, just drag & drop!

### Step 1: Get Your API Key (2 minutes)

1. Go to: **https://openweathermap.org/api**
2. Click "Sign Up" (it's free!)
3. Verify your email
4. Go to: **https://home.openweathermap.org/api_keys**
5. **Copy your API key** (looks like: `a1b2c3d4e5f6...`)

### Step 2: Add API Key to Build (1 minute)

**On your server, run:**

```bash
cd /root/clawd/wa-weather

# Edit .env.local
nano .env.local

# Replace the demo key with your real key:
NEXT_PUBLIC_OPENWEATHER_API_KEY=paste_your_key_here

# Save: Ctrl+X, Y, Enter

# Rebuild with your key
npm run build
```

### Step 3: Deploy to Netlify (2 minutes)

**Option A: Via Netlify CLI (If you have Netlify account)**

```bash
cd /root/clawd/wa-weather

# Login to Netlify (opens browser)
netlify login

# Deploy!
netlify deploy --prod

# Follow the prompts:
# - Create new site? Yes
# - Site name: wa-weather (or your custom name)
# - Publish directory: .next

# Your site will be live!
```

**Option B: Via GitHub + Netlify UI**

1. **Push to GitHub:**
   ```bash
   cd /root/clawd/wa-weather
   
   # Create repo on GitHub.com first, then:
   git remote add origin https://github.com/YOUR_USERNAME/wa-weather.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Netlify:**
   - Go to: **https://app.netlify.com**
   - Click "Add new site" → "Import from Git"
   - Select your `wa-weather` repo
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - **Add environment variable:**
     - Key: `NEXT_PUBLIC_OPENWEATHER_API_KEY`
     - Value: (your API key)
   - Click "Deploy"

**Your site will be live at: `https://wa-weather-XXXXX.netlify.app`**

---

## ✅ Verify It's Working

1. Open your Netlify URL
2. You should see the weather app with Seattle selected
3. Try switching cities
4. Check the radar map loads
5. Verify 10-day forecast shows data

---

## 🎨 Customize Your URL

In Netlify dashboard:
1. Go to "Site settings" → "Site information"
2. Click "Change site name"
3. Enter custom name: `my-weather-app`
4. Your URL becomes: `https://my-weather-app.netlify.app`

---

## 🌐 Add Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Netlify: "Domain settings" → "Add domain"
3. Follow DNS configuration instructions
4. Wait 24-48 hours for DNS propagation
5. Done! Your site is live at your domain

---

## 📊 Monitor Your Site

**Netlify Dashboard:**
- View build logs & deploy history
- Monitor bandwidth & build minutes
- Configure SSL (auto-enabled!)
- Analytics (if you upgrade)

**OpenWeatherMap Dashboard:**
- Check API usage (daily limit: 1,000 calls)
- Upgrade if needed (paid plans from $40/mo)

---

## 🔄 Update Your Site

```bash
# Make changes
cd /root/clawd/wa-weather

# Edit files...

# Commit and push (if using GitHub)
git add .
git commit -m "Update: your changes"
git push

# Or redeploy via CLI
netlify deploy --prod
```

---

## ❓ Troubleshooting

**"Module not found" error:**
```bash
cd /root/clawd/wa-weather
npm install
npm run build
```

**API not working:**
- Verify API key in .env.local
- Check OpenWeatherMap dashboard for usage limits
- Wait 10 mins after creating key (activation time)

**Map not loading:**
- Check browser console for errors
- Verify Leaflet CSS is imported
- Hard refresh: Ctrl+Shift+R

---

## 🎉 You're Live!

**Your weather app is now:**
- ✅ Deployed on Netlify
- ✅ Accessible worldwide
- ✅ SSL secured (HTTPS)
- ✅ Auto-deploys on Git push (if using GitHub)

**Share it:**
- Add to your portfolio
- Share with friends & family
- Post on social media
- Use for your local weather!

---

**Need help?** Check the full docs in `NETLIFY-DEPLOY.md` or `README.md`
