import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, isCurrentAdmin } from "@/lib/currentUser";
import { resolveChatAccess } from "@/lib/chat/access";
import { ASSET_CATEGORIES } from "@/lib/validations/onboarding";
import { PageBackground } from "@/components/shared/PageBackground";
import { ChatRoomView } from "@/components/chat/ChatRoomView";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chat Room | DEALING",
};

type ChatRoomPageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { roomId } = await params;

  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    include: {
      listing: true,
      buyer: { select: { id: true, email: true } },
      seller: { select: { id: true, email: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!room) notFound();

  const [userId, isAdmin] = await Promise.all([getCurrentUserId(), isCurrentAdmin()]);
  const access = resolveChatAccess(room, { userId, isAdmin });

  if (!access) {
    return (
      <PageBackground mainClassName="flex items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-white/10 bg-surfaceGlass p-10 text-center backdrop-blur-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-xl text-white">Akses Ditolak</h1>
          <p className="text-sm text-textMuted">
            Anda tidak memiliki akses ke chat room ini. Hanya buyer, seller yang bersangkutan, dan admin yang bisa
            membukanya.
          </p>
        </div>
      </PageBackground>
    );
  }

  const categoryLabel = ASSET_CATEGORIES.find((c) => c.value === room.listing.category)?.label ?? room.listing.category;
  const counterpartEmail = access === "buyer" ? room.seller.email : access === "seller" ? room.buyer.email : null;

  return (
    <PageBackground>
      <ChatRoomView
        roomId={room.id}
        status={room.status}
        role={access}
        categoryLabel={categoryLabel}
        counterpartEmail={counterpartEmail}
        buyerEmail={room.buyer.email}
        sellerEmail={room.seller.email}
        buyerUserId={room.buyer.id}
        sellerUserId={room.seller.id}
        initialMessages={room.messages.map((m) => ({
          id: m.id,
          content: m.content,
          senderUserId: m.senderUserId,
          createdAt: m.createdAt.toISOString(),
          flagged: m.flagged,
        }))}
        currentUserId={userId}
      />
    </PageBackground>
  );
}
