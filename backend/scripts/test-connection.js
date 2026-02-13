const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:2301@localhost:5432/techAssassin';

console.log('Testing PostgreSQL connection...');
console.log('Connection string:', connectionString.replace(/:2301@/, ':****@'));

const pool = new Pool({ connectionString });

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('\n❌ Connection failed:');
    console.error('Error:', err.message);
    console.error('\nPossible issues:');
    console.error('1. PostgreSQL server is not running');
    console.error('2. Database "techassassin" does not exist');
    console.error('3. User "techassassin" does not exist');
    console.error('4. Password is incorrect');
    console.error('5. PostgreSQL is not accepting connections on localhost:5432');
    process.exit(1);
  } else {
    console.log('\n✅ Connection successful!');
    console.log('Server time:', res.rows[0].now);
    pool.end();
  }
});
