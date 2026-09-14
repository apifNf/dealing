"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SELLER_STEP_FIELDS, sellerSchema, type SellerFormValues } from "@/lib/validations/onboarding";
import { submitSellerListing, type OnboardingResult } from "@/app/onboarding/actions";
import { buildSellerFormData } from "@/lib/onboarding/formData";
import { WizardShell } from "./shared/WizardShell";
import { StepProgress } from "./shared/StepProgress";
import { CategoryPhase } from "./seller/CategoryPhase";
import { DetailsPhase } from "./seller/DetailsPhase";
import { UploadPhase } from "./seller/UploadPhase";
import { ReviewPhase } from "./seller/ReviewPhase";

const STEP_LABELS = ["Kategori", "Detail Bisnis", "Dokumen", "Kirim"];

const PHASE_DESCRIPTIONS = [
  "Pilih kategori yang paling menggambarkan aset digital Anda.",
  "Lengkapi metrik utama bisnis Anda agar pembeli bisa menilai dengan cepat.",
  "Unggah bukti pendukung seperti screenshot analytics atau revenue dashboard.",
  "Tinjau kembali data Anda sebelum mengirimkan listing ke tim kurasi DEALING.",
];

type SellerWizardProps = {
  onExit: () => void;
};

export function SellerWizard({ onExit }: SellerWizardProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<OnboardingResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerSchema),
    mode: "onTouched",
    defaultValues: {
      category: "" as SellerFormValues["category"],
      repositoryLink: "",
      mrr: undefined,
      techStack: "",
      assetUrl: "",
      avgWatchTime: "",
      monthlyTraffic: undefined,
      monthlyRevenue: undefined,
      platformName: "",
      subscriberCount: undefined,
      openRate: undefined,
      niche: "",
      storeName: "",
      skuCount: undefined,
      reasonForSelling: "",
      fileNames: [],
    },
  });

  const goNext = async () => {
    const fieldsToValidate =
      phaseIndex === 0
        ? SELLER_STEP_FIELDS.category
        : phaseIndex === 1
          ? SELLER_STEP_FIELDS.details
          : SELLER_STEP_FIELDS.upload;

    const isValid = await form.trigger(fieldsToValidate);
    if (!isValid) return;
    setPhaseIndex((index) => Math.min(index + 1, STEP_LABELS.length - 1));
  };

  const goBack = () => {
    if (phaseIndex === 0) {
      onExit();
      return;
    }
    setResult(null);
    setPhaseIndex((index) => index - 1);
  };

  const handleFinalSubmit = form.handleSubmit((data) => {
    setResult(null);
    startTransition(async () => {
      const formData = buildSellerFormData(data);
      const response = await submitSellerListing(formData);
      setResult(response);
    });
  });

  return (
    <WizardShell
      title={STEP_LABELS[phaseIndex]}
      description={PHASE_DESCRIPTIONS[phaseIndex]}
      onBack={goBack}
      progress={<StepProgress steps={STEP_LABELS} currentIndex={phaseIndex} />}
    >
      <div
        className="flex flex-col gap-8"
        onKeyDown={(e) => {
          const target = e.target as HTMLElement;
          if (e.key === "Enter" && phaseIndex < 3 && target.tagName !== "TEXTAREA") {
            e.preventDefault();
            goNext();
          }
        }}
      >
        <div key={phaseIndex} className="animate-step-in">
          {phaseIndex === 0 && <CategoryPhase form={form} />}
          {phaseIndex === 1 && <DetailsPhase form={form} />}
          {phaseIndex === 2 && <UploadPhase form={form} files={files} onFilesChange={setFiles} />}
          {phaseIndex === 3 && (
            <ReviewPhase
              form={form}
              fileCount={files.length}
              isPending={isPending}
              result={result}
              onSubmit={handleFinalSubmit}
            />
          )}
        </div>

        {phaseIndex < 3 && (
          <button
            type="button"
            onClick={goNext}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(194,65,12,0.35)] transition-all hover:bg-primary-hover"
          >
            Lanjutkan
          </button>
        )}
      </div>
    </WizardShell>
  );
}
