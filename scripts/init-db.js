const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const initDb = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const schemaPath = path.join(__dirname, '../schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  try {
    console.log('Connecting to the database...');
    const client = await pool.connect();

    console.log('Applying schema...');
    await client.query(schemaSql);

    console.log('Database initialized successfully!');
    client.release();
  } catch (error) {
    console.error('Error initializing the database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

initDb();