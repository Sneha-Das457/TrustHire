/*
  Warnings:

  - The values [EMPLOYEE,RECRUITER,COMPANY_ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `jobTitle` on the `CandidateExperience` table. All the data in the column will be lost.
  - Added the required column `position` to the `CandidateExperience` table without a default value. This is not possible if the table is not empty.
  - Made the column `headline` on table `candidate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `candidate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `resumeUrl` on table `candidate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('DEFAULT_USER', 'CANDIDATE');
ALTER TABLE "public"."user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'DEFAULT_USER';
COMMIT;

-- AlterTable
ALTER TABLE "CandidateExperience" DROP COLUMN "jobTitle",
ADD COLUMN     "position" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "candidate" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "headline" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "resumeUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'DEFAULT_USER';
