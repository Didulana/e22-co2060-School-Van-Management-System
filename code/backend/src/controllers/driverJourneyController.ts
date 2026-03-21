import { Request, Response } from "express";
import {
  createJourney,
  updateJourneyStatus,
  getActiveJourneyByDriver,
  getJourneyById,
  getJourneysByDriver,
  getStudentsForJourney,
  getAttendanceByDriver,
} from "../models/journeyModel";
import { handleBoardingWorkflow, handleDropoffWorkflow, handleJourneyEventWorkflow } from "../services/journeyOrchestratorService";

/**
 * POST /start — Start a new journey
 */
export const startJourney = async (req: Request, res: Response) => {
  try {
    const { driver_id, route_id } = req.body;

    if (!driver_id || !route_id) {
      return res.status(400).json({ error: "driver_id and route_id are required" });
    }

    // Check if driver already has an active journey
    const existing = await getActiveJourneyByDriver(driver_id);
    if (existing) {
      return res.status(409).json({
        error: "Driver already has an active journey",
        journey: existing,
      });
    }

    const journey = await createJourney(driver_id, route_id);

    await handleJourneyEventWorkflow(
      journey.id,
      driver_id,
      "journey_started",
      "Driver has started the pickup route"
    );

    res.status(201).json(journey);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /:id/board/:studentId — Mark student as boarded
 */
export const boardStudent = async (req: Request, res: Response) => {
  try {
    const journeyId = parseInt(req.params.id as string, 10);
    const studentId = parseInt(req.params.studentId as string, 10);

    const journey = await getJourneyById(journeyId);
    if (!journey) {
      return res.status(404).json({ error: "Journey not found" });
    }

    await handleBoardingWorkflow(journeyId, journey.driver_id, studentId);

    res.json({ message: `Student ${studentId} boarded successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /:id/arrive-school — Mark arrived at school
 */
export const arriveAtSchool = async (req: Request, res: Response) => {
  try {
    const journeyId = parseInt(req.params.id as string, 10);

    const journey = await getJourneyById(journeyId);
    if (!journey) {
      return res.status(404).json({ error: "Journey not found" });
    }

    const updated = await updateJourneyStatus(journeyId, "arrived_at_school");

    await handleJourneyEventWorkflow(
      journeyId,
      journey.driver_id,
      "arrived_at_school",
      "Van has arrived at the school"
    );

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /:id/start-return — Start return journey
 */
export const startReturn = async (req: Request, res: Response) => {
  try {
    const journeyId = parseInt(req.params.id as string, 10);

    const journey = await getJourneyById(journeyId);
    if (!journey) {
      return res.status(404).json({ error: "Journey not found" });
    }

    const updated = await updateJourneyStatus(journeyId, "return_started");

    await handleJourneyEventWorkflow(
      journeyId,
      journey.driver_id,
      "return_started",
      "Driver has started the return route"
    );

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /:id/drop/:studentId — Mark student as dropped off
 */
export const dropStudent = async (req: Request, res: Response) => {
  try {
    const journeyId = parseInt(req.params.id as string, 10);
    const studentId = parseInt(req.params.studentId as string, 10);

    const journey = await getJourneyById(journeyId);
    if (!journey) {
      return res.status(404).json({ error: "Journey not found" });
    }

    await handleDropoffWorkflow(journeyId, journey.driver_id, studentId);

    res.json({ message: `Student ${studentId} dropped off successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /:id/complete — Complete the journey
 */
export const completeJourney = async (req: Request, res: Response) => {
  try {
    const journeyId = parseInt(req.params.id as string, 10);

    const journey = await getJourneyById(journeyId);
    if (!journey) {
      return res.status(404).json({ error: "Journey not found" });
    }

    const updated = await updateJourneyStatus(journeyId, "completed", new Date());

    await handleJourneyEventWorkflow(
      journeyId,
      journey.driver_id,
      "journey_completed",
      "Journey has been completed"
    );

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /active?driver_id=X — Get driver's active journey
 */
export const getActiveJourney = async (req: Request, res: Response) => {
  try {
    const driverIdParam = req.query.driver_id as string;
    const driverId = parseInt(driverIdParam, 10);

    if (!driverId) {
      return res.status(400).json({ error: "driver_id query param required" });
    }

    const journey = await getActiveJourneyByDriver(driverId);
    if (!journey) {
      return res.json({ active: false, journey: null });
    }

    const students = await getStudentsForJourney(journey.id);

    res.json({ active: true, journey, students });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /history?driver_id=X — Get journey history
 */
export const getJourneyHistory = async (req: Request, res: Response) => {
  try {
    const driverIdParam = req.query.driver_id as string;
    const driverId = parseInt(driverIdParam, 10);

    if (!driverId) {
      return res.status(400).json({ error: "driver_id query param required" });
    }

    const journeys = await getJourneysByDriver(driverId);
    res.json(journeys);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /:id/students — Get students + boarding/dropoff status for a journey
 */
export const getJourneyStudents = async (req: Request, res: Response) => {
  try {
    const journeyId = parseInt(req.params.id as string, 10);
    const students = await getStudentsForJourney(journeyId);
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /attendance?driver_id=X — Get attendance records
 */
export const getAttendance = async (req: Request, res: Response) => {
  try {
    const driverIdParam = req.query.driver_id as string;
    const driverId = parseInt(driverIdParam, 10);

    if (!driverId) {
      return res.status(400).json({ error: "driver_id query param required" });
    }

    const records = await getAttendanceByDriver(driverId);
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
