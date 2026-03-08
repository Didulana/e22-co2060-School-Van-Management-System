import { Response } from "express";
import { processLocationUpdate } from "../services/trackingService";
import { getLatestLocations } from "../models/locationModel";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export async function updateLocation(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { journeyId, lat, lng } = req.body;

    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (
      journeyId === undefined ||
      lat === undefined ||
      lng === undefined
    ) {
      return res.status(400).json({
        error: "Missing location fields",
      });
    }

    if (req.user.role !== "driver") {
      return res.status(403).json({
        error: "Only drivers can update location",
      });
    }

    await processLocationUpdate({
      driverId: req.user.id,
      journeyId: Number(journeyId),
      lat: Number(lat),
      lng: Number(lng),
    });

    return res.json({
      status: "location updated",
      driverId: req.user.id,
    });
  } catch (error) {
    console.error("updateLocation error:", error);

    return res.status(500).json({
      error: "Failed to update location",
    });
  }
}

export async function fetchLatestLocations(
  _req: AuthenticatedRequest,
  res: Response
) {
  try {
    const locations = await getLatestLocations();

    return res.json({
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    console.error("fetchLatestLocations error:", error);

    return res.status(500).json({
      error: "Failed to fetch locations",
    });
  }
}