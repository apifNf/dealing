export type ChatRoomAccess = "buyer" | "seller" | "admin" | null;

export type ChatIdentity = { userId: string | null; isAdmin: boolean };

export type ChatRoomParticipants = {
  buyerUserId: string;
  sellerUserId: string;
};

/**
 * Pure authorization decision, shared by the /chat/[roomId] page (via
 * next/headers cookies) and the WebSocket upgrade handler in server.ts (via
 * raw cookie parsing) — kept dependency-free so both can use the exact same
 * logic without duplicating it.
 */
export function resolveChatAccess(room: ChatRoomParticipants, identity: ChatIdentity): ChatRoomAccess {
  if (identity.isAdmin) return "admin";
  if (identity.userId && identity.userId === room.buyerUserId) return "buyer";
  if (identity.userId && identity.userId === room.sellerUserId) return "seller";
  return null;
}
