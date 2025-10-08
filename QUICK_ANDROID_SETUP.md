# ⚡ Quick Android Setup - 5 Minutes

## 🎯 **Super Fast Setup:**

### **1. Open Android Studio** (2 min)
```
File → Open → C:\Users\User\OneDrive\Desktop\INSTOK\android
```
✅ Wait for Gradle sync

---

### **2. Create Emulator** (2 min)
```
Tools → Device Manager → Create Device
→ Pixel 5 → API 33 → Finish
```
✅ Select it in device dropdown

---

### **3. Start Everything** (1 min)

**Terminal 1:** Backend (already running ✅)
```bash
npm run server
```

**Terminal 2:** Metro
```bash
npm start
```

**Android Studio:** Click Run ▶️

---

## 🔧 **Key Settings:**

### **API URL for Android:**
```typescript
// Use this in your app:
const API_URL = 'http://10.0.2.2:5000/api';
```

**NOT** `localhost` - use `10.0.2.2`!

---

### **Environment Variables (If needed):**
```
ANDROID_HOME = C:\Users\User\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
```

---

## 🚀 **Launch Command:**

One command to run everything:
```bash
# In project root:
npm run android
```

Or click **Run** (▶️) in Android Studio

---

## ✅ **Checklist:**

```
✅ Android Studio: Open android/ folder
✅ Gradle Sync: Completed
✅ Emulator: Created & Selected  
✅ Terminal 1: Backend running (port 5000)
✅ Terminal 2: Metro bundler (port 8081)
✅ Click: Run button ▶️
```

---

## 🐛 **Quick Fixes:**

**Build Failed?**
```bash
cd android
./gradlew clean
```

**Can't Connect?**
- Check API URL: `10.0.2.2:5000`
- Check backend is running
- Check firewall allows port 5000

**Metro Error?**
```bash
npm start -- --reset-cache
```

---

## 🎯 **Expected Result:**

After clicking Run:
1. ⏳ Build takes 2-5 min (first time)
2. 📱 Emulator launches
3. 📦 App installs
4. 🚀 App opens on emulator
5. ✅ You can test the UI!

---

## 💡 **Remember:**

Due to proxy, full backend features won't work locally.

**To test everything:**
```bash
# Deploy backend:
vercel

# Update API URL to production
# Rebuild app
# ✅ Everything works!
```

---

**That's it! You're ready to run!** 🎉

For detailed guide: See `ANDROID_STUDIO_CONFIGURATION.md`

