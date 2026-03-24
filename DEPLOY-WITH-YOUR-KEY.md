# 🚀 Deploy Your Weather App to Netlify

Your API key is configured! Here's how to get it online:

## Method 1: Deploy via GitHub + Netlify (Easiest - 5 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `wa-weather`
3. Make it **Public**
4. Click "Create repository"

### Step 2: Push Your Code

**Run these commands on your server:**

```bash
cd /root/clawd/wa-weather

# Add GitHub as remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/wa-weather.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If it asks for password:** Use a Personal Access Token instead:
- Go to https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select `repo` scope
- Copy the token
- Use it as your password when pushing

### Step 3: Deploy on Netlify

1. Go to https://app.netlify.com (sign up if needed)
2. Click "Add new site" → "Import an existing project"
3. Click "Deploy with GitHub"
4. Authorize Netlify to access GitHub
5. Select your `wa-weather` repository
6. Build settings should auto-detect:
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Click "Advanced" → "Add environment variable"
   - Key: `NEXT_PUBLIC_OPENWEATHER_API_KEY`
   - Value: `2da56c3b5f37ea8efa1783a594ef791f`
8. Click "Deploy site"

**Your site will be live in 2-3 minutes!**

Netlify will give you a URL like: `https://wa-weather-abc123.netlify.app`

---

## Method 2: Direct Deploy (If you don't want GitHub)

### Via Netlify Drop

1. **Download your built app:**
   - Location on server: `/root/clawd/wa-weather/`
   
2. **Zip the necessary files:**
   ```bash
   cd /root/clawd/wa-weather
   zip -r deploy.zip .next netlify.toml package.json
   ```

3. **Go to Netlify:**
   - Visit https://app.netlify.com/drop
   - Drag & drop `deploy.zip`
   - Wait for deploy to complete

4. **Add environment variable:**
   - In Netlify dashboard → Site settings → Environment variables
   - Add: `NEXT_PUBLIC_OPENWEATHER_API_KEY` = `2da56c3b5f37ea8efa1783a594ef791f`
   - Redeploy: Deploys → Trigger deploy

---

## ✅ After Deployment

### Test Your Site

1. Open your Netlify URL
2. Select a Washington city
3. Check current weather loads
4. Verify radar map shows
5. Check 10-day forecast

### Customize Your URL

In Netlify dashboard:
1. Site settings → Site information
2. Change site name to something like: `wa-weather-hub`
3. Your URL becomes: `https://wa-weather-hub.netlify.app`

### Add Custom Domain (Optional)

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Netlify: Domain settings → Add domain
3. Configure DNS as instructed
4. Wait 24-48h for propagation

---

## 📊 Monitor Your Site

**Netlify:**
- View builds & deploys
- Check bandwidth usage
- SSL automatically enabled

**OpenWeatherMap:**
- Dashboard: https://home.openweathermap.org
- Free tier: 1,000 calls/day
- Current usage visible in dashboard

---

## 🔄 Update Your Site

After pushing to GitHub, Netlify auto-deploys on every push!

```bash
cd /root/clawd/wa-weather

# Make changes...

git add .
git commit -m "Update weather app"
git push

# Netlify will automatically redeploy!
```

---

## Need Help?

Having issues? Common fixes:

**Build fails:**
```bash
cd /root/clawd/wa-weather
npm install
npm run build
git add .
git commit -m "Fix dependencies"
git push
```

**API not working:**
- Check environment variable in Netlify settings
- Verify API key is correct
- Wait 10 minutes after creating key

**Map not showing:**
- Check browser console for errors
- Verify Leaflet is installed: `npm list leaflet`
- Redeploy if needed

---

**Your weather app is ready to go live!** 🌤️

Once deployed, you'll have a professional weather site for Washington State!
