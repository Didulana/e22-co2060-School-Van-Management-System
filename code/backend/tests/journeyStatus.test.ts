import request from "supertest";

jest.mock("../src/models/journeyStatusModel", () => ({
  getLatestLocation: jest.fn(),
  getBoardedCount: jest.fn(),
  getDroppedCount: jest.fn(),
  getNotificationCount: jest.fn(),
}));

import app from "../src/app";
import * as journeyStatusModel from "../src/models/journeyStatusModel";

const mockedJourneyStatusModel =
  journeyStatusModel as jest.Mocked<typeof journeyStatusModel>;

describe("GET /api/journey/:id/status", () => {
  beforeEach(() => {
    mockedJourneyStatusModel.getLatestLocation.mockResolvedValue({
      latitude: 6.931,
      longitude: 79.866,
      recorded_at: "2026-03-09T04:01:13.859Z",
    });

    mockedJourneyStatusModel.getBoardedCount.mockResolvedValue(1);
    mockedJourneyStatusModel.getDroppedCount.mockResolvedValue(0);
    mockedJourneyStatusModel.getNotificationCount.mockResolvedValue(4);
  });

  it("should return journey status summary", async () => {
    const response = await request(app).get("/api/journey/1/status");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      journeyId: 1,
      latestLocation: {
        latitude: 6.931,
        longitude: 79.866,
        recorded_at: "2026-03-09T04:01:13.859Z",
      },
      boardedCount: 1,
      droppedCount: 0,
      notifications: 4,
    });
  });

  it("should return 400 for invalid journey id", async () => {
    const response = await request(app).get("/api/journey/abc/status");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid journey id",
    });
  });
});