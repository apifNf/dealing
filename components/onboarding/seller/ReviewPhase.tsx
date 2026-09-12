import { Loader2, Send } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { ASSET_CATEGORIES, type SellerFormValues } from "@/lib/validations/onboarding";
import type { OnboardingResult } from "@/app/onboarding/actions";
import { SubmitStatus } from "../shared/SubmitStatus";

type ReviewPhaseProps = {
  form: UseFormReturn<SellerFormValues>;
  fileCount: number;
  isPending: boolean;
  result: OnboardingResult | null;
  onSubmit: () => void;
};

function formatRupiah(value: string | undefined) {
  if (!value) return "-";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? `Rp${parsed.toLocaleString("id-ID")}` : "-";
}

function formatNumber(value: string | undefined) {
  if (!value) return "-";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toLocaleString("id-ID") : "-";
}

export function ReviewPhase({ form, fileCount, isPending, result, onSubmit }: ReviewPhaseProps) {
  const values = form.getValues();
  const category = ASSET_CATEGORIES.find((c) => c.value === values.category);

  const summaryRows: { label: string; value: string }[] = [{ label: "Kategori", value: category?.label ?? "-" }];

  if (values.category === "saas") {
    summaryRows.push(
      { label: "Repository", value: values.repositoryLink || "-" },
      { label: "MRR", value: formatRupiah(values.mrr) },
      { label: "Tech Stack", value: values.techStack || "-" }
    );
  } else if (values.category === "content" || values.category === "website") {
    summaryRows.push({
      label: values.category === "content" ? "Channel URL" : "Website URL",
      value: values.assetUrl || "-",
    });
    if (values.category === "content") {
      summaryRows.push({ label: "Avg. Watch Time", value: values.avgWatchTime || "-" });
    } else {
      summaryRows.push({ label: "Traffic Bulanan", value: formatNumber(values.monthlyTraffic) });
    }
    summaryRows.push({
      label: values.category === "content" ? "AdSense/Sponsorship" : "Revenue Bulanan",
      value: formatRupiah(values.monthlyRevenue),
    });
  }

  summaryRows.push({ label: "Dokumen Terlampir", value: fileCount > 0 ? `${fileCount} file` : "Belum ada" });

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        {summaryRows.map((row, index) => (
          <div
            key={row.label}
            className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${
              index !== summaryRows.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <span className="text-textMuted">{row.label}</span>
            <span className="max-w-[60%] truncate text-right font-medium text-textMain">{row.value}</span>
          </div>
        ))}
      </div>

      {result && <SubmitStatus status={result.status === "success" ? "success" : "error"} message={result.message} />}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(194,65,12,0.35)] transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isPending ? "Mengirim..." : "Kirim Listing"}
      </button>
    </div>
  );
}
