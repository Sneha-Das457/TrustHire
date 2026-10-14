-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CompanyMemberVerificationStatus" AS ENUM ('PENDING', 'EMAIL_VERIFIED', 'APPROVED', 'REVOKED');

-- DropForeignKey
ALTER TABLE "CompanyInvitation" DROP CONSTRAINT "CompanyInvitation_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyInvitation" DROP CONSTRAINT "CompanyInvitation_companyMemberId_fkey";

-- AlterTable
ALTER TABLE "Company"
  DROP COLUMN "externalId",
  DROP COLUMN "source",
  ADD COLUMN "approvedDomain" TEXT,
  ADD COLUMN "status" "CompanyStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "CompanyMember"
  ADD COLUMN "approvedAt" TIMESTAMP(3),
  ADD COLUMN "revokedAt" TIMESTAMP(3),
  ADD COLUMN "verificationStatus" "CompanyMemberVerificationStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "workEmailVerifiedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "CompanyInvitation";

-- DropEnum
DROP TYPE "InvitationStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Company_approvedDomain_key" ON "Company"("approvedDomain");

-- CreateIndex
CREATE INDEX "CompanyMember_companyId_verificationStatus_idx" ON "CompanyMember"("companyId", "verificationStatus");
