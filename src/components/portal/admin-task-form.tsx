"use client";

import { useActionState } from "react";

import { initialAuthActionState, type AuthActionState } from "@/modules/auth/form-state";
import { assignTaskAction } from "@/modules/portal/actions";

import { AuthFeedback } from "./auth-feedback";
import { SubmitButton } from "./submit-button";

type StaffOption = {
  id: string;
  fullName: string;
  staffId: string | null;
};

function fieldError(state: AuthActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

export function AdminTaskForm({
  staffOptions,
  initialStaffUserId
}: {
  staffOptions: StaffOption[];
  initialStaffUserId?: string;
}) {
  const [state, formAction] = useActionState(assignTaskAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="task-staff" className="auth-label">
          Staff member
        </label>
        <select
          id="task-staff"
          name="assignedToUserId"
          className="auth-input"
          defaultValue={initialStaffUserId ?? staffOptions[0]?.id ?? ""}
        >
          {staffOptions.map((staffUser) => (
            <option key={staffUser.id} value={staffUser.id}>
              {staffUser.fullName}{staffUser.staffId ? ` | ${staffUser.staffId}` : ""}
            </option>
          ))}
        </select>
        {fieldError(state, "assignedToUserId") ? (
          <p className="mt-2 text-sm text-rose-300">{fieldError(state, "assignedToUserId")}</p>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <label htmlFor="task-title" className="auth-label">
            Task title
          </label>
          <input id="task-title" name="title" className="auth-input" />
          {fieldError(state, "title") ? (
            <p className="mt-2 text-sm text-rose-300">{fieldError(state, "title")}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="task-priority" className="auth-label">
            Priority
          </label>
          <select id="task-priority" name="priority" defaultValue="MEDIUM" className="auth-input">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          {fieldError(state, "priority") ? (
            <p className="mt-2 text-sm text-rose-300">{fieldError(state, "priority")}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="task-description" className="auth-label">
          Task description
        </label>
        <textarea id="task-description" name="description" className="auth-input min-h-32 resize-y" />
        {fieldError(state, "description") ? (
          <p className="mt-2 text-sm text-rose-300">{fieldError(state, "description")}</p>
        ) : null}
      </div>

      <div className="max-w-sm">
        <label htmlFor="task-dueDate" className="auth-label">
          Due date
        </label>
        <input id="task-dueDate" name="dueDate" type="date" className="auth-input" />
        {fieldError(state, "dueDate") ? (
          <p className="mt-2 text-sm text-rose-300">{fieldError(state, "dueDate")}</p>
        ) : null}
      </div>

      <AuthFeedback state={state} />
      <SubmitButton label="Assign Task" pendingLabel="Assigning Task..." />
    </form>
  );
}
