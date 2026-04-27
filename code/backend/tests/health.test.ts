import request from "supertest";
import app from "../src/app";

describe("GET /api/health", () => {
  it("should return backend health response", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Backend is running",
    });
  });
});