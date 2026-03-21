import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../types/auth";

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

export function authenticateToken(
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
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      error: "JWT secret is not configured",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtUserPayload;
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}