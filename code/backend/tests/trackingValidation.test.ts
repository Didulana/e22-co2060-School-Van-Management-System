import request from "supertest";

jest.mock("../src/middleware/authMiddleware", () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    req.user = {
      id: 1,
      email: "driver1@test.com",
      role: "driver",
    };
    next();
  },
}));

import app from "../src/app";

describe("POST /api/tracking/location validation", () => {
  it("should return 400 if location fields are missing", async () => {
    const response = await request(app)
      .post("/api/tracking/location")
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 400 if latitude or longitude is invalid", async () => {
    const response = await request(app)
      .post("/api/tracking/location")
      .send({
        journeyId: 1,
        lat: "invalid",
        lng: "invalid",
      });

    expect(response.status).toBe(400);
  });
});