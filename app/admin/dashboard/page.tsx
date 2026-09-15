import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ListingsTable } from "@/components/admin/ListingsTable";
import { MembersTable } from "@/components/admin/MembersTable";
import { PageBackground } from "@/components/shared/PageBackground";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | DEALING",
};

export default async function AdminDashboardPage() {
  const [listings, members] = await Promise.all([
    prisma.listing.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.member.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <PageBackground>
      <div className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="font-serif text-3xl text-white sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-textMuted">Tinjau dan kelola listing yang masuk dari Seller Wizard.</p>
          </div>
          <ListingsTable listings={listings} />

          <div className="mb-10 mt-16">
            <h2 className="font-serif text-2xl text-white sm:text-3xl">Aplikasi Membership</h2>
            <p className="mt-2 text-sm text-textMuted">Tinjau dan kelola aplikasi membership yang masuk.</p>
          </div>
          <MembersTable members={members} />
        </div>
      </div>
    </PageBackground>
  );
}
