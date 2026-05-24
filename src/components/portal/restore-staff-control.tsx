"use client";

import { useState } from "react";

import { restoreStaffAction } from "@/modules/auth/actions";

export function RestoreStaffControl({
  archiveId,
  requiresPassword
}: {
  archiveId: string;
  requiresPassword: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-start gap-3 lg:items-end">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="text-sm font-semibold text-emerald-700 transition-colors hover:text-ink"
      >
        Undo deactivation
      </button>

      {isOpen ? (
        <form action={restoreStaffAction.bind(null, archiveId)} className="w-full max-w-sm space-y-3 lg:text-left">
          {requiresPassword ? (
            <>
              <div>
                <label htmlFor={`restore-password-${archiveId}`} className="auth-label">
                  New password
                </label>
                <input
                  id={`restore-password-${archiveId}`}
                  name="password"
                  type="password"
                  className="auth-input"
                  required
                />
              </div>
              <div>
                <label htmlFor={`restore-confirm-password-${archiveId}`} className="auth-label">
                  Confirm password
                </label>
                <input
                  id={`restore-confirm-password-${archiveId}`}
                  name="confirmPassword"
                  type="password"
                  className="auth-input"
                  required
                />
              </div>
            </>
          ) : null}

          <div className="flex gap-3 lg:justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-ink"
            >
              Cancel
            </button>
            <button type="submit" className="text-sm font-semibold text-emerald-700 transition-colors hover:text-ink">
              Restore
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
