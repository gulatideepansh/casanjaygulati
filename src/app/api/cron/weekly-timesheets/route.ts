import { NextResponse } from "next/server";

import { generateWeeklyTimesheetsForWeek, getMostRecentClosedWorkWeek } from "@/lib/portal/timesheets";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      {
        ok: false,
        message: "CRON_SECRET is not configured."
      },
      {
        status: 500
      }
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      {
        ok: false,
        message: "Unauthorized."
      },
      {
        status: 401
      }
    );
  }

  const range = getMostRecentClosedWorkWeek();
  const result = await generateWeeklyTimesheetsForWeek({
    range,
    source: "cron"
  });

  return NextResponse.json({
    ok: true,
    weekStartDate: range.weekStartKey,
    weekEndDate: range.weekEndKey,
    ...result
  });
}
