"use client";

import { useActionState } from "react";

import { forgotPasswordAction } from "@/modules/auth/actions";
import { initialAuthActionState, type AuthActionState } from "@/modules/auth/form-state";

import { AuthFeedback } from "./auth-feedback";
import { SubmitButton } from "./submit-button";

function fieldError(state: AuthActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="auth-label">
          Staff account email address
        </label>
        <input id="email" name="email" type="email" autoComplete="email" className="auth-input" />
        {fieldError(state, "email") ? (
          <p className="mt-2 text-sm text-rose-700">{fieldError(state, "email")}</p>
        ) : null}
      </div>

      <AuthFeedback state={state} />
      <SubmitButton label="Send Reset Link" pendingLabel="Sending Link..." />
    </form>
  );
}
