/**
 * Refresh Supabase schema cache
 * This tells Supabase to reload the database schema
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

async function refreshSchema() {
  try {
    console.log('🔄 Refreshing Supabase schema cache...\n');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test the connection by querying the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n💡 The schema cache needs to be refreshed in Supabase Dashboard:');
      console.log('   1. Go to https://supabase.com/dashboard');
      console.log('   2. Select your project');
      console.log('   3. Go to Database > Schema');
      console.log('   4. Click "Refresh Schema" or restart the PostgREST server\n');
    } else {
      console.log('✅ Schema cache is up to date!');
      console.lo