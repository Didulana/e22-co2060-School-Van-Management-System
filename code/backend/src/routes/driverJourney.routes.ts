import { Router } from "express";
import * as ctrl from "../controllers/driverJourneyController";

const router = Router();

// Journey lifecycle
router.post("/start", ctrl.startJourney);
router.post("/:id/board/:studentId", ctrl.boardStudent);
router.post("/:id/arrive-school", ctrl.arriveAtSchool);
router.post("/:id/start-return", ctrl.startReturn);
router.post("/:id/drop/:studentId", ctrl.dropStudent);
router.post("/:id/complete", ctrl.completeJourney);

// Query endpoints
router.get("/active", ctrl.getActiveJourney);
router.get("/history", ctrl.getJourneyHistory);
router.get("/attendance", ctrl.getAttendance);
router.get("/:id/students", ctrl.getJourneyStudents);

export default router;
