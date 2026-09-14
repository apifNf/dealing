-- CreateTable
CREATE TABLE "buyer_leads" (
    "id" TEXT NOT NULL,
    "budgetRange" TEXT NOT NULL,
    "categoriesOfInterest" TEXT[],
    "contactInfo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buyer_leads_pkey" PRIMARY KEY ("id")
);
