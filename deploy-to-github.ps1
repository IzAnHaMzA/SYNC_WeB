# INSTOK GitHub Deployment Script
Write-Host "🚀 INSTOK GitHub Deployment Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git not initialized. Initializing..." -ForegroundColor Red
    git init
    git add .
    git commit -m "Initial commit: INSTOK social media app"
}

# Check if remote origin exists
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "❌ No remote origin found. Please add your GitHub repository:" -ForegroundColor Red
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/instok.git" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git repository configured" -ForegroundColor Green
Write-Host "📦 Building frontend for production..." -ForegroundColor Yellow

# Build frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend built successfully" -ForegroundColor Green

# Add all files
Write-Host "📝 Adding files to git..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Deploy: Add GitHub Actions and deployment configuration"

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to your GitHub repository" -ForegroundColor White
    Write-Host "2. Go to Settings → Pages" -ForegroundColor White
    Write-Host "3. Set Source to 'GitHub Actions'" -ForegroundColor White
    Write-Host "4. Wait for deployment to complete" -ForegroundColor White
    Write-Host "5. Your app will be available at: https://YOUR_USERNAME.github.io/instok/" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 For backend deployment, see DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
} else {
    Write-Host "❌ Failed to push to GitHub!" -ForegroundColor Red
    Write-Host "Please check your GitHub credentials and repository URL." -ForegroundColor Yellow
}
