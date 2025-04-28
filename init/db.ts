import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import schema from '../src/data/schemas';

export const dbInitializer = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });
  const connectToDb = async () => {

    try {
      await pool.connect();
      console.log('Connected to the database');
    } catch (error) {
      console.error(
        'Failed to connect to the database or apply schema:',
        error,
      );
      throw error;
    }
  };
  return { db, connectToDb };
};
