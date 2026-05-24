"use client";

import { useActionState } from "react";

import { createStaffByAdminAction } from "@/modules/auth/actions";
import { initialAuthActionState, type AuthActionState } from "@/modules/auth/form-state";

import { AuthFeedback } from "./auth-feedback";
import { SubmitButton } from "./submit-button";

function fieldError(state: AuthActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

export function AdminStaffForm() {
  const [state, formAction] = useActionState(createStaffByAdminAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="admin-username" className="auth-label">
            Username
          </label>
          <input id="admin-username" name="username" className="auth-input" autoComplete="off" />
          {fieldError(state, "username") ? (
            <p className="mt-2 text-sm text-rose-700">{fieldError(state, "username")}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="admin-email" className="auth-label">
            Email address
          </label>
          <input id="admin-email" name="email" type="email" className="auth-input" autoComplete="off" />
          {fieldError(state, "email") ? (
            <p className="mt-2 text-sm text-rose-700">{fieldError(state, "email")}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="admin-firstName" className="auth-label">
            First name
          </label>
          <input id="admin-firstName" name="firstName" className="auth-input" autoComplete="off" />
          {fieldError(state, "firstName") ? (
            <p className="mt-2 text-sm text-rose-700">{fieldError(state, "firstName")}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="admin-lastName" className="auth-label">
            Last name
          </label>
          <input id="admin-lastName" name="lastName" className="auth-input" autoComplete="off" />
          {fieldError(state, "lastName") ? (
            <p className="mt-2 text-sm text-rose-700">{fieldError(state, "lastName")}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="admin-profilePicture" className="auth-label">
          Profile picture (optional)
        </label>
        <input
          id="admin-profilePicture"
          name="profilePicture"
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="auth-input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="admin-password" className="auth-label">
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            className="auth-input"
            autoComplete="new-password"
          />
          {fieldError(state, "password") ? (
            <p className="mt-2 text-sm text-rose-700">{fieldError(state, "password")}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="admin-confirmPassword" className="auth-label">
            Confirm password
          </label>
          <input
            id="admin-confirmPassword"
            name="confirmPassword"
            type="password"
            className="auth-input"
            autoComplete="new-password"
          />
          {fieldError(state, "confirmPassword") ? (
            <p className="mt-2 text-sm text-rose-700">{fieldError(state, "confirmPassword")}</p>
          ) : null}
        </div>
      </div>

      <p className="text-sm leading-7 text-slate-600">
        Staff IDs are generated automatically and the account becomes active immediately after creation.
      </p>

      <AuthFeedback state={state} />
      <SubmitButton label="Create Staff Member" pendingLabel="Creating Staff Member..." />
    </form>
  );
}
