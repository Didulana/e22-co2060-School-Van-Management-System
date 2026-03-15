import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import {
  getChildrenByParentId,
  getLatestBoardingForStudent,
  getLatestDropoffForStudent,
  getLatestLocationByJourneyId,
  getNotificationsByStudentId,
} from "../models/parentModel";

export async function getParentChildren(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (req.user.role !== "parent") {
      return res.status(403).json({
        error: "Only parents can access children data",
      });
    }

    const children = await getChildrenByParentId(req.user.id);

    return res.json({
      parentId: req.user.id,
      count: children.length,
      data: children,
    });
  } catch (error) {
    console.error("getParentChildren error:", error);

    return res.status(500).json({
      error: "Failed to fetch children",
    });
  }
}

export async function getChildStatus(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (req.user.role !== "parent") {
      return res.status(403).json({
        error: "Only parents can access child status",
      });
    }

    const studentId = Number(req.params.studentId);

    if (!studentId || Number.isNaN(studentId)) {
      return res.status(400).json({
        error: "Invalid student id",
      });
    }

    const children = await getChildrenByParentId(req.user.id);
    const allowed = children.some((child) => Number(child.student_id) === studentId);

    if (!allowed) {
      return res.status(403).json({
        error: "This student does not belong to the authenticated parent",
      });
    }

    const latestBoarding = await getLatestBoardingForStudent(studentId);
    const latestDropoff = await getLatestDropoffForStudent(studentId);

    const journeyId =
      latestBoarding?.journey_id || latestDropoff?.journey_id || null;

    const latestLocation = journeyId
      ? await getLatestLocationByJourneyId(Number(journeyId))
      : null;

    const notifications = await getNotificationsByStudentId(studentId);

    return res.json({
      parentId: req.user.id,
      studentId,
      journeyId,
      boarded: !!latestBoarding,
      dropped: !!latestDropoff,
      latestBoarding,
      latestDropoff,
      latestLocation,
      notifications,
    });
  } catch (error) {
    console.error("getChildStatus error:", error);

    return res.status(500).json({
      error: "Failed to fetch child status",
    });
  }
}