import request from "supertest";
import app from "../src/app";

describe("Auth routes", () => {
  it("should expose demo accounts for local development", async () => {
    const response = await request(app).get("/api/auth/demo-accounts");

    expect(response.status).toBe(200);
    expect(response.body.accounts).toHaveLength(3);
    expect(response.body.accounts[0]).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        role: expect.any(String),
        passwordHint: expect.any(String),
      })
    );
  });

  it("should issue a JWT for valid demo credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "driver1@schoolvan.local",
      password: "Driver@123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
      user: {
        id: 1,
        email: "driver1@schoolvan.local",
        name: "Driver One",
        role: "driver",
      },
    });
  });

  it("should reject invalid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "driver1@schoolvan.local",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Invalid email or password",
    });
  });

  it("should return the current user for a valid token", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "parent1@schoolvan.local",
      password: "Parent@123",
    });

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: {
        id: 101,
        email: "parent1@schoolvan.local",
        role: "parent",
      },
    });
  });
});
