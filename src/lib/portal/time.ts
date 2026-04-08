import {
  EXPECTED_CLOCK_IN_HOUR,
  EXPECTED_CLOCK_IN_MINUTE,
  EXPECTED_CLOCK_OUT_HOUR,
  EXPECTED_CLOCK_OUT_MINUTE,
  PORTAL_TIMEZONE
} from "./config";

type PortalDateTimeParts = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
  weekday: string;
};

function extractPart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes
) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

export function getPortalDateTimeParts(date = new Date()): PortalDateTimeParts {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: PORTAL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);

  return {
    year: extractPart(parts, "year"),
    month: extractPart(parts, "month"),
    day: extractPart(parts, "day"),
    weekday: extractPart(parts, "weekday"),
    hour: extractPart(parts, "hour"),
    minute: extractPart(parts, "minute"),
    second: extractPart(parts, "second")
  };
}

export function getPortalDateKey(date = new Date()) {
  const parts = getPortalDateTimeParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getPortalMinutes(date = new Date()) {
  const parts = getPortalDateTimeParts(date);
  return Number(parts.hour) * 60 + Number(parts.minute);
}

export function getPortalDateValue(date = new Date()) {
  const parts = getPortalDateTimeParts(date);
  return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
}

export function getPortalDayDifference(targetDate: Date, referenceDate = new Date()) {
  return Math.round((getPortalDateValue(targetDate) - getPortalDateValue(referenceDate)) / 86400000);
}

export function getPortalDueState(targetDate: Date, referenceDate = new Date()) {
  const dayDifference = getPortalDayDifference(targetDate, referenceDate);

  if (dayDifference < 0) {
    return "OVERDUE";
  }

  if (dayDifference === 0) {
    return targetDate.getTime() < referenceDate.getTime() ? "OVERDUE" : "TODAY";
  }

  return "UPCOMING";
}

export function getPortalClockInStatus(date = new Date()) {
  return getPortalMinutes(date) <= EXPECTED_CLOCK_IN_HOUR * 60 + EXPECTED_CLOCK_IN_MINUTE
    ? "ON_TIME"
    : "LATE";
}

export function getPortalClockOutStatus(date = new Date()) {
  return getPortalMinutes(date) >= EXPECTED_CLOCK_OUT_HOUR * 60 + EXPECTED_CLOCK_OUT_MINUTE
    ? "COMPLETED"
    : "EARLY_CLOCK_OUT";
}

export function formatPortalDateTime(value: Date | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: PORTAL_TIMEZONE,
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}

export function formatPortalTime(value: Date | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: PORTAL_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(value);
}

export function formatPortalDate(value: Date | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: PORTAL_TIMEZONE,
    dateStyle: "medium"
  }).format(value);
}

export function formatPortalHeaderDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: PORTAL_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(value);
}

export function formatPortalHeaderTime(value = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: PORTAL_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(value);
}

export function formatPortalDateTimeInputValue(value: Date | null) {
  if (!value) {
    return "";
  }

  const parts = getPortalDateTimeParts(value);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function portalDateInputToDate(value: string) {
  return new Date(`${value}T19:30:00+05:30`);
}

export function portalDateTimeInputToDate(value: string) {
  if (!value) {
    return new Date(Number.NaN);
  }

  return new Date(`${value}:00+05:30`);
}
