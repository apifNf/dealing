-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "repositoryLink" TEXT,
    "mrr" DOUBLE PRECISION,
    "techStack" TEXT,
    "assetUrl" TEXT,
    "avgWatchTime" TEXT,
    "monthlyTraffic" DOUBLE PRECISION,
    "monthlyRevenue" DOUBLE PRECISION,
    "fileNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ListingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);
