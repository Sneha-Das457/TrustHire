/*
  Warnings:

  - Made the column `degree` on table `CandidateEducation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `CandidateEducation` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('SECONDARY', 'HIGHER_SECONDARY', 'DIPLOMA', 'BACHELORS', 'MASTERS', 'DOCTORATE', 'OTHER');

-- AlterTable
ALTER TABLE "CandidateEducation" ADD COLUMN     "certificateName" TEXT,
ADD COLUMN     "certificateUrl" TEXT,
ADD COLUMN     "educationLevel" "EducationLevel" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "grade" TEXT,
ADD COLUMN     "isCurrent" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "degree" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL;
