"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInAction } from "@/modules/auth/actions";
import { initialAuthActionState, type AuthActionState } from "@/modules/auth/form-state";

import { AuthFeedback } from "./auth-feedback";
import { SubmitButton } from "./submit-button";

function fieldError(state: AuthActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

export function SignInForm() {
  const [state, formAction] = useActionState(signInAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="identifier" className="auth-label">
          Username or email address
        </label>
        <input
          id="identifier"
          name="identifier"
          autoComplete="username"
          className="auth-input"
          placeholder="Enter your username or email"
        />
        {fieldError(state, "identifier") ? (
          <p className="mt-2 text-sm text-rose-300">{fieldError(state, "identifier")}</p>
        ) : null}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="password" className="auth-label mb-0">
            Password
          </label>
          <Link href="/portal/forgot-password" className="text-sm text-brass transition hover:text-[#d7b979]">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="auth-input"
          placeholder="Enter your password"
        />
        {fieldError(state, "password") ? (
          <p className="mt-2 text-sm text-rose-300">{fieldError(state, "password")}</p>
        ) : null}
      </div>

      <AuthFeedback state={state} />
      <SubmitButton label="Sign In" pendingLabel="Signing In..." />
    </form>
  );
}
