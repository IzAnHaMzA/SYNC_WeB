# Supabase Setup Guide for INSTOK

Complete guide to migrate from MongoDB to Supabase (PostgreSQL).

## 📋 Prerequisites

1. **Supabase Account**: https://supabase.com
2. **Project Created**: SYNC_DB project in Supabase
3. **API Keys**: Anon key and Service Role key

---

## 🔑 Step 1: Get Your Supabase Credentials

1. Go to your Supabase project: https://app.supabase.com/project/SYNC_DB
2. Navigate to **Settings** → **API**
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon (public) key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret!)

---

## 📊 Step 2: Run SQL Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in Supabase Dashboard
2. Run each migration file in order:

#### Migration 1: Create Users Table
```sql
-- Copy and paste contents from: supabase/migrations/001_create_users_table.sql
```

#### Migration 2: Create Followers Table
```sql
-- Copy and paste contents from: supabase/migrations/002_create_followers_table.sql
```

#### Migration 3: Create Posts Table
```sql
-- Copy and paste contents from: supabase/migrations/003_create_posts_table.sql
```

#### Migration 4: Create Likes Table
```sql
-- Copy and paste contents from: supabase/migrations/004_create_likes_table.sql
```

#### Migration 5: Create Comments Table
```sql
-- Copy and paste contents from: supabase/migrations/005_create_comments_table.sql
```

#### Migration 6: Create Stories Table
```sql
-- Copy and paste contents from: supabase/migrations/006_create_stories_table.sql
```

#### Migration 7: Create Messages Table
```sql
-- Copy and paste contents from: supabase/migrations/007_create_messages_table.sql
```

#### Migration 8: Create Notifications Table
```sql
-- Copy and paste contents from: supabase/migrations/008_create_notifications_table.sql
```

#### Migration 9: Create Views and Functions
```sql
-- Copy and paste contents from: supabase/migrations/009_create_views_and_functions.sql
```

#### Migration 10: Enable Row Level Security
```sql
-- Copy and paste contents from: supabase/migrations/010_enable_row_level_security.sql
```

#### Migration 11: Enable Realtime
```sql
-- Copy and paste contents from: supabase/migrations/011_create_realtime_subscriptions.sql
```

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run all migrations
supabase db push
```

---

## 🌱 Step 3: Seed Sample Data (Optional)

For testing purposes, run the seed file:

```sql
-- Copy and paste contents from: supabase/seed.sql
```

**Note**: Update the bcrypt hashed passwords before using in production!

---

## ⚙️ Step 4: Update Environment Variables

Update your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Legacy (can be removed)
# MONGODB_URI=mongodb://localhost:27017/instok
```

---

## 📦 Step 5: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

---

## 🔄 Step 6: Update Backend Code

Create Supabase client configuration:

**File**: `server/config/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// For client-side (anon key)
export const supabaseClient = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY!
);
```

---

## 📚 Database Schema Overview

### Tables Created

1. **users** - User accounts and profiles
2. **followers** - Follow/following relationships
3. **posts** - User posts (images/videos)
4. **post_likes** - Likes on posts
5. **comments** - Comments on posts
6. **comment_likes** - Likes on comments
7. **stories** - 24-hour temporary stories
8. **story_viewers** - Track story views
9. **messages** - Direct messages
10. **notifications** - User notifications

### Views Created

1. **user_profiles** - Users with follower/following counts
2. **posts_with_counts** - Posts with like/comment counts
3. **comments_with_counts** - Comments with like counts
4. **active_stories** - Non-expired stories with viewer counts

### Functions Created

1. **get_user_feed()** - Get personalized feed for user
2. **get_conversations()** - Get chat conversations list
3. **search_users()** - Search users by username/name
4. **delete_expired_stories()** - Clean up old stories

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with policies for:
- ✅ Public viewing where appropriate
- ✅ Users can only modify their own data
- ✅ Privacy controls for private accounts
- ✅ Secure message and notification access

---

## ⚡ Realtime Features Enabled

Subscribe to live updates on:
- Posts (new posts in feed)
- Likes (real-time like counts)
- Comments (live comments)
- Messages (instant chat)
- Notifications (live notifications)
- Followers (follow/unfollow updates)

### Example: Subscribe to Messages

```typescript
const subscription = supabase
  .from('messages')
  .on('INSERT', (payload) => {
    console.log('New message:', payload.new);
  })
  .subscribe();
```

---

## 🧪 Testing the Database

### 1. Verify Tables

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### 2. Check Row Counts

```sql
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'posts', COUNT(*) FROM posts
UNION ALL
SELECT 'followers', COUNT(*) FROM followers;
```

### 3. Test Functions

```sql
-- Test search
SELECT * FROM search_users('john', 5);

-- Test user feed (replace with actual user ID)
SELECT * FROM get_user_feed('11111111-1111-1111-1111-111111111111', 10, 0);
```

---

## 🔄 Migration from MongoDB

If you have existing MongoDB data:

1. **Export MongoDB data**:
```bash
mongoexport --db=instok --collection=users --out=users.json
```

2. **Transform and import** to Supabase using a migration script
3. **Verify data integrity** after migration

---

## 📊 Database Management

### Backup

Supabase automatically backs up your database daily. For manual backups:

1. Go to **Database** → **Backups** in Supabase Dashboard
2. Click "Create Backup"

### Monitoring

- **Database Size**: Settings → Database
- **Query Performance**: Database → Query Performance
- **API Analytics**: Settings → API Analytics

---

## 🚀 Performance Optimization

### Indexes Created

All tables have proper indexes on:
- Primary keys (automatic)
- Foreign keys
- Frequently queried columns
- Composite indexes for complex queries

### Query Optimization

Use the provided views and functions instead of complex joins:
```typescript
// Good ✅
const { data } = await supabase.rpc('get_user_feed', { 
  p_user_id: userId, 
  p_limit: 20 
});

// Avoid ❌ (complex joins in application code)
```

---

## 🔒 Security Best Practices

1. **Never expose Service Role Key** in client-side code
2. **Use Anon Key** for client applications
3. **Validate all inputs** server-side
4. **Enable RLS** on all tables (already done)
5. **Use parameterized queries** to prevent SQL injection
6. **Rotate keys** periodically in production

---

## 🌐 API Integration

### Example: Create User

```typescript
import { supabase } from './config/supabase';
import bcrypt from 'bcryptjs';

async function createUser(username: string, email: string, password: string, fullName: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        username,
        email,
        password: hashedPassword,
        full_name: fullName
      }
    ])
    .select()
    .single();
  
  return { data, error };
}
```

### Example: Get User Feed

```typescript
async function getUserFeed(userId: string, limit: number = 20, offset: number = 0) {
  const { data, error } = await supabase
    .rpc('get_user_feed', {
      p_user_id: userId,
      p_limit: limit,
      p_offset: offset
    });
  
  return { data, error };
}
```

---

## 📱 Client-Side Usage

For React Native / Web clients:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xxxxx.supabase.co',
  'your-anon-key'
);

// Subscribe to new messages
const subscription = supabase
  .from('messages')
  .on('INSERT', (payload) => {
    // Handle new message
  })
  .subscribe();
```

---

## 🐛 Troubleshooting

### Issue: "permission denied for table users"

**Solution**: Ensure RLS policies are set correctly and you're using the right API key.

### Issue: "relation does not exist"

**Solution**: Run all migration files in order.

### Issue: "invalid input syntax for type uuid"

**Solution**: Ensure UUIDs are in correct format (`gen_random_uuid()` or valid UUID string).

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)

---

## ✅ Checklist

- [ ] Created Supabase project (SYNC_DB)
- [ ] Obtained API keys
- [ ] Ran all 11 migrations in order
- [ ] Updated `.env` with Supabase credentials
- [ ] Installed `@supabase/supabase-js`
- [ ] Created `server/config/supabase.ts`
- [ ] Tested database with sample queries
- [ ] Enabled realtime subscriptions
- [ ] Verified RLS policies
- [ ] Updated backend routes to use Supabase

---

**Need Help?** Check Supabase documentation or create an issue.

**Ready to migrate the backend code?** Let me know and I'll update all the route files!

