import type { Metadata } from "next";
import { PageBackground } from "@/components/shared/PageBackground";
import { ListingCard } from "@/components/browse/ListingCard";
import { EmptyState } from "@/components/browse/EmptyState";
import { ActiveFilter } from "@/components/browse/ActiveFilter";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/currentUser";
import { toPublicListing } from "@/lib/browse/publicListing";
import { ASSET_CATEGORIES, assetCategoryEnum, type AssetCategory } from "@/lib/validations/onboarding";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Listings | DEALING",
  description: "Jelajahi aset digital yang sudah diverifikasi dan siap untuk diakuisisi.",
};

type BrowsePageProps = {
  searchParams: Promise<{ categories?: string }>;
};

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { categories } = await searchParams;
  const requested = categories ? categories.split(",").map((value) => value.trim()) : [];
  const activeCategories = requested.filter(
    (value) => assetCategoryEnum.safeParse(value).success
  ) as AssetCategory[];

  const listings = await prisma.listing.findMany({
    where: {
      status: "APPROVED",
      ...(activeCategories.length > 0 ? { category: { in: activeCategories } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const publicListings = listings.map(toPublicListing);
  const isLoggedIn = (await getCurrentUserId()) !== null;
  const activeLabels = activeCategories.map(
    (value) => ASSET_CATEGORIES.find((category) => category.value === value)?.label ?? value
  );

  return (
    <PageBackground>
      <div className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 w-fit rounded-full border border-white/10 bg-surfaceGlass px-5 py-2 text-xs font-medium text-primary backdrop-blur-2xl">
              Listing Melalui Review Admin
            </div>
            <h1 className="font-serif text-4xl leading-[1.1] text-white sm:text-5xl">Jelajahi Listing</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-textMuted sm:text-base">
              Setiap listing di sini sudah melalui proses review admin sebelum tayang — bukan listing bebas
              tanpa verifikasi seperti marketplace pada umumnya.
            </p>
          </div>

          <ActiveFilter labels={activeLabels} />

          {publicListings.length === 0 ? (
            <EmptyState filtered={activeCategories.length > 0} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publicListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageBackground>
  );
}
