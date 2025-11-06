#!/bin/bash

# Render Deployment Helper Script
# This script helps you prepare and deploy to Render.com

echo "🚀 Freshoop - Render Deployment Helper"
echo "========================================"
echo ""

# Check if we're in the project root
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Please run this script from the project root."
    exit 1
fi

# Function to display deployment info
show_deployment_info() {
    echo "📋 Deployment Information"
    echo "------------------------"
    echo ""
    echo "Backend Service:"
    echo "  Name: freshoop-api"
    echo "  Type: Web Service"
    echo "  Build: cd server && npm install"
    echo "  Start: cd server && npm start"
    echo "  URL: https://freshoop-api.onrender.com"
    echo ""
    echo "Frontend Service:"
    echo "  Name: freshoop-client"
    echo "  Type: Static Site"
    echo "  Build: cd client && npm install && npm run build"
    echo "  Publish: client/dist"
    echo "  URL: https://freshoop-client.onrender.com"
    echo ""
}

# Function to check environment variables
check_env_vars() {
    echo "🔍 Checking Required Environment Variables"
    echo "------------------------------------------"
    echo ""
    
    required_backend_vars=(
        "SUPABASE_URL"
        "SUPABASE_SERVICE_KEY"
        "JWT_SECRET"
        "ADMIN_EMAILS"
    )
    
    required_frontend_vars=(
        "VITE_SUPABASE_URL"
        "VITE_SUPABASE_ANON_KEY"
        "VITE_PEXELS_API_KEY"
    )
    
    echo "Backend (.env in server/):"
    if [ -f "server/.env" ]; then
        for var in "${required_backend_vars[@]}"; do
            if grep -q "^${var}=" server/.env; then
                echo "  ✓ $var is set"
            else
                echo "  ✗ $var is MISSING"
            fi
        done
    else
        echo "  ⚠️  No .env file found in server/"
    fi
    
    echo ""
    echo "Frontend (.env in client/):"
    if [ -f "client/.env" ]; then
        for var in "${required_frontend_vars[@]}"; do
            if grep -q "^${var}=" client/.env; then
                echo "  ✓ $var is set"
            else
                echo "  ✗ $var is MISSING"
            fi
        done
    else
        echo "  ⚠️  No .env file found in client/"
    fi
    echo ""
}

# Function to test local build
test_local_build() {
    echo "🧪 Testing Local Build"
    echo "---------------------"
    echo ""
    
    echo "Building backend..."
    cd server
    if npm install; then
        echo "✓ Backend dependencies installed successfully"
    else
        echo "✗ Backend dependency installation failed"
        cd ..
        return 1
    fi
    cd ..
    
    echo ""
    echo "Building frontend..."
    cd client
    if npm install && npm run build; then
        echo "✓ Frontend built successfully"
        echo "✓ Build output in: client/dist"
    else
        echo "✗ Frontend build failed"
        cd ..
        return 1
    fi
    cd ..
    
    echo ""
    echo "✅ Local build test passed!"
    return 0
}

# Function to commit and push changes
commit_and_push() {
    echo "📤 Committing and Pushing Changes"
    echo "---------------------------------"
    echo ""
    
    if git diff --quiet && git diff --staged --quiet; then
        echo "ℹ️  No changes to commit"
        return 0
    fi
    
    echo "Changes detected:"
    git status --short
    echo ""
    
    read -p "Enter commit message (or press Enter for default): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Update for Render deployment"
    fi
    
    git add .
    git commit -m "$commit_msg"
    
    echo ""
    read -p "Push to GitHub? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin main
        echo "✅ Changes pushed to GitHub"
        echo "🔄 Render will automatically deploy if connected to GitHub"
    else
        echo "ℹ️  Changes committed but not pushed"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1) Show deployment information"
    echo "2) Check environment variables"
    echo "3) Test local build"
    echo "4) Commit and push changes"
    echo "5) Open Render dashboard"
    echo "6) View deployment guide"
    echo "7) Exit"
    echo ""
    read -p "Select option (1-7): " choice
    
    case $choice in
        1)
            show_deployment_info
            show_menu
            ;;
        2)
            check_env_vars
            show_menu
            ;;
        3)
            test_local_build
            show_menu
            ;;
        4)
            commit_and_push
            show_menu
            ;;
        5)
            echo "Opening Render dashboard..."
            open "https://dashboard.render.com/"
            show_menu
            ;;
        6)
            echo "Opening deployment guide..."
            if command -v open &> /dev/null; then
                open RENDER_DEPLOYMENT.md
            else
                cat RENDER_DEPLOYMENT.md
            fi
            show_menu
            ;;
        7)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option"
            show_menu
            ;;
    esac
}

# Quick start guide
echo "📚 Quick Start:"
echo "1. Create services on Render.com (see RENDER_DEPLOYMENT.md)"
echo "2. Connect to your GitHub repository"
echo "3. Add environment variables in Render dashboard"
echo "4. Deploy!"
echo ""
echo "Documentation: RENDER_DEPLOYMENT.md"
echo "Dashboard: https://dashboard.render.com/"
echo ""

# Show menu
show_menu
