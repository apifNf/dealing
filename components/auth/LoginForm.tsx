"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { loginUser, type LoginResult } from "@/app/login/actions";
import { GlassField } from "@/components/onboarding/shared/fields/GlassField";
import { GlassInput } from "@/components/onboarding/shared/fields/GlassInput";
import { SubmitStatus } from "@/components/onboarding/shared/SubmitStatus";

type LoginFormProps = {
  next: string;
};

function buildFormData(data: LoginFormValues, next: string): FormData {
  const formData = new FormData();
  formData.set("email", data.email);
  formData.set("password", data.password);
  formData.set("next", next);
  return formData;
}

export function LoginForm({ next }: LoginFormProps) {
  const [result, setResult] = useState<LoginResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const { register, formState } = form;

  const onSubmit = form.handleSubmit((data) => {
    setResult(null);
    startTransition(async () => {
      const response = await loginUser(buildFormData(data, next));
      // A successful login redirects server-side and never returns here.
      setResult(response);
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-6">
      <GlassField label="Email" htmlFor="email" error={formState.errors.email?.message}>
        <GlassInput
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="nama@email.com"
          invalid={!!formState.errors.email}
          {...register("email")}
        />
      </GlassField>

      <GlassField label="Password" htmlFor="password" error={formState.errors.password?.message}>
        <GlassInput
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          invalid={!!formState.errors.password}
          {...register("password")}
        />
      </GlassField>

      {result && result.status === "error" && <SubmitStatus status="error" message={result.message} />}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(194,65,12,0.35)] transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        {isPending ? "Memeriksa..." : "Masuk"}
      </button>

      <Link href="/forgot-password" className="text-center text-xs text-textMuted hover:text-textMain transition-colors">
        Lupa password?
      </Link>
    </form>
  );
}
