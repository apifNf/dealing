import { z } from "zod";
import { isValidContactInfo } from "./contact";

export const ASSET_CATEGORIES = [
  {
    value: "content",
    label: "Content Account",
    description: "Akun YouTube, TikTok, Instagram, atau platform konten lainnya.",
  },
  {
    value: "website",
    label: "Website / Media",
    description: "Blog, portal berita, atau situs media dengan traffic organik.",
  },
  {
    value: "saas",
    label: "SaaS / Micro-Tools",
    description: "Aplikasi berlangganan, tools, atau produk digital berbasis kode.",
  },
  {
    value: "newsletter",
    label: "Newsletter & Komunitas",
    description: "Publikasi Substack/Beehiiv, grup premium, atau komunitas berbayar.",
  },
  {
    value: "ecommerce",
    label: "E-Commerce & Toko Digital",
    description: "Toko marketplace, penjualan produk digital, atau brand D2C.",
  },
] as const;

export const assetCategoryEnum = z.enum(["content", "website", "saas", "newsletter", "ecommerce"]);
export type AssetCategory = z.infer<typeof assetCategoryEnum>;

export const BUDGET_RANGES = [
  { value: "10-50", label: "Rp10 Juta - Rp50 Juta" },
  { value: "50-100", label: "Rp50 Juta - Rp100 Juta" },
  { value: "100-500", label: "Rp100 Juta - Rp500 Juta" },
  { value: "500-1000", label: "Rp500 Juta - Rp1 Miliar" },
  { value: "1000-plus", label: "> Rp1 Miliar" },
] as const;

export const budgetRangeEnum = z.enum(["10-50", "50-100", "100-500", "500-1000", "1000-plus"], {
  error: "Pilih rentang budget untuk melanjutkan",
});
export type BudgetRange = z.infer<typeof budgetRangeEnum>;

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isValidNonNegativeNumber(value: string | undefined) {
  if (!value || value.trim().length === 0) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0;
}

/**
 * Seller schema kept flat (rather than a discriminated union) so React Hook
 * Form can call `trigger()` on a per-phase subset of fields while the other
 * category's fields stay untouched. Requiredness is enforced in superRefine.
 * Numeric fields stay as strings here (input === output) so the zod
 * input/output types line up 1:1 for `useForm` + `zodResolver` — they're
 * converted to numbers only at display/submit time.
 */
export const sellerSchema = z
  .object({
    category: assetCategoryEnum,
    // Phase 2 — SaaS / Micro-Tools
    repositoryLink: z.string().optional(),
    mrr: z.string().optional(),
    techStack: z.string().optional(),
    // Phase 2 — Content Account / Website / Media
    assetUrl: z.string().optional(),
    avgWatchTime: z.string().optional(),
    monthlyTraffic: z.string().optional(),
    monthlyRevenue: z.string().optional(),
    // Phase 2 — Newsletter & Komunitas
    platformName: z.string().optional(),
    subscriberCount: z.string().optional(),
    openRate: z.string().optional(),
    niche: z.string().optional(),
    // Phase 2 — E-Commerce & Toko Digital
    storeName: z.string().optional(),
    skuCount: z.string().optional(),
    // Phase 2 — Newsletter & E-Commerce share this
    reasonForSelling: z.string().optional(),
    // Phase 3 — analytics screenshots (names only, UI placeholder)
    fileNames: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    const requireText = (
      value: string | undefined,
      field: "repositoryLink" | "techStack" | "assetUrl" | "avgWatchTime" | "platformName" | "niche" | "storeName" | "reasonForSelling",
      message: string
    ) => {
      if (!value || value.trim().length === 0) {
        ctx.addIssue({ code: "custom", message, path: [field] });
      }
    };
    const requireNumericText = (
      value: string | undefined,
      field: "mrr" | "monthlyTraffic" | "monthlyRevenue" | "subscriberCount" | "openRate" | "skuCount",
      message: string
    ) => {
      if (!isValidNonNegativeNumber(value)) {
        ctx.addIssue({ code: "custom", message, path: [field] });
      }
    };

    if (data.category === "saas") {
      requireText(data.repositoryLink, "repositoryLink", "Repository link wajib diisi");
      if (data.repositoryLink && !isValidUrl(data.repositoryLink)) {
        ctx.addIssue({ code: "custom", message: "Masukkan URL repository yang valid", path: ["repositoryLink"] });
      }
      requireNumericText(data.mrr, "mrr", "MRR wajib diisi dengan angka yang valid");
      requireText(data.techStack, "techStack", "Tech stack wajib diisi");
    }

    if (data.category === "content" || data.category === "website") {
      requireText(
        data.assetUrl,
        "assetUrl",
        data.category === "content" ? "Channel URL wajib diisi" : "Website URL wajib diisi"
      );
      if (data.assetUrl && !isValidUrl(data.assetUrl)) {
        ctx.addIssue({ code: "custom", message: "Masukkan URL yang valid", path: ["assetUrl"] });
      }
      requireNumericText(
        data.monthlyRevenue,
        "monthlyRevenue",
        data.category === "content" ? "Pendapatan AdSense/Sponsorship wajib diisi" : "Pendapatan bulanan wajib diisi"
      );
    }

    if (data.category === "content") {
      requireText(data.avgWatchTime, "avgWatchTime", "Rata-rata watch time wajib diisi");
    }

    if (data.category === "website") {
      requireNumericText(data.monthlyTraffic, "monthlyTraffic", "Traffic bulanan wajib diisi dengan angka yang valid");
    }

    if (data.category === "newsletter") {
      requireText(data.platformName, "platformName", "Nama platform wajib diisi");
      requireNumericText(data.subscriberCount, "subscriberCount", "Jumlah subscriber wajib diisi dengan angka yang valid");
      requireNumericText(data.openRate, "openRate", "Rata-rata open rate wajib diisi dengan angka yang valid");
      requireText(data.niche, "niche", "Niche/topik wajib diisi");
      requireText(data.reasonForSelling, "reasonForSelling", "Alasan jual wajib diisi");
    }

    if (data.category === "ecommerce") {
      requireText(data.storeName, "storeName", "Nama toko wajib diisi");
      requireText(data.platformName, "platformName", "Platform wajib diisi");
      requireNumericText(data.monthlyRevenue, "monthlyRevenue", "Revenue bulanan wajib diisi dengan angka yang valid");
      requireNumericText(data.skuCount, "skuCount", "Jumlah SKU/produk wajib diisi dengan angka yang valid");
      requireNumericText(data.monthlyTraffic, "monthlyTraffic", "Traffic bulanan wajib diisi dengan angka yang valid");
      requireText(data.reasonForSelling, "reasonForSelling", "Alasan jual wajib diisi");
    }
  });

export type SellerFormValues = z.infer<typeof sellerSchema>;

export const SELLER_STEP_FIELDS = {
  category: ["category"],
  details: [
    "repositoryLink",
    "mrr",
    "techStack",
    "assetUrl",
    "avgWatchTime",
    "monthlyTraffic",
    "monthlyRevenue",
    "platformName",
    "subscriberCount",
    "openRate",
    "niche",
    "storeName",
    "skuCount",
    "reasonForSelling",
  ],
  upload: ["fileNames"],
} as const satisfies Record<string, (keyof SellerFormValues)[]>;

export const buyerSchema = z
  .object({
    budgetRange: budgetRangeEnum,
    categoriesOfInterest: z.array(assetCategoryEnum).min(1, "Pilih minimal satu kategori yang diminati"),
    contactInfo: z.string().min(5, "Masukkan email atau nomor WA/Telegram Anda"),
  })
  .superRefine((data, ctx) => {
    if (!isValidContactInfo(data.contactInfo)) {
      ctx.addIssue({
        code: "custom",
        message: "Masukkan email atau nomor WA/Telegram yang valid",
        path: ["contactInfo"],
      });
    }
  });

export type BuyerFormValues = z.infer<typeof buyerSchema>;
