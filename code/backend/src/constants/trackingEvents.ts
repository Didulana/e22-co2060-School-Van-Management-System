export const TRACKING_EVENTS = {
  AUTH_ERROR: "auth:error",

  TRACKING_SUBSCRIBE_JOURNEY: "tracking:subscribe-journey",
  TRACKING_UNSUBSCRIBE_JOURNEY: "tracking:unsubscribe-journey",
  TRACKING_SUBSCRIBED: "tracking:subscribed",
  TRACKING_UNSUBSCRIBED: "tracking:unsubscribed",

  TRACKING_LOCATION_UPDATE: "tracking:location-update",
  TRACKING_LOCATION_BROADCAST: "tracking:location-broadcast",

  NOTIFICATION_NEW: "notification:new",
} as const;