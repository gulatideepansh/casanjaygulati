"use client";

import { useState } from "react";

import { deactivateStaffAction } from "@/modules/auth/actions";

export function DeactivateStaffControl({ staffUserId }: { staffUserId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-start gap-3 lg:items-end">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="text-sm font-semibold text-amber-700 transition-colors hover:text-ink"
      >
        Deactivate staff
      </button>

      {isOpen ? (
        <form action={deactivateStaffAction.bind(null, staffUserId)} className="w-full max-w-xs space-y-3 lg:text-left">
          <div>
            <label htmlFor={`tenure-${staffUserId}`} className="auth-label">
              Tenure (MM/YYYY to MM/YYYY)
            </label>
            <input
              id={`tenure-${staffUserId}`}
              name="tenure"
              className="auth-input"
              placeholder="04/2024 to 04/2026"
              inputMode="numeric"
              pattern="(0[1-9]|1[0-2])/[0-9]{4} to (0[1-9]|1[0-2])/[0-9]{4}"
              required
            />
          </div>
          <div className="flex gap-3 lg:justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-ink"
            >
              Cancel
            </button>
            <button type="submit" className="text-sm font-semibold text-amber-700 transition-colors hover:text-ink">
              Confirm
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
