# 🔧 Android Studio Configuration Guide - INSTOK

## 📋 **Prerequisites Checklist:**

Before starting, make sure you have:
- ✅ Android Studio installed (Arctic Fox or newer)
- ✅ JDK 11 or 17 installed
- ✅ Android SDK installed
- ✅ Node.js installed (you already have this)

---

## 🚀 **Step-by-Step Configuration:**

### **Step 1: Open Android Studio**

1. Launch **Android Studio**
2. If you see the welcome screen:
   - Click **"Open"**
   
   OR if you have a project open:
   - **File** → **Close Project** (to get to welcome screen)
   - Then click **"Open"**

---

### **Step 2: Select the Android Project**

1. Navigate to: `C:\Users\User\OneDrive\Desktop\INSTOK`
2. **Important:** Select the **`android`** folder (not the root INSTOK folder)
3. Click **"OK"**

```
C:\Users\User\OneDrive\Desktop\INSTOK\android  ✅ (Select this)
```

---

### **Step 3: Wait for Gradle Sync**

Android Studio will automatically:
- ✅ Detect it's a React Native Android project
- ✅ Start syncing Gradle files
- ✅ Download dependencies (first time only)

**This may take 5-15 minutes the first time!**

You'll see at the bottom:
```
Gradle sync in progress...
```

**✅ Wait until you see:** `Gradle sync finished`

---

### **Step 4: Configure SDK (If Prompted)**

If Android Studio asks to configure SDK:

1. **File** → **Settings** (or **Ctrl + Alt + S**)
2. Go to: **Appearance & Behavior** → **System Settings** → **Android SDK**
3. Ensure these are installed:
   - ✅ **Android 13.0 (API 33)** or higher
   - ✅ **Android SDK Build-Tools**
   - ✅ **Android SDK Platform-Tools**
   - ✅ **Android Emulator**
4. Click **"Apply"** → **"OK"**

---

### **Step 5: Set Up Environment Variables (If Needed)**

If Android Studio shows SDK errors:

**Add to System Environment Variables:**

1. **ANDROID_HOME:**
   ```
   C:\Users\User\AppData\Local\Android\Sdk
   ```

2. **Add to PATH:**
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

**How to add:**
- Right-click **This PC** → **Properties**
- **Advanced system settings**
- **Environment Variables**
- Add/Edit variables above

---

### **Step 6: Create/Select Emulator**

#### **Option A: Create New Emulator**

1. Click **Tools** → **Device Manager** (or the phone icon in toolbar)
2. Click **"Create Device"**
3. Select **Phone** → **Pixel 5** (or any recent device)
4. Click **Next**
5. Select **System Image:**
   - Choose **Tiramisu** (API 33) or latest
   - Click **Download** if not installed
6. Click **Next**
7. **Emulator Name:** `Pixel_5_API_33`
8. Click **Finish**

#### **Option B: Use Existing Emulator**

If you already have an emulator, just select it from the device dropdown.

---

### **Step 7: Configure React Native in Android Studio**

Check the project structure:

```
android/
├── app/
│   ├── build.gradle        ✅ Should exist
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml  ✅ Should exist
│           └── java/
│               └── com/instok/
│                   ├── MainActivity.java  ✅ Should exist
│                   └── MainApplication.java  ✅ Should exist
├── build.gradle            ✅ Should exist
└── settings.gradle         ✅ Should exist
```

**✅ All these files already exist from our earlier setup!**

---

### **Step 8: Update build.gradle (If Needed)**

Open `android/app/build.gradle` and verify:

```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.instok"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }
}
```

**✅ These settings are already configured!**

---

### **Step 9: Sync Project with Gradle Files**

1. **File** → **Sync Project with Gradle Files**
2. Wait for sync to complete
3. Check for any errors in **Build** panel

**Common Issues:**

- **If Gradle fails:** Try **Build** → **Clean Project** → **Rebuild Project**
- **If dependencies fail:** Check internet connection
- **If SDK error:** Install required SDK versions in SDK Manager

---

### **Step 10: Configure Run Configuration**

1. Top toolbar: Click dropdown next to Run button (▶️)
2. Should show **"app"** as the configuration
3. Next to it, select your emulator from device dropdown

```
[app ▼] [Pixel_5_API_33 ▼] [▶️]
```

---

## 🎯 **Final Verification:**

### **Check These Panels:**

1. **Project Structure** (Left sidebar):
   ```
   android/
   ├── app/
   ├── gradle/
   └── build.gradle
   ```

2. **Build Panel** (Bottom):
   ```
   ✅ BUILD SUCCESSFUL
   ```

3. **Messages** (Bottom):
   ```
   ✅ No errors
   ```

4. **Device Dropdown**:
   ```
   ✅ Emulator selected
   ```

---

## 🚀 **You're Ready to Run!**

### **Three Ways to Launch:**

#### **Method 1: Android Studio Button**
- Click **Run** (▶️) button
- Or press **Shift + F10**

#### **Method 2: Terminal Command**
```bash
npm run android
```

#### **Method 3: Gradle Command**
```bash
cd android
./gradlew installDebug
cd ..
```

---

## 📱 **What Happens When You Run:**

1. **Gradle builds** the Android app (may take 2-5 minutes first time)
2. **APK is created** in `android/app/build/outputs/apk/`
3. **Emulator launches** (if not already running)
4. **App installs** on emulator
5. **Metro bundler** must be running (Terminal 2)
6. **App launches** and connects to Metro

---

## 🔧 **Important Android Studio Settings:**

### **Enable USB Debugging for Real Device (Optional):**

If testing on real Android phone:

1. **Settings** → **Developer Options**
   - If you don't see this, go to **About Phone** → Tap **Build Number** 7 times
2. Enable **USB Debugging**
3. Connect phone via USB
4. Allow USB debugging prompt on phone
5. Select phone in device dropdown

---

### **Configure Android Studio Preferences:**

**File** → **Settings** → **Editor** → **Code Style**:
- Set **Tab size:** 2
- Set **Indent:** 2
- Check **Use tab character**: OFF

**Build, Execution, Deployment** → **Compiler**:
- **Build process heap size:** 2048 MB (for faster builds)

---

## 🎯 **Network Configuration for Backend:**

### **Update API URL for Android:**

Since Android emulator uses special networking:

**Create/Update:** `src/config/api.ts` or similar:

```typescript
import { Platform } from 'react-native';

const API_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api',  // Emulator
  ios: 'http://localhost:5000/api',      // Simulator
  default: 'http://localhost:5000/api',
});

export default API_URL;
```

**Why `10.0.2.2`?**
- Android emulator uses `10.0.2.2` as alias for host machine
- `localhost` on Android means the emulator itself, not your PC
- Real device would use your PC's actual IP (e.g., `192.168.1.100`)

---

## 🐛 **Troubleshooting:**

### **Problem 1: Gradle Sync Failed**

**Solution:**
```bash
# In Android Studio terminal:
cd android
./gradlew clean
cd ..

# Then: File → Sync Project with Gradle Files
```

---

### **Problem 2: SDK Not Found**

**Solution:**
1. **File** → **Project Structure** → **SDK Location**
2. Set Android SDK location:
   ```
   C:\Users\User\AppData\Local\Android\Sdk
   ```
3. Click **Apply** → **OK**

---

### **Problem 3: Build Failed - License Not Accepted**

**Solution:**
```bash
# Open CMD as Administrator:
cd %ANDROID_HOME%\tools\bin
sdkmanager --licenses
# Press 'y' to accept all licenses
```

---

### **Problem 4: Emulator Won't Start**

**Solutions:**
1. **Check BIOS:** Enable Intel VT-x or AMD-V virtualization
2. **Disable Hyper-V** (conflicts with emulator):
   ```bash
   # In PowerShell as Admin:
   bcdedit /set hypervisorlaunchtype off
   # Restart PC
   ```
3. **Use ARM emulator** instead of x86

---

### **Problem 5: App Crashes on Launch**

**Check:**
1. ✅ Metro bundler is running (`npm start`)
2. ✅ Backend server is running (`npm run server`)
3. ✅ No errors in Metro terminal
4. ✅ App has network permissions (already in AndroidManifest.xml)

**View Logs:**
- **View** → **Tool Windows** → **Logcat**
- Filter for your app: `com.instok`

---

## 📊 **Expected Setup Time:**

- **First time:** 15-30 minutes
  - Gradle sync: 5-10 min
  - Download dependencies: 5-15 min
  - Build APK: 3-5 min

- **Subsequent runs:** 2-5 minutes
  - Gradle already synced ✅
  - Dependencies cached ✅
  - Incremental builds ✅

---

## ✅ **Verification Checklist:**

Before running the app, verify:

- [ ] Android Studio opened
- [ ] `android` folder loaded (not root folder)
- [ ] Gradle sync completed successfully
- [ ] Emulator created/selected
- [ ] No errors in Messages panel
- [ ] Backend server running (Terminal 1)
- [ ] Metro bundler ready to start (Terminal 2)
- [ ] Device selected in dropdown

---

## 🎉 **You're All Set!**

Your Android Studio is configured and ready to run INSTOK!

**Next Steps:**
1. Make sure backend is running: `npm run server`
2. Start Metro bundler: `npm start`
3. In Android Studio, click Run (▶️)
4. Wait for app to build and launch
5. Test the app! 📱

---

## 💡 **Pro Tips:**

### **Faster Builds:**
- Enable **Gradle Daemon** (usually on by default)
- Use **Instant Run** for quicker iterations
- Keep emulator running (don't close between runs)

### **Better Development:**
- Use **Logcat** to debug (View → Tool Windows → Logcat)
- Enable **React Native Debugger** (shake emulator)
- Use **Hot Reload** in Metro (press 'r')

### **Optimize Performance:**
- Increase RAM for emulator (recommended: 2048 MB)
- Use x86_64 emulator images (faster than ARM)
- Close other heavy applications while developing

---

## 📞 **Quick Reference:**

**Start Development:**
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Metro
npm start

# Android Studio: Click Run ▶️
```

**Your App:**
- Package: `com.instok`
- API: `http://10.0.2.2:5000/api`
- Port: Metro on 8081, Backend on 5000

---

**Your Android Studio is ready! Click Run to launch your app!** 🚀📱

