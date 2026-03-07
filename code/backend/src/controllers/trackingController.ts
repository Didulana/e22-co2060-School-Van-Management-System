import { Request, Response } from "express";
import { processLocationUpdate } from "../services/trackingService";
import { getLatestLocations } from "../models/locationModel";

export async function updateLocation(req: Request, res: Response) {
  try {
    const { driverId, journeyId, lat, lng } = req.body;

    if (
      driverId === undefined ||
      journeyId === undefined ||
      lat === undefined ||
      lng === undefined
    ) {
      return res.status(400).json({
        error: "Missing location fields",
      });
    }

    await processLocationUpdate({
      driverId: Number(driverId),
      journeyId: Number(journeyId),
      lat: Number(lat),
      lng: Number(lng),
    });

    return res.json({
      status: "location updated",
    });
  } catch (error) {
    console.error("updateLocation error:", error);

    return res.status(500).json({
      error: "Failed to update location",
    });
  }
}

export async function fetchLatestLocations(_req: Request, res: Response) {
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