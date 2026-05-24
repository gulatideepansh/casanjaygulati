"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label: string;
  pendingLabel: string;
  variant?: "portal" | "auth";
};

export function SubmitButton({ label, pendingLabel, variant = "portal" }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const className =
    variant === "auth"
      ? "w-full border border-ink bg-ink px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0c3558] focus:outline-none focus:ring-2 focus:ring-brass/40 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70"
      : "button-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : label}
    </button>
  );
}
