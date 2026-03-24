const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'femase',
  password: 'superadmin',
  port: 5432,
});

async function run() {
  try {
    await client.connect();
    
    // Find any table with 'marca' in its name across all schemas in femase db
    const res2 = await client.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name ILIKE '%marca%'");
    console.log('--- TABLES LIKE marca in femase DB ---');
    console.log(res2.rows);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
