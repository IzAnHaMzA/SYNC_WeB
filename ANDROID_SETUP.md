# Android Setup Guide for INSTOK

Complete guide to set up and build the Android app for INSTOK.

## Prerequisites

### Required Software

1. **Node.js & npm**
   - Version: 18 or higher
   - Download: https://nodejs.org/

2. **JDK (Java Development Kit)**
   - Version: JDK 11 or higher
   - Download: https://www.oracle.com/java/technologies/downloads/
   - Or use OpenJDK: `choco install openjdk11` (Windows with Chocolatey)

3. **Android Studio**
   - Download: https://developer.android.com/studio
   - Includes Android SDK and emulator

4. **Watchman** (Optional, for better performance)
   - Windows: `choco install watchman`
   - macOS: `brew install watchman`

## Step 1: Install Android Studio

1. Download and install Android Studio
2. During installation, ensure these components are selected:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
   - Performance (Intel HAXM on Windows/Linux)

## Step 2: Configure Android SDK

1. Open Android Studio
2. Click on "More Actions" → "SDK Manager"
3. In "SDK Platforms" tab, install:
   - Android 13.0 (Tiramisu) - API Level 33
   - Android 12.0 (S) - API Level 31

4. In "SDK Tools" tab, install:
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools
   - Intel x86 Emulator Accelerator (HAXM installer)
   - Google Play services

## Step 3: Set Environment Variables

### Windows

1. Open System Properties → Environment Variables
2. Add these variables:

```
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Java\jdk-11
```

3. Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%JAVA_HOME%\bin
```

### macOS/Linux

Add to `~/.bash_profile` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Then run:
```bash
source ~/.bash_profile  # or source ~/.zshrc
```

## Step 4: Verify Installation

Open a new terminal and run:

```bash
# Check Node
node --version

# Check npm
npm --version

# Check Java
java -version

# Check Android Debug Bridge
adb --version
```

## Step 5: Create Android Virtual Device (AVD)

1. Open Android Studio
2. Click "More Actions" → "Virtual Device Manager"
3. Click "Create Device"
4. Select a device (e.g., Pixel 5)
5. Select system image (Android 13.0, API 33)
6. Click "Finish"

## Step 6: Install Project Dependencies

Navigate to the project directory:

```bash
cd INSTOK
npm install
```

## Step 7: Generate Debug Keystore

The project includes a debug keystore, but you can generate a new one:

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android
```

## Step 8: Run the Android App

### Option 1: Using npm scripts

```bash
# Start Metro bundler
npm start

# In another terminal, run Android app
npm run android
```

### Option 2: Using Android Studio

1. Open Android Studio
2. Select "Open an existing project"
3. Navigate to `INSTOK/android`
4. Wait for Gradle sync
5. Click "Run" button or press Shift + F10

### Option 3: Using React Native CLI

```bash
npx react-native run-android
```

## Step 9: Build Release APK

### For Testing (Debug APK)

```bash
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### For Production (Release APK)

1. **Generate Upload Keystore**

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Gradle Variables**

Create/edit `android/gradle.properties`:

```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your-store-password
MYAPP_UPLOAD_KEY_PASSWORD=your-key-password
```

3. **Build Release APK**

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

## Step 10: Install APK on Device

### Using ADB

```bash
# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Install release APK
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Using Gradle

```bash
cd android

# Install debug
./gradlew installDebug

# Install release
./gradlew installRelease
```

## Common Issues and Solutions

### Issue 1: SDK Location Not Found

**Error:** `SDK location not found`

**Solution:**
Create `android/local.properties`:
```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

### Issue 2: Gradle Build Failed

**Solution:**
```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
npm run android
```

### Issue 3: Unable to Load Script

**Solution:**
```bash
npx react-native start --reset-cache
```

Then in another terminal:
```bash
npm run android
```

### Issue 4: Metro Bundler Port Already in Use

**Solution:**
```bash
npx react-native start --port=8088
```

### Issue 5: Android License Not Accepted

**Solution:**
```bash
cd %ANDROID_HOME%/tools/bin    # Windows
# or
cd $ANDROID_HOME/tools/bin     # macOS/Linux

./sdkmanager --licenses
```

Accept all licenses by typing 'y'.

### Issue 6: JAVA_HOME Not Set

**Error:** `ERROR: JAVA_HOME is not set`

**Solution:**
Set JAVA_HOME environment variable to your JDK installation path.

### Issue 7: App Crashes on Launch

**Solutions:**
1. Clear app data:
```bash
adb shell pm clear com.instok
```

2. Reinstall app:
```bash
adb uninstall com.instok
npm run android
```

## Running on Physical Device

1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Accept USB debugging prompt on device
5. Verify connection:
```bash
adb devices
```

6. Run app:
```bash
npm run android
```

## Debugging

### Chrome DevTools

1. Start app on device/emulator
2. Shake device or press Ctrl+M
3. Select "Debug"
4. Open Chrome: `chrome://inspect`

### React Native Debugger

1. Download: https://github.com/jhen0409/react-native-debugger/releases
2. Install and run
3. In app, shake device → Enable Debug

### Logcat (Android Logs)

```bash
# View all logs
adb logcat

# View React Native logs only
adb logcat *:S ReactNative:V ReactNativeJS:V

# Clear logs
adb logcat -c
```

## Performance Optimization

### Enable Hermes

Already enabled in `android/gradle.properties`:
```properties
hermesEnabled=true
```

### Enable ProGuard (Production)

In `android/app/build.gradle`:
```gradle
def enableProguardInReleaseBuilds = true
```

## Publishing to Google Play Store

1. **Prepare Release Build**
   - Update version in `android/app/build.gradle`
   - Generate signed APK/Bundle

2. **Create App Bundle (Recommended)**
```bash
cd android
./gradlew bundleRelease
```

3. **Create Developer Account**
   - https://play.google.com/console
   - Pay one-time fee ($25)

4. **Upload to Play Console**
   - Create new app
   - Upload AAB file
   - Fill in store listing
   - Submit for review

## Useful Commands

```bash
# List connected devices
adb devices

# Restart ADB server
adb kill-server
adb start-server

# Clear app data
adb shell pm clear com.instok

# Uninstall app
adb uninstall com.instok

# View app logs
adb logcat | grep -i instok

# Take screenshot
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png

# Record screen
adb shell screenrecord /sdcard/demo.mp4
adb pull /sdcard/demo.mp4
```

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Android Developer Guide](https://developer.android.com/)
- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [Gradle Build Tool](https://gradle.org/guides/)

## Next Steps

After successful setup:
1. Customize app icon and splash screen
2. Implement navigation structure
3. Connect to backend API
4. Add native modules as needed
5. Test on multiple devices
6. Optimize performance
7. Prepare for production release

---

Need help? Check the main README.md or create an issue on GitHub.

