import type { AuthActionState } from "@/modules/auth/form-state";

type AuthFeedbackProps = {
  state: AuthActionState;
};

export function AuthFeedback({ state }: AuthFeedbackProps) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  const toneClasses =
    state.status === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-800";

  return <div className={`border px-4 py-3 text-sm ${toneClasses}`}>{state.message}</div>;
}
