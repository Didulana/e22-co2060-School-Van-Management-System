import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { handleBoardingWorkflow } from "../services/journeyOrchestratorService";

export async function studentBoarded(
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

    if (!journeyId || !studentId) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    await handleBoardingWorkflow(
      Number(journeyId),
      req.user.id,
      Number(studentId)
    );

    return res.json({
      status: "student boarding recorded",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Boarding failed",
    });
  }
}