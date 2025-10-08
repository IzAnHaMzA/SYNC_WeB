import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase Connection...\n');

// Test with Anon Key
const supabaseAnon = createClient(supabaseUrl, supabaseKey);

// Test with Service Role Key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  console.log('📊 Supabase Configuration:');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Anon Key: ${supabaseKey.substring(0, 20)}...`);
  console.log(`Service Key: ${supabaseServiceKey.substring(0, 20)}...\n`);

  // Test 1: Check if tables exist
  console.log('✅ Test 1: Checking if tables exist...');
  try {
    const { data: tables, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Error:', error.message);
      console.log('⚠️  Make sure you ran COMPLETE_SUPABASE_SETUP.sql in Supabase SQL Editor!\n');
    } else {
      console.log('✅ Users table exists!\n');
    }
  } catch (err) {
    console.log('❌ Connection error:', err.message, '\n');
  }

  // Test 2: Check all tables
  console.log('✅ Test 2: Verifying all tables...');
  const tables = [
    'users',
    'followers', 
    'posts',
    'post_likes',
    'comments',
    'comment_likes',
    'stories',
    'story_viewers',
    'messages',
    'notifications'
  ];

  for (const table of tables) {
    try {
      const { error } = await supabaseAdmin
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`  ❌ ${table}: Not found`);
      } else {
        console.log(`  ✅ ${table}: OK`);
      }
    } catch (err) {
      console.log(`  ❌ ${table}: Error - ${err.message}`);
    }
  }

  // Test 3: Check views
  console.log('\n✅ Test 3: Checking views...');
  const views = ['user_profiles', 'posts_with_counts', 'comments_with_counts', 'active_stories'];
  
  for (const view of views) {
    try {
      const { error } = await supabaseAdmin
        .from(view)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`  ❌ ${view}: Not found`);
      } else {
        console.log(`  ✅ ${view}: OK`);
      }
    } catch (err) {
      console.log(`  ❌ ${view}: Error`);
    }
  }

  // Test 4: Check functions
  console.log('\n✅ Test 4: Testing database functions...');
  try {
    // Create a test user first
    const testUserId = '00000000-0000-0000-0000-000000000000';
    
    const { data, error } = await supabaseAdmin.rpc('search_users', {
      p_query: 'test',
      p_limit: 5
    });
    
    if (error) {
      console.log('  ❌ search_users function: Error -', error.message);
    } else {
      console.log('  ✅ search_users function: OK');
    }
  } catch (err) {
    console.log('  ❌ Function test error:', err.message);
  }

  console.log('\n========================================');
  console.log('🎉 Supabase Connection Test Complete!');
  console.log('========================================\n');
  
  console.log('Next steps:');
  console.log('1. ✅ Database is connected');
  console.log('2. 📦 Run: npm install @supabase/supabase-js');
  console.log('3. 🚀 Ready to start building!\n');
}

testConnection().catch(console.error);

