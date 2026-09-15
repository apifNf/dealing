"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { membershipSchema, type MembershipFormValues } from "@/lib/validations/membership";
import { submitMembershipApplication, type MembershipResult } from "@/app/membership/actions";
import { GlassField } from "@/components/onboarding/shared/fields/GlassField";
import { GlassInput } from "@/components/onboarding/shared/fields/GlassInput";
import { SubmitStatus } from "@/components/onboarding/shared/SubmitStatus";

function buildFormData(data: MembershipFormValues): FormData {
  const formData = new FormData();
  formData.set("name", data.name);
  formData.set("contactInfo", data.contactInfo);
  if (data.reason) formData.set("reason", data.reason);
  return formData;
}

export function MembershipForm() {
  const [result, setResult] = useState<MembershipResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipSchema),
    mode: "onTouched",
    defaultValues: { name: "", contactInfo: "", reason: "" },
  });

  const { register, formState } = form;

  const onSubmit = form.handleSubmit((data) => {
    setResult(null);
    startTransition(async () => {
      const response = await submitMembershipApplication(buildFormData(data));
      setResult(response);
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-6">
      <GlassField label="Nama" htmlFor="name" error={formState.errors.name?.message}>
        <GlassInput id="name" type="text" placeholder="Nama lengkap Anda" invalid={!!formState.errors.name} {...register("name")} />
      </GlassField>

      <GlassField
        label="Email atau Nomor WA/Telegram"
        htmlFor="contactInfo"
        error={formState.errors.contactInfo?.message}
      >
        <GlassInput
          id="contactInfo"
          type="text"
          placeholder="nama@email.com atau +62812xxxxxxx"
          invalid={!!formState.errors.contactInfo}
          {...register("contactInfo")}
        />
      </GlassField>

      <GlassField
        label="Alasan Tertarik Jadi Member"
        htmlFor="reason"
        error={formState.errors.reason?.message}
        hint="Opsional"
      >
        <GlassInput
          id="reason"
          type="text"
          placeholder="Contoh: Ingin dapat info listing lebih dulu"
          invalid={!!formState.errors.reason}
          {...register("reason")}
        />
      </GlassField>

      {result && <SubmitStatus status={result.status === "success" ? "success" : "error"} message={result.message} />}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(194,65,12,0.35)] transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isPending ? "Mengirim..." : "Ajukan Aplikasi Membership"}
      </button>
    </form>
  );
}
