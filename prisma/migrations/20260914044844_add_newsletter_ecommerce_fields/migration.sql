-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "niche" TEXT,
ADD COLUMN     "openRate" DOUBLE PRECISION,
ADD COLUMN     "platformName" TEXT,
ADD COLUMN     "reasonForSelling" TEXT,
ADD COLUMN     "skuCount" DOUBLE PRECISION,
ADD COLUMN     "storeName" TEXT,
ADD COLUMN     "subscriberCount" DOUBLE PRECISION;
