import { getCurrentUser } from "@/lib/auth/session";

import { redirect } from "next/navigation";

export default async function PortalEntryPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/portal/dashboard");
  }

  redirect("/portal/sign-in");
}
