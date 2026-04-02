const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'superadmin',
  port: 5432,
});

client.connect().then(() => {
  return client.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'db_fmc'");
}).then(res => {
  console.log('Tables in db_fmc:', res.rows.map(r => r.table_name));
  return client.query("SELECT * FROM db_fmc.marcas LIMIT 1");
}).then(res => {
  console.log('Columns in db_fmc.marcas:', Object.keys(res.rows[0] || {}));
}).catch(err => {
  console.error('Error:', err.message);
}).finally(() => {
  client.end();
});
