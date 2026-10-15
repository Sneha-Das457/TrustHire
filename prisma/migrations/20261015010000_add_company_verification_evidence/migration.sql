-- AlterTable
ALTER TABLE "Company"
  ADD COLUMN "country" TEXT,
  ADD COLUMN "dnsVerificationToken" TEXT,
  ADD COLUMN "dnsVerifiedAt" TIMESTAMP(3),
  ADD COLUMN "registrationNumber" TEXT,
  ADD COLUMN "registryVerifiedAt" TIMESTAMP(3);
