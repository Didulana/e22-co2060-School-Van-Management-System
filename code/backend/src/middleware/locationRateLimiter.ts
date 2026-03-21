import rateLimit from "express-rate-limit";

export const locationRateLimiter = rateLimit({
  windowMs: 5 * 1000,
  max: 5,
  message: {
    error: "Too many location updates. Slow down."
  }
});