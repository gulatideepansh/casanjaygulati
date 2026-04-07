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
      ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
      : "border-rose-400/25 bg-rose-500/10 text-rose-100";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClasses}`}>{state.message}</div>;
}
