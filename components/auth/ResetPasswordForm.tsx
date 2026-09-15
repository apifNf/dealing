"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, KeyRound } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validations/auth";
import { resetPassword, type ResetPasswordResult } from "@/app/reset-password/actions";
import { GlassField } from "@/components/onboarding/shared/fields/GlassField";
import { GlassInput } from "@/components/onboarding/shared/fields/GlassInput";
import { SubmitStatus } from "@/components/onboarding/shared/SubmitStatus";

type ResetPasswordFormProps = {
  token: string;
};

function buildFormData(data: ResetPasswordFormValues, token: string): FormData {
  const formData = new FormData();
  formData.set("token", token);
  formData.set("password", data.password);
  formData.set("confirmPassword", data.confirmPassword);
  return formData;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [result, setResult] = useState<ResetPasswordResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { register, formState } = form;

  const onSubmit = form.handleSubmit((data) => {
    setResult(null);
    startTransition(async () => {
      const response = await resetPassword(buildFormData(data, token));
      setResult(response);
    });
  });

  if (result?.status === "success") {
    return (
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SubmitStatus status="success" message={result.message} />
        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(194,65,12,0.35)] transition-all hover:bg-primary-hover"
        >
          Ke Halaman Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-6">
      <GlassField label="Password Baru" htmlFor="password" error={formState.errors.password?.message} hint="Minimal 8 karakter">
        <GlassInput
          id="password"
          type="password"
          autoComplete="new-password"
          autoFocus
          placeholder="••••••••"
          invalid={!!formState.errors.password}
          {...register("password")}
        />
      </GlassField>

      <GlassField
        label="Konfirmasi Password Baru"
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
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        {isPending ? "Menyimpan..." : "Simpan Password Baru"}
      </button>
    </form>
  );
}
