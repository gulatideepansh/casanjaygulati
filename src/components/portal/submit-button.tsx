"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label: string;
  pendingLabel: string;
};

export function SubmitButton({ label, pendingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="button-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70">
      {pending ? pendingLabel : label}
    </button>
  );
}
