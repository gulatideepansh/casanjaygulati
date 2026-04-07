export const SESSION_COOKIE_NAME = "portal_session";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
export const PASSWORD_RESET_DURATION_MS = 1000 * 60 * 30;
export const APP_BASE_URL =
  process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
