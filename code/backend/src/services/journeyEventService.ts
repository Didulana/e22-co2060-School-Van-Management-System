import { saveJourneyEvent } from "../models/journeyEventModel";
import { sendJourneyNotification } from "./notificationService";

export async function triggerJourneyEvent(
  journeyId: number,
  driverId: number,
  type: string,
  message: string
) {
  await saveJourneyEvent(journeyId, driverId, type, message);

  await sendJourneyNotification(journeyId, type, message);
}