"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { membershipSchema, MEMBERSHIP_PLANS, type MembershipFormValues } from "@/lib/validations/membership";
import { submitMembershipApplication, type MembershipResult } from "@/app/membership/actions";
import { GlassField } from "@/components/onboarding/shared/fields/GlassField";
import { GlassInput } from "@/components/onboarding/shared/fields/GlassInput";
import { SelectableCard } from "@/components/onboarding/shared/fields/SelectableCard";
import { SubmitStatus } from "@/components/onboarding/shared/SubmitStatus";

function buildFormData(data: MembershipFormValues): FormData {
  const formData = new FormData();
  formData.set("name", data.name);
  formData.set("contactInfo", data.contactInfo);
  formData.set("plan", data.plan);
  if (data.reason) formData.set("reason", data.reason);
  return formData;
}

export function MembershipForm() {
  const [result, setResult] = useState<MembershipResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipSchema),
    mode: "onTouched",
    defaultValues: { name: "", contactInfo: "", reason: "", plan: "YEARLY" },
  });

  const { register, watch, formState } = form;
  const selectedPlan = watch("plan");

  const onSubmit = form.handleSubmit((data) => {
    setResult(null);
    startTransition(async () => {
      const response = await submitMembershipApplication(buildFormData(data));
      setResult(response);
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-6">
      <GlassField label="Pilih Paket" error={formState.errors.plan?.message}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div key={plan.value} className="relative">
              {"savingsLabel" in plan && (
                <span className="absolute -top-2.5 right-3 z-10 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-[0_0_12px_rgba(194,65,12,0.4)]">
                  {plan.savingsLabel}
                </span>
              )}
              <SelectableCard
                id={`plan-${plan.value}`}
                label={plan.label}
                description={plan.priceLabel}
                selected={selectedPlan === plan.value}
                inputProps={{ ...register("plan"), value: plan.value }}
              />
            </div>
          ))}
        </div>
      </GlassField>

      <GlassField label="Nama" htmlFor="name" error={formState.errors.name?.message}>
        <GlassInput id="name" type="text" placeholder="Nama lengkap Anda" invalid={!!formState.errors.name} {...register("name")} />
      </GlassField>

      <GlassField
        label="Nomor WhatsApp"
        htmlFor="contactInfo"
        error={formState.errors.contactInfo?.message}
      >
        <GlassInput
          id="contactInfo"
          type="text"
          placeholder="+62812xxxxxxx"
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
