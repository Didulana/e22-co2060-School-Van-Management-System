import { Router } from "express";
import { sendAnnouncement } from "../controllers/driverAnnounceController";

const router = Router();

router.post("/", sendAnnouncement);

export default router;
