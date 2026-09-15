import Link from "next/link";
import { ArrowUpRight, Code2, Globe, Mail, ShoppingBag, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PublicListing } from "@/lib/browse/publicListing";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  content: Video,
  website: Globe,
  saas: Code2,
  newsletter: Mail,
  ecommerce: ShoppingBag,
};

export function ListingCard({ listing }: { listing: PublicListing }) {
  const Icon = CATEGORY_ICONS[listing.category] ?? Code2;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-surfaceGlass p-8 backdrop-blur-2xl transition-all duration-500 hover:border-primary/40 hover:bg-white/[0.05]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          {listing.revenueRange && (
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs font-medium text-textMain">
              {listing.revenueRange}/bln
            </span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{listing.categoryLabel}</h3>
          <p className="mt-2 text-sm leading-relaxed text-textMuted">{listing.detail}</p>
        </div>
      </div>
      <Link
        href="/onboarding?intent=buy"
        className="relative mt-6 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] py-3 text-sm font-semibold text-white transition-all hover:border-primary/50 hover:bg-primary/10"
      >
        Saya Tertarik
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
