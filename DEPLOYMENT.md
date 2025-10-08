# Deployment Guide for INSTOK

Complete guide for deploying INSTOK to production environments.

## Table of Contents

1. [Backend Deployment](#backend-deployment)
2. [Frontend Web Deployment](#frontend-web-deployment)
3. [Android App Deployment](#android-app-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Backend Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create instok-api
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-key
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/instok
heroku config:set CLIENT_URL=https://instok.com
```

5. **Deploy**
```bash
git push heroku main
```

6. **Scale Dynos**
```bash
heroku ps:scale web=1
```

---

### Option 2: Deploy to VPS (Ubuntu/Debian)

1. **Prepare Server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

2. **Clone Repository**
```bash
cd /var/www
git clone <your-repo-url> instok
cd instok
npm install
```

3. **Create .env File**
```bash
nano .env
```

Add production environment variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/instok
JWT_SECRET=your-super-secret-production-key
CLIENT_URL=https://yourdomain.com
MAX_FILE_SIZE=52428800
```

4. **Start with PM2**
```bash
pm2 start server/index.ts --name instok-api
pm2 save
pm2 startup
```

5. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/instok
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    client_max_body_size 50M;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/instok /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Set up SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

### Option 3: Deploy to AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu Server 22.04 LTS
   - Instance type: t2.small or higher
   - Configure security groups (allow ports 22, 80, 443, 5000)

2. **Connect to Instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. **Follow VPS deployment steps above**

4. **Configure AWS Security Groups**
   - Allow inbound traffic on ports 80, 443
   - Allow MongoDB port 27017 only from application server

---

## Frontend Web Deployment

### Option 1: Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build the Project**
```bash
npm run build
```

3. **Deploy**
```bash
vercel
```

4. **Configure Environment Variables** in Vercel Dashboard:
   - `VITE_API_URL=https://api.yourdomain.com`

---

### Option 2: Deploy to Netlify

1. **Build the Project**
```bash
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Or connect GitHub repository in Netlify Dashboard.

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

---

### Option 3: Deploy with Nginx on VPS

1. **Build the Project**
```bash
npm run build
```

2. **Copy to Server**
```bash
scp -r dist/* user@server:/var/www/instok/frontend
```

3. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/instok/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        proxy_pass http://localhost:5000/uploads;
    }
}
```

4. **Enable SSL**
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Android App Deployment

### Prepare Release Build

1. **Generate Upload Key**
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 \
  -keystore instok-release-key.keystore \
  -alias instok-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Gradle**

Edit `android/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=instok-release-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=instok-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your-store-password
MYAPP_UPLOAD_KEY_PASSWORD=your-key-password
```

3. **Update Version**

Edit `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0.0"
    }
}
```

4. **Build Release APK**
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

5. **Build App Bundle (for Play Store)**
```bash
./gradlew bundleRelease
```

AAB location: `android/app/build/outputs/bundle/release/app-release.aab`

---

### Publish to Google Play Store

1. **Create Developer Account**
   - Go to https://play.google.com/console
   - Pay $25 one-time registration fee

2. **Create New App**
   - Click "Create app"
   - Fill in app details
   - Choose category: Social

3. **Complete Store Listing**
   - App name: Instok
   - Short description (80 chars)
   - Full description (4000 chars)
   - Screenshots (minimum 2)
   - Feature graphic (1024x500)
   - App icon (512x512)

4. **Set Up App Content**
   - Privacy policy URL
   - Target age rating
   - Content rating questionnaire

5. **Upload Release**
   - Go to "Production" → "Create new release"
   - Upload AAB file
   - Add release notes
   - Review and rollout

6. **Review Process**
   - Google reviews app (typically 1-3 days)
   - Fix any issues if rejected
   - Once approved, app goes live

---

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Choose cloud provider (AWS/GCP/Azure)
   - Select region closest to your server
   - Choose M0 (free tier) or higher

3. **Configure Access**
   - Add IP whitelist (0.0.0.0/0 for testing, specific IPs for production)
   - Create database user

4. **Get Connection String**
```
mongodb+srv://username:password@cluster.mongodb.net/instok?retryWrites=true&w=majority
```

5. **Update Environment Variable**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/instok
```

---

### Self-Hosted MongoDB

1. **Install MongoDB**
```bash
# Ubuntu
sudo apt install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod
```

2. **Configure Authentication**
```bash
# Connect to MongoDB
mongosh

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "secure-password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
})

# Create app user
use instok
db.createUser({
  user: "instok_user",
  pwd: "secure-password",
  roles: ["readWrite"]
})
```

3. **Enable Authentication**

Edit `/etc/mongod.conf`:
```yaml
security:
  authorization: enabled
```

Restart MongoDB:
```bash
sudo systemctl restart mongod
```

4. **Update Connection String**
```
MONGODB_URI=mongodb://instok_user:secure-password@localhost:27017/instok
```

---

## Environment Configuration

### Production Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/instok
JWT_SECRET=very-secure-random-string-min-32-chars
CLIENT_URL=https://yourdomain.com
MAX_FILE_SIZE=52428800
```

**Frontend:**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Instok
```

### Security Checklist

- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS/SSL for all endpoints
- [ ] Configure CORS for specific domains only
- [ ] Use environment variables for sensitive data
- [ ] Enable MongoDB authentication
- [ ] Set up firewall rules
- [ ] Keep dependencies updated
- [ ] Implement rate limiting
- [ ] Add security headers (helmet.js)
- [ ] Validate all user inputs
- [ ] Sanitize file uploads
- [ ] Use HTTPS for API calls in mobile app

---

## Monitoring and Maintenance

### Log Management

**PM2 Logs:**
```bash
# View logs
pm2 logs instok-api

# Clear logs
pm2 flush
```

**Application Logging:**

Add winston for better logging:
```bash
npm install winston
```

### Performance Monitoring

**Install PM2 Plus:**
```bash
pm2 install pm2-server-monit
pm2 link <secret-key> <public-key>
```

### Database Backups

**MongoDB Atlas:**
- Automatic backups enabled by default
- Configure backup schedule in Atlas dashboard

**Self-Hosted MongoDB:**
```bash
# Create backup script
nano /home/user/backup-mongodb.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
mongodump --out $BACKUP_DIR/backup_$DATE
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

```bash
# Make executable
chmod +x /home/user/backup-mongodb.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/user/backup-mongodb.sh
```

### SSL Certificate Renewal

**Let's Encrypt Auto-Renewal:**
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot auto-renews certificates
# Check timer status
sudo systemctl status certbot.timer
```

### Updates and Maintenance

```bash
# Update application
cd /var/www/instok
git pull origin main
npm install
pm2 restart instok-api

# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js
nvm install 18
nvm use 18
```

---

## Troubleshooting

### Backend Issues

**App won't start:**
```bash
# Check PM2 logs
pm2 logs instok-api

# Check MongoDB connection
mongosh $MONGODB_URI

# Check environment variables
pm2 env 0
```

**High memory usage:**
```bash
# Restart app
pm2 restart instok-api

# Check memory
pm2 monit
```

### Database Issues

**Connection refused:**
- Check if MongoDB is running
- Verify connection string
- Check firewall rules

**Slow queries:**
- Add database indexes
- Optimize queries
- Enable MongoDB profiling

---

## Rollback Strategy

If deployment fails:

1. **Backend:**
```bash
git revert HEAD
pm2 restart instok-api
```

2. **Frontend:**
```bash
# Revert to previous build
vercel rollback
# or restore previous dist folder
```

3. **Database:**
```bash
# Restore from backup
mongorestore /backups/mongodb/backup_YYYYMMDD_HHMMSS
```

---

## Cost Estimation

### Free Tier
- MongoDB Atlas: Free (M0)
- Vercel/Netlify: Free tier available
- Heroku: Free dyno (with limitations)
- **Total: $0/month**

### Recommended Production
- VPS (Linode/DigitalOcean): $12/month
- MongoDB Atlas M10: $57/month
- Domain: $12/year
- **Total: ~$70/month**

### Enterprise
- AWS EC2 t3.medium: $30/month
- MongoDB Atlas M30: $250/month
- CloudFront CDN: $20/month
- Load Balancer: $18/month
- **Total: ~$320/month**

---

## Support and Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)

---

**Need Help?** Create an issue on GitHub or consult the main README.md.

