-- CreateTable
CREATE TABLE "match_notifications" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "buyerLeadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "match_notifications_listingId_buyerLeadId_key" ON "match_notifications"("listingId", "buyerLeadId");
