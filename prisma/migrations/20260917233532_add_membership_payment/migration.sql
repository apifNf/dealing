/*
  Warnings:

  - Added the required column `priceSnapshot` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MembershipPlan" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "MemberPaymentStatus" AS ENUM ('PendingPayment', 'Active', 'Expired');

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "MemberPaymentStatus" NOT NULL DEFAULT 'PendingPayment',
ADD COLUMN     "plan" "MembershipPlan" NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN     "priceSnapshot" INTEGER NOT NULL;
