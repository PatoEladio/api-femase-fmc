
const { Client } = require('pg');

async function fixTable() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'superadmin',
    database: 'femase',
  });

  try {
    await client.connect();
    await client.query(`ALTER TABLE "db_fmc"."documentos" RENAME COLUMN "id " TO "id";`);
    console.log('Column "id " renamed to "id" successfully.');
  } catch (err) {
    console.error('Error renaming column:', err);
  } finally {
    await client.end();
  }
}

fixTable();
