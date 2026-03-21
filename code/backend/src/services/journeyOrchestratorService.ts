import { saveJourneyEvent } from "../models/journeyEventModel";
import { recordStudentBoarding } from "../models/studentBoardingModel";
import { recordStudentDropoff } from "../models/studentDropoffModel";
import { sendJourneyNotification } from "./notificationService";

export async function handleJourneyEventWorkflow(
  journeyId: number,
  driverId: number,
  type: string,
  message: string
) {
  await saveJourneyEvent(journeyId, driverId, type, message);
  await sendJourneyNotification(journeyId, type, message);
}

export async function handleBoardingWorkflow(
  journeyId: number,
  driverId: number,
  studentId: number
) {
  await recordStudentBoarding(journeyId, studentId, driverId);

  await sendJourneyNotification(
    journeyId,
    "student_boarded",
    `Student ${studentId} boarded the van`
  );
}

export async function handleDropoffWorkflow(
  journeyId: number,
  driverId: number,
  studentId: number
) {
  await recordStudentDropoff(journeyId, studentId, driverId);

  await sendJourneyNotification(
    journeyId,
    "student_dropped",
    `Student ${studentId} dropped off safely`
  );
}