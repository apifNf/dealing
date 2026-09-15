"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth";
import { requestPasswordReset, type ForgotPasswordResult } from "@/app/forgot-password/actions";
import { GlassField } from "@/components/onboarding/shared/fields/GlassField";
import { GlassInput } from "@/components/onboarding/shared/fields/GlassInput";
import { SubmitStatus } from "@/components/onboarding/shared/SubmitStatus";

function buildFormData(data: ForgotPasswordFormValues): FormData {
  const formData = new FormData();
  formData.set("email", data.email);
  return formData;
}

export function ForgotPasswordForm() {
  const [result, setResult] = useState<ForgotPasswordResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const { register, formState } = form;

  const onSubmit = form.handleSubmit((data) => {
    setResult(null);
    startTransition(async () => {
      const response = await requestPasswordReset(buildFormData(data));
      setResult(response);
    });
  });

  if (result?.status === "success") {
    return <SubmitStatus status="success" message={result.message} />;
  }

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

      {result && result.status === "error" && <SubmitStatus status="error" message={result.message} />}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(194,65,12,0.35)] transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isPending ? "Mengirim..." : "Kirim Link Reset"}
      </button>
    </form>
  );
}
