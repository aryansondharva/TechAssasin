/**
 * Add missing columns to profiles table
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'techassassin',
  user: 'postgres',
  password: '2301',
});

async function addMissingColumns() {
  try {
    console.log('🔧 Adding missing columns to profiles table...\n');

    // Add bio column
    await pool.query(`
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS bio TEXT;
    `);
    console.log('✅ Added bio column');

    // Add linkedin_url column
    await pool.query(`
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
    `);
    console.log('✅ Added linkedin_url column');

    // Add portfolio_url column
    await pool.query(`
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
    `);
    console.log('✅ Added portfolio_url column');

    // Add updated_at column
    await pool.query(`
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
    `);
    console.log('✅ Added updated_at column');

    // Create or replace trigger function
    await pool.query(`
      CREATE OR REPLACE FUNCTION public.handle_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Created updated_at trigger function');

    // Drop and recreate trigger
    await pool.query(`
      DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
    `);
    
    await pool.query(`
      CREATE TRIGGER handle_profiles_updated_at
          BEFORE UPDATE ON public.profiles
          FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    `);
    console.log('✅ Created updated_at trigger');

    // Verify columns
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = 'profiles'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Current profiles table columns:');
    result.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      console.log(`  - ${col.column_name} (${col.data_type}) ${nullable}`);
    });

    console.log('\n✅ All missing columns added successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

addMissingColumns();
