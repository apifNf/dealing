import type { UseFormReturn } from "react-hook-form";
import type { SellerFormValues } from "@/lib/validations/onboarding";
import { GlassField } from "../shared/fields/GlassField";
import { GlassInput } from "../shared/fields/GlassInput";

type DetailsPhaseProps = {
  form: UseFormReturn<SellerFormValues>;
};

export function DetailsPhase({ form }: DetailsPhaseProps) {
  const { register, watch, formState } = form;
  const category = watch("category");
  const errors = formState.errors;

  if (category === "saas") {
    return (
      <div className="flex flex-col gap-5">
        <GlassField label="Repository Link" htmlFor="repositoryLink" error={errors.repositoryLink?.message}>
          <GlassInput
            id="repositoryLink"
            type="url"
            placeholder="https://github.com/username/repo"
            invalid={!!errors.repositoryLink}
            {...register("repositoryLink")}
          />
        </GlassField>
        <GlassField label="Monthly Recurring Revenue (MRR)" htmlFor="mrr" error={errors.mrr?.message} hint="Dalam Rupiah (IDR)">
          <GlassInput
            id="mrr"
            type="number"
            min={0}
            placeholder="15000000"
            invalid={!!errors.mrr}
            {...register("mrr")}
          />
        </GlassField>
        <GlassField label="Tech Stack" htmlFor="techStack" error={errors.techStack?.message} hint="Contoh: Next.js, PostgreSQL, Stripe">
          <GlassInput
            id="techStack"
            type="text"
            placeholder="Next.js, Supabase, Tailwind"
            invalid={!!errors.techStack}
            {...register("techStack")}
          />
        </GlassField>
      </div>
    );
  }

  if (category === "content" || category === "website") {
    const isContent = category === "content";
    return (
      <div className="flex flex-col gap-5">
        <GlassField label={isContent ? "Channel URL" : "Website URL"} htmlFor="assetUrl" error={errors.assetUrl?.message}>
          <GlassInput
            id="assetUrl"
            type="url"
            placeholder={isContent ? "https://youtube.com/@channel" : "https://example.com"}
            invalid={!!errors.assetUrl}
            {...register("assetUrl")}
          />
        </GlassField>

        {isContent ? (
          <GlassField
            label="Average Watch Time"
            htmlFor="avgWatchTime"
            error={errors.avgWatchTime?.message}
            hint="Contoh: 4:30 (menit:detik)"
          >
            <GlassInput
              id="avgWatchTime"
              type="text"
              placeholder="4:30"
              invalid={!!errors.avgWatchTime}
              {...register("avgWatchTime")}
            />
          </GlassField>
        ) : (
          <GlassField
            label="Rata-rata Traffic Bulanan"
            htmlFor="monthlyTraffic"
            error={errors.monthlyTraffic?.message}
            hint="Jumlah visitor per bulan"
          >
            <GlassInput
              id="monthlyTraffic"
              type="number"
              min={0}
              placeholder="50000"
              invalid={!!errors.monthlyTraffic}
              {...register("monthlyTraffic")}
            />
          </GlassField>
        )}

        <GlassField
          label={isContent ? "Monthly AdSense/Sponsorship" : "Monthly Revenue"}
          htmlFor="monthlyRevenue"
          error={errors.monthlyRevenue?.message}
          hint="Dalam Rupiah (IDR)"
        >
          <GlassInput
            id="monthlyRevenue"
            type="number"
            min={0}
            placeholder="8000000"
            invalid={!!errors.monthlyRevenue}
            {...register("monthlyRevenue")}
          />
        </GlassField>
      </div>
    );
  }

  return <p className="text-sm text-textMuted">Pilih kategori terlebih dahulu untuk melanjutkan.</p>;
}
