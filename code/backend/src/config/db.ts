import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "Didulana",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "school_van_db",
});

export async function testDbConnection(): Promise<void> {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT NOW()");
    console.log("PostgreSQL connected:", result.rows[0]);
  } finally {
    client.release();
  }
}