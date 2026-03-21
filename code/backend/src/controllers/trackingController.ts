import { Response } from "express";
import { processLocationUpdate } from "../services/trackingService";
import { getLatestLocations } from "../models/locationModel";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { locationUpdateSchema } from "../validators/trackingValidator";

export async function updateLocation(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (req.user.role !== "driver") {
      return res.status(403).json({
        error: "Only drivers can update location",
      });
    }

    const validation = locationUpdateSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid location data",
        details: validation.error.flatten(),
      });
    }

    const { journeyId, lat, lng } = validation.data;

    await processLocationUpdate({
      driverId: req.user.id,
      journeyId,
      lat,
      lng,
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