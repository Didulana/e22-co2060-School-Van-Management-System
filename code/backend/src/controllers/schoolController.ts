import { Request, Response } from "express";
import db from "../config/db";

export async function getSchools(_req: Request, res: Response): Promise<void> {
  try {
    const result = await db.query(`
      SELECT s.id, s.name, s.address, s.city, s.latitude, s.longitude, s.created_at,
        COUNT(ds.id)::int as driver_count
      FROM schools s
      LEFT JOIN driver_schools ds ON s.id = ds.school_id
      GROUP BY s.id
      ORDER BY s.name ASC
    `);
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch schools", details: error.message });
  }
}

export async function createSchool(req: Request, res: Response): Promise<void> {
  try {
    const { name, address, city, latitude, longitude } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ error: "School name is required" });
      return;
    }

    const result = await db.query(
      `INSERT INTO schools (name, address, city, latitude, longitude) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (name) DO UPDATE SET 
         address = COALESCE(EXCLUDED.address, schools.address),
         city = COALESCE(EXCLUDED.city, schools.city),
         latitude = COALESCE(EXCLUDED.latitude, schools.latitude),
         longitude = COALESCE(EXCLUDED.longitude, schools.longitude)
       RETURNING *`,
      [name.trim(), address || null, city || null, latitude || null, longitude || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create school", details: error.message });
  }
}

export async function deleteSchool(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid school ID" });
      return;
    }
    await db.query("DELETE FROM schools WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete school", details: error.message });
  }
}
