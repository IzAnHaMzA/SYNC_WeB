# 🚀 Local Setup Instructions - INSTOK

## ⚠️ **Current Issues Fixed:**

### 1. ✅ Removed Non-Functional Facebook Login
- The Facebook login button has been removed from the login page
- It was only a UI element with no backend functionality
- Now shows a "Demo Mode" message instead

### 2. ✅ Updated Backend from MongoDB to Supabase
- Removed MongoDB connection code from `server/index.ts`
- Backend now uses Supabase (already configured in routes)
- Server will start without MongoDB dependency

---

## 🔧 **IMPORTANT: Create .env File**

You need to manually create a `.env` file in the project root with your Supabase credentials:

### **Step 1: Create `.env` file**

Create a file named `.env` in: `C:\Users\User\OneDrive\Desktop\INSTOK\.env`

### **Step 2: Add this content:**

```env
# Supabase Configuration
SUPABASE_URL=https://davkthwggjegcqrmigaph.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdmt0aHdnamVnY3FybWlnYXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzg0MzQsImV4cCI6MjA3NTUxNDQzNH0.Byevw85s1o5ynxyizRZs5qga1lz2z5_uwRJcLn1gRvw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdmt0aHdnamVnY3FybWlnYXBoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkzODQzNCwiZXhwIjoyMDc1NTE0NDM0fQ.h4OCPtp7M1JL7eB3tMsoNUFX37I4VceAlXFp8jpAWxU

# JWT Secret
JWT_SECRET=instok-super-secret-jwt-key-change-in-production-2024

# Server Config
PORT=5000
NODE_ENV=development
```

### **Step 3: Restart the Backend Server**

After creating the `.env` file:

1. Stop the current backend server (Ctrl+C in the server terminal)
2. Run: `npm run server`
3. You should see: "Database: Supabase (Connected)"

---

## 📱 **How to Use the App:**

### **Current URLs:**

- **Frontend:** http://localhost:3000/SYNC_WeB/
- **Backend API:** http://localhost:5000/api

### **To Test Login:**

1. **Create Account:**
   - Click "Sign up" on the login page
   - Fill in: username, email, full name, password
   - Click "Register"

2. **Login:**
   - Enter your email and password
   - Click "Log In"
   - You'll be redirected to the home page

### **Features You Can Test:**

- ✅ User Registration
- ✅ User Login
- ✅ View Public Posts
- ✅ Create Posts
- ✅ Like/Unlike Posts
- ✅ Comment on Posts
- ✅ Follow/Unfollow Users
- ✅ View User Profiles
- ✅ Create Stories
- ✅ Send Messages
- ✅ Search Users

---

## 🔍 **Backend Status Check:**

Once you restart the server with the `.env` file, you should see:

```
✅ Server running on port 5000
📡 API URL: http://localhost:5000/api
🗄️  Database: Supabase (Connected)
🔑 JWT Secret: Configured
```

---

## 🐛 **Troubleshooting:**

### **Issue: "Database operations will fail"**
- **Solution:** Create the `.env` file with Supabase credentials (see above)

### **Issue: "MongoDB connected successfully" still shows**
- **Solution:** The old server is still running. Stop it and restart with `npm run server`

### **Issue: Facebook login doesn't work**
- **Solution:** ✅ Fixed! Facebook button removed, use email/password instead

### **Issue: Can't login**
- **Solution:** 
  1. Make sure backend is running with Supabase credentials
  2. Create a new account first (click "Sign up")
  3. Check browser console (F12) for errors

---

## 📊 **Current Running Services:**

1. **Frontend (Vite):** ✅ Running on port 3000
2. **Backend (Express):** ✅ Running on port 5000
3. **Database:** Supabase (requires `.env` file)

---

## ✅ **Quick Start Checklist:**

- [ ] Create `.env` file in project root
- [ ] Copy Supabase credentials to `.env`
- [ ] Restart backend server (`npm run server`)
- [ ] Verify "Database: Supabase (Connected)" message
- [ ] Open http://localhost:3000/SYNC_WeB/
- [ ] Click "Sign up" to create an account
- [ ] Test login with your new account

---

## 🎯 **Next Steps:**

1. **Create `.env` file** (most important!)
2. **Restart backend server**
3. **Register a new account**
4. **Start testing the app**

---

**Once you create the `.env` file and restart the server, your full-stack Instagram clone will work perfectly!** 🚀

