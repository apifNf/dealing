"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { ASSET_CATEGORIES, BUDGET_RANGES, buyerSchema, type BuyerFormValues } from "@/lib/validations/onboarding";
import { submitBuyerInterest, type OnboardingResult } from "@/app/onboarding/actions";
import { buildBuyerFormData } from "@/lib/onboarding/formData";
import { WizardShell } from "./shared/WizardShell";
import { GlassField } from "./shared/fields/GlassField";
import { GlassInput } from "./shared/fields/GlassInput";
import { GlassSelect } from "./shared/fields/GlassSelect";
import { ToggleChip } from "./shared/fields/ToggleChip";
import { SubmitStatus } from "./shared/SubmitStatus";

type BuyerWizardProps = {
  onExit: () => void;
};

export function BuyerWizard({ onExit }: BuyerWizardProps) {
  const [result, setResult] = useState<OnboardingResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerSchema),
    mode: "onTouched",
    defaultValues: {
      budgetRange: "" as BuyerFormValues["budgetRange"],
      categoriesOfInterest: [],
      contactInfo: "",
    },
  });

  const { register, watch, formState } = form;
  const selectedCategories = watch("categoriesOfInterest") ?? [];

  const onSubmit = form.handleSubmit((data) => {
    setResult(null);
    startTransition(async () => {
      const formData = buildBuyerFormData(data);
      const response = await submitBuyerInterest(formData);
      setResult(response);
    });
  });

  return (
    <WizardShell
      title="Preferensi Akuisisi Anda"
      description="Bantu kami mencocokkan Anda dengan deal flow yang paling relevan."
      onBack={onExit}
    >
      <form onSubmit={onSubmit} className="flex animate-step-in flex-col gap-6">
        <GlassField label="Budget Range" htmlFor="budgetRange" error={formState.errors.budgetRange?.message}>
          <GlassSelect
            id="budgetRange"
            invalid={!!formState.errors.budgetRange}
            defaultValue=""
            {...register("budgetRange")}
          >
            <option value="" disabled className="bg-[#121214]">
              Pilih rentang budget
            </option>
            {BUDGET_RANGES.map((range) => (
              <option key={range.value} value={range.value} className="bg-[#121214]">
                {range.label}
              </option>
            ))}
          </GlassSelect>
        </GlassField>

        <GlassField
          label="Kategori yang Diminati"
          error={formState.errors.categoriesOfInterest?.message}
          hint="Pilih satu atau lebih kategori"
        >
          <div className="flex flex-wrap gap-3">
            {ASSET_CATEGORIES.map((category) => (
              <ToggleChip
                key={category.value}
                label={category.label}
                selected={selectedCategories.includes(category.value)}
                inputProps={{ ...register("categoriesOfInterest"), value: category.value }}
              />
            ))}
          </div>
        </GlassField>

        <GlassField
          label="Email atau Nomor WA/Telegram"
          htmlFor="contactInfo"
          error={formState.errors.contactInfo?.message}
          hint="Supaya tim DEALING bisa menghubungkan Anda dengan penjual yang relevan"
        >
          <GlassInput
            id="contactInfo"
            type="text"
            placeholder="nama@email.com atau +62812xxxxxxx"
            invalid={!!formState.errors.contactInfo}
            {...register("contactInfo")}
          />
        </GlassField>

        {result && <SubmitStatus status={result.status === "success" ? "success" : "error"} message={result.message} />}

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(194,65,12,0.35)] transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {isPending ? "Mengirim..." : "Simpan Preferensi"}
        </button>
      </form>
    </WizardShell>
  );
}
