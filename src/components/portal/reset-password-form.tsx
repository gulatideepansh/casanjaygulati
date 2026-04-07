"use client";

import Link from "next/link";
import { useActionState } from "react";

import { resetPasswordAction } from "@/modules/auth/actions";
import { initialAuthActionState, type AuthActionState } from "@/modules/auth/form-state";

import { AuthFeedback } from "./auth-feedback";
import { SubmitButton } from "./submit-button";

type ResetPasswordFormProps = {
  token: string;
};

function fieldError(state: AuthActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const action = resetPasswordAction.bind(null, token);
  const [state, formAction] = useActionState(action, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="password" className="auth-label">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="auth-input"
        />
        {fieldError(state, "password") ? (
          <p className="mt-2 text-sm text-rose-300">{fieldError(state, "password")}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="auth-label">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="auth-input"
        />
        {fieldError(state, "confirmPassword") ? (
          <p className="mt-2 text-sm text-rose-300">{fieldError(state, "confirmPassword")}</p>
        ) : null}
      </div>

      <AuthFeedback state={state} />
      <SubmitButton label="Update Password" pendingLabel="Updating Password..." />

      {state.status === "success" ? (
        <Link href="/portal/sign-in" className="block text-center text-sm text-brass transition hover:text-[#d7b979]">
          Return to sign in
        </Link>
      ) : null}
    </form>
  );
}
