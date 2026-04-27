import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { handleDropoffWorkflow } from "../services/journeyOrchestratorService";

import * as driverModel from "../models/driver.model";

export async function studentDropped(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { journeyId, studentId } = req.body;

    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // Resolve the internal driver ID from the current user
    const driver = await driverModel.getDriverByUserId(req.user.id);
    if (!driver) {
      return res.status(404).json({
        error: "Driver profile not found",
      });
    }

    if (!journeyId || !studentId) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    await handleDropoffWorkflow(
      Number(journeyId),
      driver.id!,
      Number(studentId)
    );

    return res.json({
      status: "student dropoff recorded",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Dropoff failed",
    });
  }
}