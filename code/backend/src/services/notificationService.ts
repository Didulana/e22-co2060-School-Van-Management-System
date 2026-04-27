import { emitToRoom, journeyRoom } from "./socketService";
import { saveNotification } from "../models/notificationModel";

export async function sendJourneyNotification(
  journeyId: number,
  type: string,
  message: string,
  studentId?: number
) {
  await saveNotification({
    journeyId,
    studentId,
    type,
    message,
  });

  emitToRoom(journeyRoom(journeyId), "notification:new", {
    journeyId,
    studentId: studentId || null,
    type,
    message,
    timestamp: new Date().toISOString(),
  });
}