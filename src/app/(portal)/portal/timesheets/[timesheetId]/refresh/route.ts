import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { regenerateWeeklyTimesheet } from "@/lib/portal/timesheets";

function buildRedirectUrl(request: Request, redirectTo?: FormDataEntryValue | null) {
  const target =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : "/portal/timesheets";

  return new URL(target, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ timesheetId: string }> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.redirect(new URL("/portal/sign-in", request.url));
  }

  if (currentUser.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
  }

  const { timesheetId } = await params;
  const formData = await request.formData();

  await regenerateWeeklyTimesheet(timesheetId, currentUser.id);

  revalidatePath("/portal/timesheets");
  revalidatePath("/portal/dashboard");

  return NextResponse.redirect(buildRedirectUrl(request, formData.get("redirectTo")), {
    status: 303
  });
}
