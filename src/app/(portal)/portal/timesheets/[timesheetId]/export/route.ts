import { StandardFonts, rgb } from "pdf-lib";

import { getCurrentUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { formatPortalDate, formatPortalTime, getPortalDateTimeParts } from "@/lib/portal/time";
import { formatWorkedMinutesLabel } from "@/lib/portal/timesheets";

function buildExportFilename({
  firstName,
  lastName,
  weekStartDate,
  weekEndDate
}: {
  firstName: string;
  lastName: string;
  weekStartDate: Date;
  weekEndDate: Date;
}) {
  const startParts = getPortalDateTimeParts(weekStartDate);
  const endParts = getPortalDateTimeParts(weekEndDate);
  const slug = `${firstName}_${lastName}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `staff_${slug}_${startParts.month}${startParts.day}${startParts.year}-${endParts.month}${endParts.day}${endParts.year}.pdf`;
}

function wrapText(text: string, maxCharsPerLine: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;

    if (nextLine.length <= maxCharsPerLine) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    currentLine = word;
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [""];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ timesheetId: string }> }
) {
  const currentUser = await getCurrentUser();
  const { timesheetId } = await params;

  if (!currentUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const timesheet = await getDb().weeklyTimesheet.findUnique({
    where: {
      id: timesheetId
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          staffId: true
        }
      },
      entries: {
        orderBy: {
          workDate: "asc"
        }
      }
    }
  });

  if (!timesheet) {
    return new Response("Not found", { status: 404 });
  }

  if (currentUser.role !== "ADMIN" && currentUser.id !== timesheet.userId) {
    return new Response("Forbidden", { status: 403 });
  }

  const { PDFDocument } = await import("pdf-lib");
  const pdfDocument = await PDFDocument.create();
  const regularFont = await pdfDocument.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDocument.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDocument.addPage([842, 595]);
  let { width, height } = page.getSize();
  const marginX = 48;
  const topMargin = 44;
  const bottomMargin = 40;
  let cursorY = height - topMargin;

  const ensureSpace = (requiredHeight: number) => {
    if (cursorY - requiredHeight >= bottomMargin) {
      return;
    }

    page = pdfDocument.addPage([842, 595]);
    ({ width, height } = page.getSize());
    cursorY = height - topMargin;
  };

  const drawLine = (thickness = 1, color = rgb(0.78, 0.82, 0.88)) => {
    ensureSpace(12);
    page.drawLine({
      start: { x: marginX, y: cursorY },
      end: { x: width - marginX, y: cursorY },
      thickness,
      color
    });
    cursorY -= 16;
  };

  const drawTextBlock = ({
    text,
    font = regularFont,
    size = 11,
    color = rgb(0.12, 0.16, 0.2),
    lineHeight = 15,
    maxCharsPerLine = 90
  }: {
    text: string;
    font?: typeof regularFont;
    size?: number;
    color?: ReturnType<typeof rgb>;
    lineHeight?: number;
    maxCharsPerLine?: number;
  }) => {
    const lines = wrapText(text, maxCharsPerLine);
    ensureSpace(lines.length * lineHeight + 4);

    for (const line of lines) {
      page.drawText(line, {
        x: marginX,
        y: cursorY,
        size,
        font,
        color
      });
      cursorY -= lineHeight;
    }
  };

  const drawSummaryRow = (label: string, value: string, x: number, y: number) => {
    page.drawText(label, {
      x,
      y,
      size: 10,
      font: regularFont,
      color: rgb(0.33, 0.38, 0.43)
    });
    page.drawText(value, {
      x,
      y: y - 16,
      size: 15,
      font: boldFont,
      color: rgb(0.08, 0.11, 0.15)
    });
  };

  page.drawText("Weekly Timesheet", {
    x: marginX,
    y: cursorY,
    size: 24,
    font: boldFont,
    color: rgb(0.08, 0.11, 0.15)
  });
  cursorY -= 28;

  drawTextBlock({
    text: `${timesheet.user.firstName} ${timesheet.user.lastName} | ${formatPortalDate(timesheet.weekStartDate)} - ${formatPortalDate(timesheet.weekEndDate)}`,
    size: 12,
    font: regularFont,
    color: rgb(0.27, 0.33, 0.39),
    lineHeight: 16
  });
  cursorY -= 6;

  drawLine(1.5, rgb(0.78, 0.72, 0.45));

  ensureSpace(88);
  drawSummaryRow("Staff ID", timesheet.user.staffId || "Not assigned", marginX, cursorY);
  drawSummaryRow("Email", timesheet.user.email || "Not supplied", marginX + 170, cursorY);
  drawSummaryRow("Days worked", String(timesheet.totalDaysWorked), marginX + 410, cursorY);
  drawSummaryRow("Total time", formatWorkedMinutesLabel(timesheet.totalMinutesWorked), marginX + 560, cursorY);
  cursorY -= 48;
  drawSummaryRow("Late arrivals", String(timesheet.lateCount), marginX, cursorY);
  drawSummaryRow("Early clock-outs", String(timesheet.earlyClockOutCount), marginX + 170, cursorY);
  drawSummaryRow("Missed clock-outs", String(timesheet.missedClockOutCount), marginX + 410, cursorY);
  cursorY -= 48;

  drawTextBlock({
    text: `Status summary: ${timesheet.statusSummary}`,
    font: regularFont,
    size: 11,
    lineHeight: 15
  });

  if (timesheet.notes) {
    drawTextBlock({
      text: `Notes: ${timesheet.notes}`,
      font: regularFont,
      size: 11,
      lineHeight: 15
    });
  }

  cursorY -= 4;
  drawLine();

  ensureSpace(28);
  page.drawText("Daily breakdown", {
    x: marginX,
    y: cursorY,
    size: 16,
    font: boldFont,
    color: rgb(0.08, 0.11, 0.15)
  });
  cursorY -= 24;

  for (const entry of timesheet.entries) {
    ensureSpace(54);

    page.drawText(formatPortalDate(entry.workDate), {
      x: marginX,
      y: cursorY,
      size: 11,
      font: boldFont,
      color: rgb(0.08, 0.11, 0.15)
    });
    page.drawText(entry.attendanceStatus, {
      x: marginX + 170,
      y: cursorY,
      size: 11,
      font: regularFont,
      color: rgb(0.18, 0.24, 0.3)
    });
    page.drawText(`In ${formatPortalTime(entry.clockInAt)}`, {
      x: marginX + 410,
      y: cursorY,
      size: 11,
      font: regularFont,
      color: rgb(0.18, 0.24, 0.3)
    });
    page.drawText(`Out ${formatPortalTime(entry.clockOutAt)}`, {
      x: marginX + 530,
      y: cursorY,
      size: 11,
      font: regularFont,
      color: rgb(0.18, 0.24, 0.3)
    });
    page.drawText(formatWorkedMinutesLabel(entry.workedMinutes), {
      x: marginX + 690,
      y: cursorY,
      size: 11,
      font: boldFont,
      color: rgb(0.08, 0.11, 0.15)
    });

    cursorY -= 18;

    page.drawLine({
      start: { x: marginX, y: cursorY },
      end: { x: width - marginX, y: cursorY },
      thickness: 0.75,
      color: rgb(0.88, 0.9, 0.93)
    });
    cursorY -= 14;
  }

  const pdfBytes = await pdfDocument.save();

  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${buildExportFilename({
        firstName: timesheet.user.firstName,
        lastName: timesheet.user.lastName,
        weekStartDate: timesheet.weekStartDate,
        weekEndDate: timesheet.weekEndDate
      })}"`
    }
  });
}
