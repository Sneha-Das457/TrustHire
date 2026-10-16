/*
  Warnings:

  - You are about to drop the column `approvedDomain` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[domain]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Company_approvedDomain_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "approvedDomain",
ADD COLUMN     "domain" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Company_domain_key" ON "Company"("domain");
