import { saveJourneyEvent } from "../models/journeyEventModel";
import { recordStudentBoarding } from "../models/studentBoardingModel";
import { recordStudentDropoff } from "../models/studentDropoffModel";
import { sendJourneyNotification } from "./notificationService";
import { emitToRoom, journeyRoom } from "./socketService";

export async function handleJourneyEventWorkflow(
  journeyId: number,
  driverId: number,
  type: string,
  message: string
) {
  await saveJourneyEvent(journeyId, driverId, type, message);

  await sendJourneyNotification(journeyId, type, message);

  // Broadcast to journey room for live tracking UI
  emitToRoom(journeyRoom(journeyId), "journey:status_change", {
    journeyId,
    type,
    message,
    timestamp: new Date().toISOString()
  });
}

export async function handleBoardingWorkflow(
  journeyId: number,
  driverId: number,
  studentId: number
) {
  await recordStudentBoarding(journeyId, studentId, driverId);

  const message = `Student ${studentId} boarded the van`;
  await sendJourneyNotification(
    journeyId,
    "student_boarded",
    message,
    studentId
  );

  // Broadcast to journey room
  emitToRoom(journeyRoom(journeyId), "student:boarded", {
    journeyId,
    studentId,
    message,
    timestamp: new Date().toISOString()
  });
}

export async function handleDropoffWorkflow(
  journeyId: number,
  driverId: number,
  studentId: number
) {
  await recordStudentDropoff(journeyId, studentId, driverId);

  const message = `Student ${studentId} dropped off safely`;
  await sendJourneyNotification(
    journeyId,
    "student_dropped",
    message,
    studentId
  );

  // Broadcast to journey room
  emitToRoom(journeyRoom(journeyId), "student:dropped", {
    journeyId,
    studentId,
    message,
    timestamp: new Date().toISOString()
  });
}