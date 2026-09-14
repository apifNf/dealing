"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { login, type LoginState } from "@/app/admin/login/actions";
import { GlassField } from "@/components/onboarding/shared/fields/GlassField";
import { GlassInput } from "@/components/onboarding/shared/fields/GlassInput";

const initialState: LoginState = {};

type LoginFormProps = {
  next: string;
};

export function LoginForm({ next }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-6">
      <input type="hidden" name="next" value={next} />

      <GlassField label="Passcode" htmlFor="passcode" error={state.error}>
        <GlassInput
          id="passcode"
          name="passcode"
          type="password"
          autoFocus
          autoComplete="off"
          placeholder="Masukkan passcode admin"
          invalid={!!state.error}
        />
      </GlassField>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(194,65,12,0.35)] transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        {isPending ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
