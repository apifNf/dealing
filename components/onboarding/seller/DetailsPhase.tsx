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

  if (category === "newsletter") {
    return (
      <div className="flex flex-col gap-5">
        <GlassField
          label="Nama Platform"
          htmlFor="platformName"
          error={errors.platformName?.message}
          hint="Substack, Beehiiv, ConvertKit, dll"
        >
          <GlassInput
            id="platformName"
            type="text"
            placeholder="Substack"
            invalid={!!errors.platformName}
            {...register("platformName")}
          />
        </GlassField>
        <GlassField label="Jumlah Subscriber" htmlFor="subscriberCount" error={errors.subscriberCount?.message}>
          <GlassInput
            id="subscriberCount"
            type="number"
            min={0}
            placeholder="12000"
            invalid={!!errors.subscriberCount}
            {...register("subscriberCount")}
          />
        </GlassField>
        <GlassField
          label="Rata-rata Open Rate"
          htmlFor="openRate"
          error={errors.openRate?.message}
          hint="Dalam persen, contoh: 45"
        >
          <GlassInput
            id="openRate"
            type="number"
            min={0}
            max={100}
            placeholder="45"
            invalid={!!errors.openRate}
            {...register("openRate")}
          />
        </GlassField>
        <GlassField label="Niche / Topik" htmlFor="niche" error={errors.niche?.message} hint="Contoh: Personal finance, tech, marketing">
          <GlassInput id="niche" type="text" placeholder="Personal finance" invalid={!!errors.niche} {...register("niche")} />
        </GlassField>
        <GlassField
          label="Monthly Recurring Revenue (MRR)"
          htmlFor="mrr"
          error={errors.mrr?.message}
          hint="Opsional — kosongkan kalau belum monetisasi. Dalam Rupiah (IDR)"
        >
          <GlassInput id="mrr" type="number" min={0} placeholder="5000000" invalid={!!errors.mrr} {...register("mrr")} />
        </GlassField>
        <GlassField label="Alasan Jual" htmlFor="reasonForSelling" error={errors.reasonForSelling?.message}>
          <GlassInput
            id="reasonForSelling"
            type="text"
            placeholder="Fokus ke proyek baru"
            invalid={!!errors.reasonForSelling}
            {...register("reasonForSelling")}
          />
        </GlassField>
      </div>
    );
  }

  if (category === "ecommerce") {
    return (
      <div className="flex flex-col gap-5">
        <GlassField label="Nama Toko" htmlFor="storeName" error={errors.storeName?.message}>
          <GlassInput
            id="storeName"
            type="text"
            placeholder="Nama brand/toko Anda"
            invalid={!!errors.storeName}
            {...register("storeName")}
          />
        </GlassField>
        <GlassField
          label="Platform"
          htmlFor="platformName"
          error={errors.platformName?.message}
          hint="Shopify, WooCommerce, Tokopedia, dll"
        >
          <GlassInput
            id="platformName"
            type="text"
            placeholder="Shopify"
            invalid={!!errors.platformName}
            {...register("platformName")}
          />
        </GlassField>
        <GlassField label="Revenue Bulanan" htmlFor="monthlyRevenue" error={errors.monthlyRevenue?.message} hint="Dalam Rupiah (IDR)">
          <GlassInput
            id="monthlyRevenue"
            type="number"
            min={0}
            placeholder="30000000"
            invalid={!!errors.monthlyRevenue}
            {...register("monthlyRevenue")}
          />
        </GlassField>
        <GlassField label="Jumlah SKU / Produk" htmlFor="skuCount" error={errors.skuCount?.message}>
          <GlassInput
            id="skuCount"
            type="number"
            min={0}
            placeholder="25"
            invalid={!!errors.skuCount}
            {...register("skuCount")}
          />
        </GlassField>
        <GlassField label="Traffic Bulanan" htmlFor="monthlyTraffic" error={errors.monthlyTraffic?.message} hint="Jumlah visitor per bulan">
          <GlassInput
            id="monthlyTraffic"
            type="number"
            min={0}
            placeholder="20000"
            invalid={!!errors.monthlyTraffic}
            {...register("monthlyTraffic")}
          />
        </GlassField>
        <GlassField label="Alasan Jual" htmlFor="reasonForSelling" error={errors.reasonForSelling?.message}>
          <GlassInput
            id="reasonForSelling"
            type="text"
            placeholder="Ingin fokus ke bisnis lain"
            invalid={!!errors.reasonForSelling}
            {...register("reasonForSelling")}
          />
        </GlassField>
      </div>
    );
  }

  return <p className="text-sm text-textMuted">Pilih kategori terlebih dahulu untuk melanjutkan.</p>;
}
