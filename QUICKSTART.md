# Quick Start Guide - INSTOK

Get up and running with INSTOK in 5 minutes!

## 🚀 Quick Setup

### Prerequisites Check

```bash
node --version    # Should be 18+
npm --version     # Should be 9+
mongod --version  # Should be 5+
```

If any are missing, install them first. See README.md for installation links.

---

## Step 1: Install Dependencies (1 minute)

```bash
cd INSTOK
npm install
```

---

## Step 2: Start MongoDB (30 seconds)

**Windows:**
```bash
mongod
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

---

## Step 3: Start the Application (1 minute)

Open a terminal and run:

```bash
npm run dev:full
```

This starts both the backend server and frontend web app.

**You should see:**
```
Server running on port 5000
API URL: http://localhost:5000/api

VITE v4.1.0  ready in 500 ms
➜  Local:   http://localhost:5173/
```

---

## Step 4: Open the App (10 seconds)

Open your browser and go to:
```
http://localhost:5173
```

---

## Step 5: Create Your First Account (1 minute)

1. Click "Register"
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Full Name: `Test User`
3. Click "Sign Up"

🎉 **You're in!**

---

## Quick API Test

Test the API using curl or Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Response: {"status":"OK","message":"Instagram Clone API is running!"}
```

---

## For Android Development

### Quick Android Setup

1. **Install Android Studio**
   - Download from: https://developer.android.com/studio

2. **Open Android Project**
   ```bash
   # Open Android Studio
   # File → Open → Navigate to INSTOK/android
   ```

3. **Start Metro Bundler**
   ```bash
   npm start
   ```

4. **Run on Android**
   ```bash
   npm run android
   ```

See `ANDROID_SETUP.md` for detailed Android instructions.

---

## Common Commands

### Development

```bash
# Start both backend and frontend
npm run dev:full

# Start backend only
npm run server

# Start frontend only
npm run dev

# Start React Native Metro bundler
npm start

# Run Android app
npm run android
```

### Building

```bash
# Build web app
npm run build

# Build Android debug APK
npm run android:build

# Build Android release APK
cd android && ./gradlew assembleRelease
```

---

## Project URLs

- **Web App:** http://localhost:5173
- **API:** http://localhost:5000/api
- **API Health:** http://localhost:5000/api/health
- **Uploads:** http://localhost:5000/uploads

---

## Quick Troubleshooting

### Problem: "Cannot connect to MongoDB"

**Solution:**
```bash
# Make sure MongoDB is running
mongod
```

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Change port in .env file
PORT=5001
```

### Problem: "npm install fails"

**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

### Problem: "Android build fails"

**Solution:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

---

## Next Steps

1. ✅ Explore the web app
2. ✅ Create posts
3. ✅ Try stories
4. ✅ Test messaging
5. ✅ Run on Android
6. 📚 Read `README.md` for full documentation
7. 📚 Check `API_DOCUMENTATION.md` for API details
8. 🚀 See `DEPLOYMENT.md` for production deployment

---

## Useful Links

- **Full Documentation:** README.md
- **Android Setup:** ANDROID_SETUP.md
- **API Reference:** API_DOCUMENTATION.md
- **Deployment Guide:** DEPLOYMENT.md

---

## Need Help?

1. Check README.md
2. Check ANDROID_SETUP.md for Android issues
3. Create an issue on GitHub
4. Review API_DOCUMENTATION.md

---

**Happy Coding! 🎉**

