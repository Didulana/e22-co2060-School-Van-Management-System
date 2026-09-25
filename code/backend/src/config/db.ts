import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool(
  process.env.DATABASE_URL
    ? { 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "school_van_db",
      }
);

export async function ensureSchema(): Promise<void> {
  const statements = [
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS nic VARCHAR(20) UNIQUE`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS province VARCHAR(50)`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS dob DATE`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS selfie_url TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS guardian_type VARCHAR(20)`,

    `ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_image TEXT`,
    `ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_expiry DATE`,

    `CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        address VARCHAR(255),
        city VARCHAR(100),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `ALTER TABLE schools ADD COLUMN IF NOT EXISTS address VARCHAR(255)`,
    `ALTER TABLE schools ADD COLUMN IF NOT EXISTS city VARCHAR(100)`,
    `ALTER TABLE schools ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8)`,
    `ALTER TABLE schools ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8)`,

    `CREATE TABLE IF NOT EXISTS driver_schools (
        id SERIAL PRIMARY KEY,
        driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
        school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        UNIQUE(driver_id, school_id)
    )`,

    `ALTER TABLE students ADD COLUMN IF NOT EXISTS preferred_name VARCHAR(255)`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS dob DATE`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS grade VARCHAR(20)`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS portrait_photo TEXT`,
    `ALTER TABLE route_stops ALTER COLUMN stop_name TYPE VARCHAR(255)`,
    `INSERT INTO schools (name, city, latitude, longitude) VALUES
      ('Royal College', 'Colombo', 6.9056, 79.8617),
      ('Ananda College', 'Colombo', 6.9279, 79.8711),
      ('Nalanda College', 'Colombo', 6.9272, 79.8745),
      ('Visakha Vidyalaya', 'Colombo', 6.8885, 79.8582),
      ('St. Thomas'' College', 'Mount Lavinia', 6.8378, 79.8665),
      ('Ladies'' College', 'Colombo', 6.9115, 79.8550),
      ('Musaeus College', 'Colombo', 6.9095, 79.8672),
      ('St. Joseph''s College', 'Colombo', 6.9190, 79.8687),
      ('St. Peter''s College', 'Colombo', 6.8860, 79.8596),
      ('Bishop''s College', 'Colombo', 6.9130, 79.8540),
      ('Sirimavo Bandaranaike Vidyalaya', 'Colombo', 6.8967, 79.8661),
      ('Trinity College', 'Kandy', 7.2995, 80.6384),
      ('Kingswood College', 'Kandy', 7.2798, 80.6128),
      ('Dharmaraja College', 'Kandy', 7.2917, 80.6482),
      ('Mahinda College', 'Galle', 6.0463, 80.2185),
      ('Richmond College', 'Galle', 6.0536, 80.2117)
    ON CONFLICT (name) DO NOTHING`,
  ];

  for (const sql of statements) {
    try {
      await pool.query(sql);
    } catch (err: any) {
      console.warn("Schema initialization notice:", err.message);
    }
  }
}

export async function testDbConnection(): Promise<void> {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT NOW()");
    console.log("PostgreSQL connected:", result.rows[0]);
    await ensureSchema();
    console.log("Database schema columns verified.");
  } finally {
    client.release();
  }
}

// Preserve default export for models checking for 'import db from ...'
export default pool;
