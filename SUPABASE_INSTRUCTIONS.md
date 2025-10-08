# 🚀 SUPABASE SETUP - STEP BY STEP

Your Supabase configuration is ready! Follow these steps:

## ✅ Step 1: Run SQL Setup in Supabase

1. **Open Supabase SQL Editor:**
   - Go to: https://app.supabase.com/project/davkthwggjegcqrmigaph/sql/new

2. **Copy the COMPLETE SQL file:**
   - Open: `COMPLETE_SUPABASE_SETUP.sql`
   - Copy ALL contents (Ctrl+A, Ctrl+C)

3. **Paste and Run:**
   - Paste into Supabase SQL Editor
   - Click "Run" button
   - Wait for completion (should take ~10 seconds)

4. **Verify:**
   - Go to: https://app.supabase.com/project/davkthwggjegcqrmigaph/editor
   - You should see 10 tables created

---

## 🔑 Step 2: Get Service Role Key

1. **Get your Service Role Key:**
   - Go to: https://app.supabase.com/project/davkthwggjegcqrmigaph/settings/api
   - Copy the **"service_role" secret** key (NOT the anon key)

2. **Update environment file:**
   - Open `.env.supabase`
   - Replace `your-service-role-key-here` with your actual service role key

3. **Rename the file:**
   ```bash
   # On Windows:
   rename .env.supabase .env
   
   # Or manually rename .env.supabase to .env
   ```

---

## 📦 Step 3: Install Supabase Package

```bash
npm install @supabase/supabase-js
```

---

## 🧪 Step 4: Test the Connection

Create a test file to verify connection:

**File: `test-supabase.js`**
```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function test() {
  // Test query
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Connected to Supabase!');
    console.log('Users table exists:', data !== null);
  }
}

test();
```

Run the test:
```bash
node test-supabase.js
```

---

## 📊 Verify Database Tables

All these tables should be created:

1. ✅ **users** - User accounts
2. ✅ **followers** - Follow relationships
3. ✅ **posts** - User posts
4. ✅ **post_likes** - Post likes
5. ✅ **comments** - Post comments
6. ✅ **comment_likes** - Comment likes
7. ✅ **stories** - 24-hour stories
8. ✅ **story_viewers** - Story view tracking
9. ✅ **messages** - Direct messages
10. ✅ **notifications** - User notifications

---

## 🎯 Quick SQL Queries to Verify

Run these in Supabase SQL Editor to verify setup:

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check views
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';

-- Check functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public';
```

Expected results:
- **Tables:** 10
- **Views:** 4 (user_profiles, posts_with_counts, comments_with_counts, active_stories)
- **Functions:** 4 (get_user_feed, get_conversations, search_users, delete_expired_stories)

---

## 📝 Your Credentials

**Project URL:** `https://davkthwggjegcqrmigaph.supabase.co`

**Anon Key:** 
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdmt0aHdnamVnY3FybWlnYXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzg0MzQsImV4cCI6MjA3NTUxNDQzNH0.Byevw85s1o5ynxyizRZs5qga1lz2z5_uwRJcLn1gRvw
```

**Service Role Key:** Get from Settings → API

---

## 🌐 Important URLs

- **Project Dashboard:** https://app.supabase.com/project/davkthwggjegcqrmigaph
- **SQL Editor:** https://app.supabase.com/project/davkthwggjegcqrmigaph/sql/new
- **Table Editor:** https://app.supabase.com/project/davkthwggjegcqrmigaph/editor
- **API Settings:** https://app.supabase.com/project/davkthwggjegcqrmigaph/settings/api
- **Database Settings:** https://app.supabase.com/project/davkthwggjegcqrmigaph/settings/database

---

## 🎨 Optional: Seed Sample Data

If you want test data, run this after the main setup:

1. Open: `supabase/seed.sql`
2. **IMPORTANT:** Update the bcrypt password hashes first!
3. Paste and run in SQL Editor

---

## ⚡ Enable Storage (for images/videos)

1. Go to: https://app.supabase.com/project/davkthwggjegcqrmigaph/storage/buckets
2. Click "New bucket"
3. Create buckets:
   - Name: `avatars` (Public)
   - Name: `posts` (Public)
   - Name: `stories` (Public)
   - Name: `messages` (Public)

---

## 🔄 Next Steps After Setup

Once database is ready:

1. ✅ Run the SQL setup (Step 1)
2. ✅ Add Service Role Key (Step 2)
3. ✅ Install dependencies (Step 3)
4. ✅ Test connection (Step 4)
5. 🚀 Update backend routes to use Supabase
6. 🚀 Update frontend to use Supabase client
7. 🚀 Test the app!

---

## 🆘 Troubleshooting

**"relation does not exist" error:**
- Make sure you ran the COMPLETE_SUPABASE_SETUP.sql file
- Check if tables exist in Table Editor

**"Invalid API key" error:**
- Verify your keys in .env file
- Make sure you copied the correct keys

**"permission denied" error:**
- Check Row Level Security policies
- Use Service Role Key for admin operations

**Connection timeout:**
- Check your internet connection
- Verify Supabase project is active

---

## 📚 Documentation References

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)
- [Storage](https://supabase.com/docs/guides/storage)

---

## ✨ What You Get

With this setup, you have:

- ✅ **PostgreSQL Database** (more powerful than MongoDB)
- ✅ **Realtime Subscriptions** (live updates!)
- ✅ **Row Level Security** (built-in security)
- ✅ **Auto-generated REST API** (no backend needed for simple queries)
- ✅ **Built-in Authentication** (optional Supabase Auth)
- ✅ **File Storage** (Supabase Storage)
- ✅ **Edge Functions** (serverless functions)

---

**Ready?** Start with Step 1! 🚀

Let me know when you've completed the SQL setup and I'll help you update the backend code!

