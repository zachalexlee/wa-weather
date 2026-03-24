#!/bin/bash

echo "🚀 Washington Weather Hub - Netlify Deployment"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in wa-weather directory"
    echo "Run: cd /root/clawd/wa-weather"
    exit 1
fi

echo "📦 Building the app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🔐 Now you need to login to Netlify..."
echo ""
echo "Run these commands:"
echo ""
echo "  netlify login"
echo "  netlify deploy --prod"
echo ""
echo "The first command will open a browser to authorize Netlify."
echo "The second command will deploy your site!"
echo ""
echo "Don't forget to set your OpenWeatherMap API key:"
echo "  netlify env:set NEXT_PUBLIC_OPENWEATHER_API_KEY your_key_here"
echo ""
