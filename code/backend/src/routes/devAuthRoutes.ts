import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/test-driver-token", (_req, res) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      error: "JWT secret is not configured",
    });
  }

  const token = jwt.sign(
    {
      id: 1,
      email: "driver1@test.com",
      role: "driver",
    },
    jwtSecret,
    { expiresIn: "1h" }
  );

  return res.json({
    token,
  });
});

export default router;