import type { Metadata } from "next";
import { PageBackground } from "@/components/shared/PageBackground";
import { ListingCard } from "@/components/browse/ListingCard";
import { EmptyState } from "@/components/browse/EmptyState";
import { prisma } from "@/lib/prisma";
import { toPublicListing } from "@/lib/browse/publicListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Listings | DEALING",
  description: "Jelajahi aset digital yang sudah diverifikasi dan siap untuk diakuisisi.",
};

export default async function BrowsePage() {
  const listings = await prisma.listing.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  const publicListings = listings.map(toPublicListing);

  return (
    <PageBackground>
      <div className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-6 w-fit rounded-full border border-white/10 bg-surfaceGlass px-5 py-2 text-xs font-medium text-primary backdrop-blur-xl">
              Verified Deal Flow
            </div>
            <h1 className="font-serif text-4xl leading-[1.1] text-white sm:text-5xl">Jelajahi Listing</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-textMuted sm:text-base">
              Aset digital yang sudah melewati kurasi tim DEALING dan siap untuk diakuisisi.
            </p>
          </div>

          {publicListings.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publicListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageBackground>
  );
}
