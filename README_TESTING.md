# 🧪 INSTOK - LOCAL TESTING READY

## 📍 **CURRENT SITUATION:**

### ❌ **Problem Found:**
Your Vercel backend is **not accessible** - the URL redirects to a login page. This means we can't use it for testing.

### ✅ **Solution Implemented:**
I've configured the app to run **BOTH frontend and backend LOCALLY** so you can test all features before deploying again.

---

## 🎯 **YOUR NEXT STEPS:**

### **Step 1: Run the Setup Script**
Double-click this file:
```
setup-and-test.bat
```

This will:
- ✅ Create `.env` file with Supabase credentials
- ✅ Start backend server (port 5000)
- ✅ Start frontend server (port 3000)
- ✅ Open browser automatically

---

### **Step 2: Test All Features**

Follow the checklist in **START_TESTING_NOW.md**

**Priority Tests:**
1. ✅ Sign Up - Create new account
2. ✅ Login - Login with account
3. ✅ Follow - Follow another user
4. ✅ Create Post - Upload image with caption
5. ✅ Like - Like a post
6. ✅ Comment - Comment on a post

---

### **Step 3: Report Results**

Tell me what works and what doesn't work. Use this format:

```
✅ Sign Up: Working
✅ Login: Working
❌ Follow: Error: [describe error]
✅ Create Post: Working
...etc
```

---

## 📁 **FILES CHANGED:**

### **1. src/utils/api.ts**
- Changed to use **local backend** in development
- Uses `http://localhost:5000/api` when running locally
- Uses Vercel backend only in production

### **2. vite.config.ts**
- Changed `base` from `/SYNC_WeB/` to `/` for local testing
- **NOTE:** We'll change this back to `/SYNC_WeB/` before deploying to GitHub Pages

### **3. setup-and-test.bat** (NEW)
- Automated script to start both servers
- Creates `.env` file if missing
- Kills old Node processes
- Opens browser automatically

### **4. START_TESTING_NOW.md** (NEW)
- Comprehensive testing guide
- Step-by-step instructions
- Troubleshooting tips

---

## 🗄️ **DATABASE STATUS:**

### **Supabase Configuration:**
- **URL:** https://davkthwggjegcqrmigaph.supabase.co
- **Tables:** Should be created (run COMPLETE_SUPABASE_SETUP.sql if not)
- **Auth:** JWT-based authentication

### **If Database Issues:**
1. Go to: https://supabase.com/dashboard/project/davkthwggjegcqrmigaph/editor
2. Click "SQL Editor"
3. Open `COMPLETE_SUPABASE_SETUP.sql` from project
4. Copy all SQL and paste
5. Click "Run"

---

## 🔧 **TROUBLESHOOTING:**

### **Backend Won't Start:**
```bash
# Kill existing processes
taskkill /F /IM node.exe

# Start manually
npm run server
```

### **Frontend Won't Start:**
```bash
# Kill existing processes
taskkill /F /IM node.exe

# Start manually
npm run dev
```

### **Port Already in Use:**
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Try again
setup-and-test.bat
```

### **Supabase Connection Error:**
Check `.env` file contains:
```env
SUPABASE_URL=https://davkthwggjegcqrmigaph.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
JWT_SECRET=instok-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

---

## 📊 **WHAT'S WORKING:**

- ✅ Frontend UI loads perfectly
- ✅ Navigation works
- ✅ Mock data displays correctly
- ✅ App is responsive and looks great

## ⏳ **WHAT WE'RE TESTING:**

- ⏳ Sign Up / Registration
- ⏳ Login / Authentication
- ⏳ Follow / Unfollow users
- ⏳ Create posts with images
- ⏳ Like posts
- ⏳ Comment on posts
- ⏳ User profiles
- ⏳ Search functionality

---

## 🚀 **AFTER TESTING:**

Once all features work locally, we'll:

1. **Fix/Deploy Vercel Backend:**
   - Get correct Vercel URL
   - Or deploy backend properly
   - Or use different backend host

2. **Update Frontend Config:**
   - Change `vite.config.ts` base back to `/SYNC_WeB/`
   - Update API URL to production backend

3. **Deploy to GitHub Pages:**
   - Run `npm run deploy`
   - Enable GitHub Pages
   - Your app goes live!

---

## 📞 **NEED HELP?**

If you encounter errors:
1. Press **F12** to open Developer Tools
2. Check **Console** tab for errors
3. Check **Network** tab for failed requests
4. Send me the error messages

---

## 🎯 **START NOW:**

```bash
# Double-click this file:
setup-and-test.bat

# Then follow:
START_TESTING_NOW.md
```

---

## 📝 **QUICK CHECKLIST:**

- [ ] Run `setup-and-test.bat`
- [ ] Wait for browser to open
- [ ] Test Sign Up
- [ ] Test Login
- [ ] Test Follow
- [ ] Test Create Post
- [ ] Test Like
- [ ] Test Comment
- [ ] Report results to me

---

**Let's test everything locally first, then we'll deploy!** 🚀

