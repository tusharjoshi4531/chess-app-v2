export const PORT = process.env.PORT || 8080;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;
export const MONGO_CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING || "";
export const REDIS_URL = process.env.REDIS_URL || "local";
export const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL as string;
export const NOTIFICATION_SERVER_URL = process.env
  .NOTIFICATION_SERVER_URL as string;
export const LIVE_USER_LIFE = "1d";

export const TEN_MINUTES_IN_MS = 600000;