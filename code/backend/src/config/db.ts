import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "school_van_db",
      }
);

export async function testDbConnection(): Promise<void> {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT NOW()");
    console.log("PostgreSQL connected:", result.rows[0]);
  } finally {
    client.release();
  }
}

// Preserve default export for models checking for 'import db from ...'
export default pool;
