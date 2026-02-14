/**
 * Check all tables in PostgreSQL database
 * This script lists all tables and their row counts
 */

const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'techassassin',
  user: 'postgres',
  password: '2301',
});

async function checkAllTables() {
  try {
    console.log('🔍 Checking PostgreSQL Database...\n');
    console.log('Connection Details:');
    console.log(`  Host: localhost`);
    console.log(`  Port: 5432`);
    console.log(`  Database: techassassin`);
    console.log(`  User: postgres`);
    console.log('\n' + '='.repeat(80) + '\n');

    // Get all schemas
    const schemasResult = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
      ORDER BY schema_name;
    `);

    console.log('📁 SCHEMAS FOUND:');
    schemasResult.rows.forEach(row => {
      console.log(`  - ${row.schema_name}`);
    });
    console.log('\n' + '='.repeat(80) + '\n');

    // Get all tables from all schemas
    const tablesResult = await pool.query(`
      SELECT 
        table_schema,
        table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
    `);

    if (tablesResult.rows.length === 0) {
      console.log('❌ No tables found in the database!\n');
      return;
    }

    console.log(`📊 TABLES FOUND: ${tablesResult.rows.length} total\n`);

    // Group tables by schema
    const tablesBySchema = {};
    tablesResult.rows.forEach(row => {
      if (!tablesBySchema[row.table_schema]) {
        tablesBySchema[row.table_schema] = [];
      }
      tablesBySchema[row.table_schema].push(row.table_name);
    });

    // Check each table
    for (const [schema, tables] of Object.entries(tablesBySchema)) {
      console.log(`\n📂 Schema: ${schema.toUpperCase()}`);
      console.log('-'.repeat(80));

      for (const table of tables) {
        try {
          // Get row count
          const countResult = await pool.query(
            `SELECT COUNT(*) as count FROM "${schema}"."${table}";`
          );
          const count = parseInt(countResult.rows[0].count);

          // Get column info
          const columnsResult = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_schema = $1 AND table_name = $2
            ORDER BY ordinal_position;
          `, [schema, table]);

          console.log(`\n  📋 Table: ${table}`);
          console.log(`     Rows: ${count}`);
          console.log(`     Columns (${columnsResult.rows.length}):`);
          
          columnsResult.rows.forEach(col => {
            const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
            console.log(`       - ${col.column_name} (${col.data_type}) ${nullable}`);
          });

          // If table has data, show sample
          if (count > 0 && count <= 5) {
            const sampleResult = await pool.query(
              `SELECT * FROM "${schema}"."${table}" LIMIT 3;`
            );
            console.log(`     Sample Data (${Math.min(count, 3)} rows):`);
            sampleResult.rows.forEach((row, idx) => {
              console.log(`       Row ${idx + 1}:`, JSON.stringify(row, null, 2).substring(0, 200));
            });
          }

        } catch (error) {
          console.log(`\n  ❌ Table: ${table}`);
          console.log(`     Error: ${error.message}`);
        }
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ Database check complete!\n');

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

checkAllTables();
