import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../types/auth";
import { pool } from "../config/db";

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing or invalid authorization header",
    });
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      error: "JWT secret is not configured",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as any;
    const sub = decoded.sub || decoded.id;

    let internalId: number;
    
    if (typeof sub === 'string' && sub.includes('-')) {
      const result = await pool.query('SELECT id FROM users WHERE auth_id = $1', [sub]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "User profile syncing, please try again." });
      }
      internalId = result.rows[0].id;
    } else {
      internalId = Number(sub);
    }

    req.user = {
      id: internalId,
      email: decoded.email,
      role: decoded.user_metadata?.role || decoded.role || "parent",
    };
    return next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role permissions" });
    }

    next();
  };
}