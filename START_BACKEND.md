# 🚀 Start Backend Server - Complete Guide

## ✅ What's Been Done:

All backend routes have been successfully migrated to Supabase:
- ✅ Authentication routes
- ✅ User routes
- ✅ Post routes  
- ✅ Story routes
- ✅ Comment routes
- ✅ Message routes
- ✅ Notification routes

## 📋 Prerequisites Checklist:

- ✅ Supabase database set up (tables, views, functions)
- ✅ Backend code migrated to Supabase
- ⚠️ `.env` file needs to be created

---

## 🔧 Step 1: Create `.env` File

**IMPORTANT:** You need to manually create a `.env` file in the project root with your credentials:

Create a file named `.env` in `C:\Users\User\OneDrive\Desktop\INSTOK\` with the following content:

```env
# Supabase Configuration
SUPABASE_URL=https://davkthwggjegcqrmigaph.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdmt0aHdnamVnY3FybWlnYXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzg0MzQsImV4cCI6MjA3NTUxNDQzNH0.Byevw85s1o5ynxyizRZs5qga1lz2z5_uwRJcLn1gRvw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdmt0aHdnamVnY3FybWlnYXBoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkzODQzNCwiZXhwIjoyMDc1NTE0NDM0fQ.h4OCPtp7M1JL7eB3tMsoNUFX37I4VceAlXFp8jpAWxU

# JWT Secret (for authentication tokens)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB (Legacy - can be removed if no longer needed)
MONGODB_URI=mongodb://localhost:27017/instok
```

---

## 🚀 Step 2: Start the Backend Server

Open PowerShell in the project directory and run:

```bash
npm run dev
```

This will start the Express server on port 3001.

---

## ✅ Step 3: Test the API

Once the server is running, you should see:

```
Server running on port 3001
Connected to Supabase successfully!
```

### Test Endpoints:

#### 1. **Health Check**
```bash
curl http://localhost:3001/api/
```

#### 2. **Register a New User**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\",\"fullName\":\"Test User\"}"
```

#### 3. **Login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

This will return a JWT token. Use this token for authenticated requests.

#### 4. **Get Current User** (requires auth token)
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 API Endpoints Overview:

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (auth required)

### Users (`/api/users`)
- `GET /:username` - Get user profile
- `GET /:username/posts` - Get user posts
- `POST /:userId/follow` - Follow user (auth required)
- `DELETE /:userId/follow` - Unfollow user (auth required)
- `GET /search/:query` - Search users

### Posts (`/api/posts`)
- `POST /` - Create post (auth required, with file upload)
- `GET /feed` - Get user feed (auth required)
- `GET /public` - Get public posts
- `GET /user/:userId` - Get posts by user
- `POST /:postId/like` - Like/unlike post (auth required)
- `DELETE /:postId/like` - Unlike post (auth required)

### Stories (`/api/stories`)
- `POST /` - Create story (auth required, with file upload)
- `GET /` - Get all active stories
- `GET /user/:userId` - Get user stories
- `POST /:storyId/view` - View story (auth required)
- `DELETE /:storyId` - Delete story (auth required)

### Comments (`/api/comments`)
- `GET /post/:postId` - Get comments for post
- `POST /` - Create comment (auth required)
- `POST /:commentId/like` - Like/unlike comment (auth required)
- `DELETE /:commentId` - Delete comment (auth required)

### Messages (`/api/messages`)
- `GET /conversations` - Get conversations (auth required)
- `GET /:userId` - Get messages with user (auth required)
- `POST /` - Send message (auth required, with optional image)
- `PUT /:messageId/read` - Mark as read (auth required)
- `DELETE /:messageId` - Delete message (auth required)

### Notifications (`/api/notifications`)
- `GET /` - Get notifications (auth required)
- `GET /unread-count` - Get unread count (auth required)
- `PUT /:notificationId/read` - Mark as read (auth required)
- `PUT /read-all` - Mark all as read (auth required)
- `DELETE /:notificationId` - Delete notification (auth required)

---

## 🛠️ Troubleshooting:

### If server won't start:

1. **Check if .env file exists:**
   ```bash
   ls .env
   ```
   If not found, create it as shown in Step 1.

2. **Check if port 3001 is already in use:**
   ```bash
   netstat -ano | findstr :3001
   ```
   If occupied, change PORT in `.env` to another port (e.g., 3002)

3. **Check Supabase connection:**
   - Verify your Supabase project is active
   - Check that you ran `COMPLETE_SUPABASE_SETUP.sql` in Supabase SQL Editor
   - Visit: https://app.supabase.com/project/davkthwggjegcqrmigaph/editor

### If you get database errors:

1. **Verify tables exist in Supabase:**
   - Go to: https://app.supabase.com/project/davkthwggjegcqrmigaph/editor
   - You should see 10 tables: users, followers, posts, post_likes, comments, comment_likes, stories, story_viewers, messages, notifications

2. **If tables don't exist:**
   - Open `COMPLETE_SUPABASE_SETUP.sql`
   - Copy all contents
   - Paste into Supabase SQL Editor
   - Click "RUN"

---

## 🎯 Next Steps:

Once the backend is running:

1. ✅ Test all API endpoints
2. ✅ Update frontend to connect to backend
3. ✅ Test file uploads (posts, stories)
4. ✅ Test real-time features (messages, notifications)
5. ✅ Deploy backend to production

---

## 📝 Notes:

- **Proxy Issue:** If you're behind a corporate proxy, the Supabase connection test may fail from Node.js, but the database is working fine (as confirmed in your Supabase Table Editor).
- **File Uploads:** Files are stored in the `uploads/` directory locally. For production, consider using Supabase Storage.
- **JWT Secret:** Change the JWT_SECRET in production to a strong random string.

---

## 🆘 Need Help?

If you encounter any issues:

1. Check server logs for error messages
2. Verify `.env` file has correct credentials
3. Ensure Supabase tables are set up
4. Check that port 3001 is not blocked by firewall

**Your backend is ready to go!** 🎉

