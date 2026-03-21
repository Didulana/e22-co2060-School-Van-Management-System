export interface SubscribeJourneyPayload {
  journeyId: number;
}

export interface SocketErrorPayload {
  message: string;
}

export interface TrackingSubscribedPayload {
  journeyId: number;
  room: string;
}

export interface LocationBroadcastPayload {
  journeyId: number;
  lat: number;
  lng: number;
  timestamp: string;
}