# 📱 Open INSTOK in Android Studio - Quick Guide

## 🎯 **Simple 3-Step Process:**

### **Step 1: Open Android Studio**

1. Launch **Android Studio**
2. Click **"Open"** (or File → Open)
3. Navigate to: `C:\Users\User\OneDrive\Desktop\INSTOK\android`
4. Click **"OK"**

**✅ Wait for Gradle sync to complete** (this may take a few minutes the first time)

---

### **Step 2: Start Metro Bundler**

Open a **new terminal/PowerShell** (separate from your backend server):

```bash
cd C:\Users\User\OneDrive\Desktop\INSTOK
npm start
```

You should see:
```
Metro waiting on exp://...
```

**✅ Keep this terminal running!**

---

### **Step 3: Run the App**

In Android Studio:

1. Click the **green Run button** (▶️) at the top
2. Select an emulator (create one if needed)
3. Wait for build to complete
4. App should launch on emulator

**OR** use the command line:

```bash
# In a third terminal
npm run android
```

---

## 🖥️ **Terminal Setup:**

You should have **3 terminals** running:

```
Terminal 1: Backend Server
└─ npm run server
   ✅ Running on port 5000

Terminal 2: Metro Bundler  
└─ npm start
   ✅ Bundling React Native

Terminal 3: (Optional) Build commands
└─ npm run android
   ✅ Building and installing app
```

---

## 📱 **Create Android Emulator (If Needed):**

If you don't have an emulator:

1. In Android Studio: **Tools** → **Device Manager**
2. Click **"Create Device"**
3. Select **Phone** → **Pixel 5** (or any recent device)
4. Click **Next**
5. Select **System Image** → **API 33** (or latest)
6. Click **Next** → **Finish**

---

## ✅ **What You Should See:**

### **In Android Studio:**
- ✅ Project loaded
- ✅ Gradle sync successful
- ✅ No errors in Messages panel

### **In Metro Bundler Terminal:**
```
✅ Metro waiting on exp://192.168.X.X:8081
✅ Looking for JS files in...
```

### **In Emulator:**
- ✅ INSTOK app launches
- ✅ UI displays
- ✅ Can navigate screens

### **In Backend Terminal:**
```
✅ Server running on port 5000
(May show Supabase fetch errors - that's expected)
```

---

## 🔧 **Configure for Android Network:**

The app needs to know how to reach your backend server.

**For Android Emulator**, your backend URL should be:
```
http://10.0.2.2:5000/api
```

**NOT** `http://localhost:5000/api` (this won't work on Android emulator)

Update in your API config if needed!

---

## 🎯 **Quick Test:**

Once app is running:

1. **Try navigating** between screens ✅
2. **Check Metro bundler** - should show bundle requests ✅
3. **Try registration/login** - will attempt to connect to backend
4. **Check backend terminal** - should see incoming requests

---

## ⚠️ **Expected Behavior:**

Due to the proxy issue:
- ✅ App will launch
- ✅ UI will work
- ✅ Backend will receive requests
- ❌ Supabase operations will fail (proxy blocks it)

**To get full functionality:**
Deploy the backend to production (where there's no proxy)!

---

## 🚀 **That's It!**

Your Android app should now be running in the emulator, connected to your local backend server!

**Next:** See `ANDROID_TESTING_GUIDE.md` for detailed testing instructions.

