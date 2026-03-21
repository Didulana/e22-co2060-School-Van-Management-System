import request from "supertest";

jest.mock("../src/middleware/authMiddleware", () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    req.user = {
      id: 101,
      email: "parent1@test.com",
      role: "parent",
    };
    next();
  },
}));

jest.mock("../src/models/notificationModel", () => ({
  getUnreadNotificationCount: jest.fn(),
}));

import app from "../src/app";
import * as notificationModel from "../src/models/notificationModel";

const mockedNotificationModel =
  notificationModel as jest.Mocked<typeof notificationModel>;

describe("GET /api/notifications/unread-count", () => {
  beforeEach(() => {
    mockedNotificationModel.getUnreadNotificationCount.mockResolvedValue(3);
  });

  it("should return unread notification count", async () => {
    const response = await request(app).get(
      "/api/notifications/unread-count?journeyId=1"
    );

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      unreadCount: 3,
    });
  });
});