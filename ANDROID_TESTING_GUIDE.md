# 📱 Android Studio Testing Guide

## 🎯 **Test Your Backend with Android Emulator**

Since your local network has proxy issues, testing on Android emulator is a great alternative! The Android emulator can access your local backend server.

---

## 🚀 **Step 1: Start Your Backend Server**

The server is already running on port 5000! Keep it running.

```bash
# Already running in your terminal:
npm run server
```

You should see:
```
MongoDB connected successfully
Server running on port 5000
API URL: http://localhost:5000/api
```

---

## 📱 **Step 2: Open Project in Android Studio**

1. **Open Android Studio**
2. **Open Project** → Navigate to `C:\Users\User\OneDrive\Desktop\INSTOK`
3. Select the **`android`** folder
4. Wait for Gradle sync to complete

---

## 🔧 **Step 3: Configure API URL for Android**

### **Important: Android Emulator Network Setup**

When running on Android emulator, `localhost` doesn't work. Use one of these:

- **Android Emulator:** `http://10.0.2.2:5000/api`
- **Real Device (same WiFi):** `http://YOUR_PC_IP:5000/api`

### **Update API Configuration**

Create a new file: `src/config/api.config.ts`

```typescript
import { Platform } from 'react-native';

// For Android Emulator, use 10.0.2.2 (special alias for host machine)
// For iOS Simulator, use localhost
// For Real Device, use your PC's IP address

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api';  // Android Emulator
    }
    return 'http://localhost:5000/api';    // iOS Simulator
  }
  return 'https://your-production-url.com/api';  // Production
};

export const API_BASE_URL = getBaseUrl();

export const config = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

---

## 🏃 **Step 4: Run Metro Bundler**

Open a **new terminal** (keep the backend server running):

```bash
cd C:\Users\User\OneDrive\Desktop\INSTOK
npm start
```

This starts the Metro bundler for React Native.

---

## 📱 **Step 5: Run on Android Emulator**

### **Option A: Using Android Studio**

1. In Android Studio, click **Run** (green play button) or press `Shift + F10`
2. Select an emulator (or create one if needed)
3. Wait for app to build and launch

### **Option B: Using Terminal**

In a **new terminal** (third terminal window):

```bash
npm run android
```

---

## ✅ **Step 6: Test the App**

Once the app launches on the emulator:

1. **Test Registration:**
   - Go to Register screen
   - Enter: username, email, password
   - Click Register
   - ✅ Should connect to `http://10.0.2.2:5000/api/auth/register`

2. **Test Login:**
   - Enter credentials
   - Click Login
   - ✅ Should connect to your backend

3. **Check Terminal:**
   - Backend server terminal should show incoming requests
   - Metro bundler should show no errors

---

## 🔍 **Troubleshooting:**

### **Issue 1: Can't Connect to Backend**

**Symptom:** Network request failed

**Solutions:**

1. **Check Backend is Running:**
   ```bash
   curl http://localhost:5000/api/auth/me
   # Should return: {"message":"Access token required"}
   ```

2. **Use Correct URL in Android:**
   - ❌ `http://localhost:5000` (won't work)
   - ✅ `http://10.0.2.2:5000` (correct for emulator)

3. **Check Firewall:**
   - Make sure port 5000 is allowed
   - Windows Firewall → Allow port 5000

4. **Try Real Device Instead:**
   - Connect Android phone via USB
   - Enable USB Debugging
   - Use your PC's IP: `http://192.168.X.X:5000/api`

### **Issue 2: Metro Bundler Errors**

**Symptom:** Red screen, bundle errors

**Solutions:**

1. **Clear Metro Cache:**
   ```bash
   npm start -- --reset-cache
   ```

2. **Clear Gradle Cache:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

3. **Reinstall Dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

### **Issue 3: Gradle Build Errors**

**Symptom:** Build failed in Android Studio

**Solutions:**

1. **Sync Gradle:**
   - File → Sync Project with Gradle Files

2. **Clean Build:**
   - Build → Clean Project
   - Build → Rebuild Project

3. **Check JDK Version:**
   - Android Studio should use JDK 11 or 17

---

## 📊 **What You'll See:**

### **Terminal Windows You Need:**

1. **Terminal 1:** Backend Server
   ```
   Server running on port 5000
   API URL: http://localhost:5000/api
   ```

2. **Terminal 2:** Metro Bundler
   ```
   Metro waiting on exp://192.168.X.X:8081
   ```

3. **Terminal 3:** Android Build (if using CLI)
   ```
   BUILD SUCCESSFUL
   Installing APK
   ```

### **Backend Request Logs:**

When you interact with the app, you'll see in Terminal 1:
```
Check user error: { message: 'TypeError: fetch failed' }
```

This is expected - it's the Supabase connection issue. But the app will still work because it's connecting to your backend!

---

## 🎯 **Expected Behavior:**

### **✅ What Will Work:**
- ✅ App launches on emulator
- ✅ UI displays correctly
- ✅ Can navigate between screens
- ✅ Backend receives requests
- ✅ API endpoints respond

### **⚠️ What Won't Work (Due to Proxy):**
- ⚠️ Supabase database operations
- ⚠️ User registration/login (needs Supabase)
- ⚠️ Data persistence

### **💡 Workaround:**
To actually test functionality, you'll need to:
- Deploy backend to production (no proxy issues), OR
- Use different network, OR
- Set up local PostgreSQL instead of Supabase

---

## 🚀 **Alternative: Quick Production Test**

The fastest way to test everything working:

1. **Deploy Backend:**
   ```bash
   vercel
   # Add env variables
   # Get production URL
   ```

2. **Update API Config:**
   ```typescript
   const API_BASE_URL = 'https://your-app.vercel.app/api';
   ```

3. **Rebuild App:**
   ```bash
   npm run android
   ```

4. **✅ Everything works perfectly!**

---

## 📝 **Quick Checklist:**

- [ ] Backend server running (Terminal 1)
- [ ] Metro bundler running (Terminal 2)
- [ ] Android Studio opened
- [ ] Emulator selected
- [ ] API URL configured for Android (`10.0.2.2`)
- [ ] App built and launched
- [ ] Testing registration/login

---

## 🎉 **Success Criteria:**

You'll know it's working when:
- ✅ App launches without crashes
- ✅ Backend terminal shows incoming requests
- ✅ UI is responsive and navigable
- ✅ No Metro bundler errors

---

## 💡 **Pro Tips:**

1. **Keep 3 terminals open:**
   - Backend server
   - Metro bundler
   - Build commands

2. **Use Android Studio's Logcat:**
   - View → Tool Windows → Logcat
   - Filter for your app's logs

3. **Enable Network Inspection:**
   - Shake device/emulator
   - Enable Remote JS Debugging
   - Open Chrome DevTools

4. **Hot Reload:**
   - Press `R` twice in Metro bundler
   - Or shake device and click "Reload"

---

## 🚀 **Ready to Test!**

Your Android app is ready to run! Even with the proxy limitation, you can:
- ✅ Test the UI/UX
- ✅ Verify app structure
- ✅ Check navigation flow
- ✅ See backend connectivity attempts

**For full functionality testing, deploy the backend to production first!** 🎉

