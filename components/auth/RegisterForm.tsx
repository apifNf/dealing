"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { registerUser, type RegisterResult } from "@/app/register/actions";
import { GlassField } from "@/components/onboarding/shared/fields/GlassField";
import { GlassInput } from "@/components/onboarding/shared/fields/GlassInput";
import { SubmitStatus } from "@/components/onboarding/shared/SubmitStatus";

type RegisterFormProps = {
  next: string;
};

function buildFormData(data: RegisterFormValues, next: string): FormData {
  const formData = new FormData();
  formData.set("email", data.email);
  formData.set("password", data.password);
  formData.set("confirmPassword", data.confirmPassword);
  formData.set("next", next);
  return formData;
}

export function RegisterForm({ next }: RegisterFormProps) {
  const [result, setResult] = useState<RegisterResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const { register, formState, setError } = form;

  const onSubmit = form.handleSubmit((data) => {
    setResult(null);
    startTransition(async () => {
      const response = await registerUser(buildFormData(data, next));
      // A successful registration redirects server-side and never returns here.
      setResult(response);
      if (response.fieldErrors) {
        for (const [field, messages] of Object.entries(response.fieldErrors)) {
          if (messages?.[0]) {
            setError(field as keyof RegisterFormValues, { message: messages[0] });
          }
        }
      }
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

      <GlassField label="Password" htmlFor="password" error={formState.errors.password?.message} hint="Minimal 8 karakter">
        <GlassInput
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          invalid={!!formState.errors.password}
          {...register("password")}
        />
      </GlassField>

      <GlassField
        label="Konfirmasi Password"
        htmlFor="confirmPassword"
        error={formState.errors.confirmPassword?.message}
      >
        <GlassInput
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          invalid={!!formState.errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </GlassField>

      {result && result.status === "error" && <SubmitStatus status="error" message={result.message} />}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(194,65,12,0.35)] transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        {isPending ? "Mendaftarkan..." : "Daftar"}
      </button>
    </form>
  );
}
