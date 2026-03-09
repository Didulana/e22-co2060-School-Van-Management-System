import { emitToRoom, journeyRoom } from "./socketService";
import { saveNotification } from "../models/notificationModel";

export async function sendJourneyNotification(
  journeyId: number,
  type: string,
  message: string
) {
  await saveNotification({
    journeyId,
    type,
    message,
  });

  emitToRoom(journeyRoom(journeyId), "notification:new", {
    journeyId,
    type,
    message,
    timestamp: new Date().toISOString(),
  });
}