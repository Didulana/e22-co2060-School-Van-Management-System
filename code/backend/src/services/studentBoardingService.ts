import { recordStudentBoarding } from "../models/studentBoardingModel";
import { sendJourneyNotification } from "./notificationService";

export async function processStudentBoarding(
  journeyId: number,
  studentId: number,
  driverId: number
) {
  await recordStudentBoarding(
    journeyId,
    studentId,
    driverId
  );

  const message = `Student ${studentId} boarded the van`;

  await sendJourneyNotification(
    journeyId,
    "student_boarded",
    message
  );
}