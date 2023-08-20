export const PORT = process.env.PORT || 8080;
export const MONGO_CONNECTION_STRING =
    process.env.MONGO_CONNECTION_STRING || "";
export const MAILER_EMAIL_ID = process.env.MAILER_EMAIL_ID;
export const MAILER_PASSWORD = process.env.MAILER_PASSWORD;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
export const ACCESS_TOKEN_LIFE = "1m";
export const REFRESH_TOKEN_LIFE = "1d";
