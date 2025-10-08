// Simple Supabase connection test
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://davkthwggjegcqrmigaph.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdmt0aHdnamVnY3FybWlnYXBoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkzODQzNCwiZXhwIjoyMDc1NTE0NDM0fQ.h4OCPtp7M1JL7eB3tMsoNUFX37I4VceAlXFp8jpAWxU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...\n');

// Test basic connection
supabase
  .from('users')
  .select('count')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.log('❌ Error:', error.message);
      console.log('Details:', error);
    } else {
      console.log('✅ Success! Connected to Supabase');
      console.log('✅ Users table exists');
    }
  })
  .catch((err) => {
    console.log('❌ Connection failed:', err.message);
  });

// Test a simple query
setTimeout(() => {
  console.log('\n🧪 Testing simple query...');
  supabase
    .from('users')
    .select('*')
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.log('❌ Query error:', error.message);
      } else {
        console.log('✅ Query successful!');
        console.log('Data:', data);
      }
    });
}, 2000);
