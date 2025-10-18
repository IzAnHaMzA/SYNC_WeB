# 🚀 INSTOK Deployment Guide

## 📋 Overview
This guide will help you deploy your INSTOK social media application to GitHub Pages (frontend) and Heroku (backend).

## 🎯 Deployment Architecture
- **Frontend**: GitHub Pages (Static hosting)
- **Backend**: Heroku (Node.js hosting)
- **Database**: Supabase (Cloud PostgreSQL)
- **CDN**: GitHub Pages CDN

## 🔧 Prerequisites
1. GitHub account
2. Heroku account
3. Supabase account
4. Git installed locally

## 📦 Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: INSTOK social media app"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `instok` or `instok-social-media`
4. Make it public (required for GitHub Pages)
5. Don't initialize with README (you already have files)

### 1.3 Connect Local Repository to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/instok.git
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy Backend to Heroku

### 2.1 Install Heroku CLI
- Download from [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### 2.2 Login to Heroku
```bash
heroku login
```

### 2.3 Create Heroku App
```bash
cd server
heroku create your-instok-backend
```

### 2.4 Set Environment Variables
```bash
heroku config:set JWT_SECRET=your-super-secret-jwt-key
heroku config:set SUPABASE_URL=your-supabase-url
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
heroku config:set NODE_ENV=production
```

### 2.5 Deploy Backend
```bash
git subtree push --prefix=server heroku main
```

## 🎨 Step 3: Deploy Frontend to GitHub Pages

### 3.1 Enable GitHub Pages
1. Go to your GitHub repository
2. Click "Settings" tab
3. Scroll to "Pages" section
4. Source: "GitHub Actions"

### 3.2 Update Frontend Configuration
Update `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/instok/', // Replace 'instok' with your repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

### 3.3 Update API URLs
Update `src/utils/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-instok-backend.herokuapp.com/api';
```

## 🔐 Step 4: Configure Secrets

### 4.1 GitHub Secrets
Go to your repository → Settings → Secrets and variables → Actions

Add these secrets:
- `HEROKU_API_KEY`: Your Heroku API key
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### 4.2 Heroku Environment Variables
```bash
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set SUPABASE_URL=your-supabase-url
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your-supabase-key
heroku config:set REDIS_URL=your-redis-url  # Optional
```

## 🗄️ Step 5: Set Up Supabase Database

### 5.1 Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Note down your project URL and service role key

### 5.2 Run Database Setup
1. Go to SQL Editor in Supabase
2. Copy and paste the contents of `COMPLETE_SUPABASE_SETUP.sql`
3. Execute the SQL script

### 5.3 Configure Row Level Security
The SQL script includes RLS policies, but verify they're enabled:
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
-- ... (for all tables)
```

## 🚀 Step 6: Deploy

### 6.1 Push to GitHub
```bash
git add .
git commit -m "Deploy: Add GitHub Actions and deployment config"
git push origin main
```

### 6.2 Monitor Deployment
1. **GitHub Actions**: Go to Actions tab in your repository
2. **Heroku**: Check your Heroku dashboard
3. **GitHub Pages**: Check Settings → Pages for deployment status

## 🔗 Step 7: Access Your Deployed App

### 7.1 Frontend URL
```
https://YOUR_USERNAME.github.io/instok/
```

### 7.2 Backend URL
```
https://your-instok-backend.herokuapp.com/api
```

### 7.3 Test Your Deployment
1. Visit your frontend URL
2. Try registering a new user
3. Test creating posts
4. Verify all features work

## 🛠️ Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain to GitHub Pages
1. Go to repository Settings → Pages
2. Add your custom domain
3. Update DNS records

### 8.2 Add Custom Domain to Heroku
```bash
heroku domains:add api.yourdomain.com
```

## 📊 Step 9: Monitoring and Analytics

### 9.1 Add Analytics
- Google Analytics
- Sentry for error tracking
- Heroku metrics

### 9.2 Set Up Monitoring
- Uptime monitoring
- Performance monitoring
- Error tracking

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check GitHub Actions logs
   - Verify all dependencies are in package.json

2. **Backend Not Starting**
   - Check Heroku logs: `heroku logs --tail`
   - Verify environment variables

3. **Database Connection Issues**
   - Verify Supabase credentials
   - Check RLS policies

4. **CORS Issues**
   - Update CORS settings in backend
   - Verify frontend URL in CORS config

## 📈 Next Steps

1. **Performance Optimization**
   - Enable CDN
   - Optimize images
   - Implement caching

2. **Security Enhancements**
   - Add rate limiting
   - Implement 2FA
   - Security headers

3. **Features**
   - Push notifications
   - Real-time chat
   - Advanced analytics

## 🆘 Support

If you encounter issues:
1. Check the logs in GitHub Actions and Heroku
2. Verify all environment variables are set
3. Test locally first
4. Check Supabase dashboard for database issues

---

**🎉 Congratulations! Your INSTOK social media app is now live on the internet!**
