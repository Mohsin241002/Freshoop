#!/bin/bash

# Freshoop Vercel Deployment Script
# This script helps prepare and deploy the application to Vercel

echo "🚀 Freshoop Deployment Script"
echo "=============================="
echo ""

# Check if we're in the project root
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please run this script from the project root."
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Vercel CLI is installed
if ! command_exists vercel; then
    echo "⚠️  Vercel CLI is not installed."
    echo "Install it with: npm install -g vercel"
    echo ""
    read -p "Would you like to install it now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g vercel
    else
        echo "Please install Vercel CLI and try again."
        exit 1
    fi
fi

echo "✅ Vercel CLI is installed"
echo ""

# Check if .env files exist (they shouldn't be committed)
if [ -f "client/.env" ] || [ -f "server/.env" ]; then
    echo "⚠️  Warning: .env files detected. Make sure they are in .gitignore"
    echo "Environment variables should be set in Vercel dashboard, not committed to Git."
    echo ""
fi

# Ask deployment type
echo "Select deployment type:"
echo "1) First-time deployment (setup new project)"
echo "2) Update existing deployment"
echo "3) Production deployment"
echo "4) Preview deployment"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📦 Running first-time deployment..."
        echo ""
        echo "⚠️  Important: You will need to set environment variables after deployment."
        echo "Required environment variables:"
        echo "  Client: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL, VITE_PEXELS_API_KEY"
        echo "  Server: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, JWT_SECRET, FRONTEND_URL, ADMIN_EMAILS"
        echo ""
        read -p "Press Enter to continue..."
        vercel
        ;;
    2)
        echo ""
        echo "🔄 Updating existing deployment..."
        vercel
        ;;
    3)
        echo ""
        echo "🚀 Deploying to production..."
        vercel --prod
        ;;
    4)
        echo ""
        echo "👁️  Creating preview deployment..."
        vercel
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel dashboard if not done already"
echo "2. Update Supabase authentication URLs with your Vercel URL"
echo "3. Test your deployment thoroughly"
echo "4. Check VERCEL_DEPLOYMENT.md for detailed instructions"
echo ""
