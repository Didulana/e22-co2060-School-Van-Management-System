import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import {
  authenticateDemoUser,
  getDemoCredentials,
  signAuthToken,
} from "../services/authService";
import { LoginRequestBody } from "../types/auth";

export function login(req: Request<{}, {}, LoginRequestBody>, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const user = authenticateDemoUser(email, password);

  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const token = signAuthToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return res.json({
    token,
    user,
  });
}

export function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const { id, email, role } = req.user;

  return res.json({
    user: {
      id,
      email,
      role,
    },
  });
}

export function listDemoAccounts(_req: Request, res: Response) {
  return res.json({
    accounts: getDemoCredentials(),
  });
}
