import request from "supertest";
import bcrypt from "bcryptjs";

// Mock pg pool query
jest.mock("../src/config/db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

import app from "../src/app";
import { pool } from "../src/config/db";

describe("Auth routes", () => {
  const mockQuery = pool.query as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockQuery.mockImplementation(async (sql: string, params: any[]) => {
      if (sql.includes("SELECT * FROM users WHERE email = $1")) {
        const email = params[0];
        if (email === "driver1@schoolvan.local") {
          return {
            rows: [{
              id: 1,
              email: "driver1@schoolvan.local",
              name: "Driver One",
              role: "driver",
              password_hash: bcrypt.hashSync("Driver@123", 10),
            }]
          };
        }
        if (email === "parent1@schoolvan.local") {
          return {
            rows: [{
              id: 101,
              email: "parent1@schoolvan.local",
              name: "Parent One",
              role: "parent",
              password_hash: bcrypt.hashSync("Parent@123", 10),
            }]
          };
        }
        return { rows: [] };
      }

      if (sql.includes("SELECT id, name, email, role, phone, is_approved, created_at FROM users WHERE id = $1")) {
        const id = params[0];
        if (id === 101) {
          return {
            rows: [{
              id: 101,
              email: "parent1@schoolvan.local",
              role: "parent",
            }]
          };
        }
        return { rows: [] };
      }

      return { rows: [] };
    });
  });

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
