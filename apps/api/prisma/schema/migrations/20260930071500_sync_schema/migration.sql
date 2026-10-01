-- CreateEnum
CREATE TYPE "ConversionStatus" AS ENUM ('PENDING', 'CONVERTED', 'REJECTED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('CALL', 'WHATSAPP', 'EMAIL', 'IN_PERSON_MEETING', 'OTHER');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ONBOARDING', 'SUSPENDED');

-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_categoryId_fkey";

-- AlterTable
ALTER TABLE "addons" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "taxPercentage" DECIMAL(5,2) NOT NULL DEFAULT 5.00;

-- AlterTable
ALTER TABLE "client_contacts" ADD COLUMN     "designation" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "clientStatus" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "conversionValue" DECIMAL(14,2),
ADD COLUMN     "convertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customClientId" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "googleMapsLink" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- AlterTable
ALTER TABLE "departments" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "requiredServices",
ADD COLUMN     "contactMethod" "ContactMethod",
ADD COLUMN     "conversionStatus" "ConversionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "convertedAt" TIMESTAMP(3),
ADD COLUMN     "customLeadId" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "decisionMakerAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "firstContactDate" TIMESTAMP(3),
ADD COLUMN     "followUpDate" TIMESTAMP(3),
ADD COLUMN     "googleMapsLink" TEXT,
ADD COLUMN     "googleRating" DOUBLE PRECISION,
ADD COLUMN     "googleReviews" INTEGER,
ADD COLUMN     "hasGoogleBusiness" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasWebsite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "instagramFollowers" INTEGER,
ADD COLUMN     "instagramLastPostDate" TIMESTAMP(3),
ADD COLUMN     "instagramPosts" INTEGER,
ADD COLUMN     "instagramScore" INTEGER,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "linkedInUrl" TEXT,
ADD COLUMN     "meetingDate" TIMESTAMP(3),
ADD COLUMN     "proposalSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "proposalValue" DECIMAL(14,2),
ADD COLUMN     "recommendedPackageId" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "researchExecutiveId" TEXT,
ADD COLUMN     "response" TEXT,
ADD COLUMN     "servicesRequired" TEXT,
ADD COLUMN     "socialMediaIssues" TEXT,
ADD COLUMN     "websiteIssues" TEXT,
ADD COLUMN     "websiteScore" INTEGER,
ADD COLUMN     "websiteUrl" TEXT,
ADD COLUMN     "whatsapp" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "proposals" ADD COLUMN     "pdfUrl" TEXT;

-- AlterTable
ALTER TABLE "service_categories" ADD COLUMN     "bgImageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "hasAddons" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "templateHtml" TEXT,
ADD COLUMN     "templatePdfUrl" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "currentMonthBonus" DECIMAL(14,2) DEFAULT 0,
ADD COLUMN     "currentMonthCommission" DECIMAL(14,2) DEFAULT 0,
ADD COLUMN     "currentMonthSales" DECIMAL(14,2) DEFAULT 0,
ADD COLUMN     "currentSlabAssignedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentSlabId" TEXT,
ADD COLUMN     "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "settings" JSONB DEFAULT '{}';

-- CreateTable
CREATE TABLE "commission_slabs" (
    "id" TEXT NOT NULL,
    "slabNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "monthlySalesTarget" DECIMAL(14,2) NOT NULL,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "commissionAtTarget" DECIMAL(14,2) NOT NULL,
    "achievementBonus" DECIMAL(14,2) NOT NULL,
    "basicSalary" DECIMAL(14,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_slabs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_monthly_commission_progress" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "currentSlabId" TEXT,
    "totalAchievedSales" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "slab1Achieved" BOOLEAN NOT NULL DEFAULT false,
    "slab1AchievedAt" TIMESTAMP(3),
    "slab2Achieved" BOOLEAN NOT NULL DEFAULT false,
    "slab2AchievedAt" TIMESTAMP(3),
    "slab3Achieved" BOOLEAN NOT NULL DEFAULT false,
    "slab3AchievedAt" TIMESTAMP(3),
    "earnedCommission" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "earnedBonus" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "basicSalary" DECIMAL(14,2) NOT NULL DEFAULT 1500,
    "totalPayout" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_monthly_commission_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commission_slabs_slabNumber_key" ON "commission_slabs"("slabNumber");

-- CreateIndex
CREATE INDEX "staff_monthly_commission_progress_year_month_idx" ON "staff_monthly_commission_progress"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "staff_monthly_commission_progress_staffId_year_month_key" ON "staff_monthly_commission_progress"("staffId", "year", "month");

-- CreateIndex
CREATE INDEX "addons_categoryId_idx" ON "addons"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_customClientId_key" ON "clients"("customClientId");

-- CreateIndex
CREATE UNIQUE INDEX "leads_customLeadId_key" ON "leads"("customLeadId");

-- CreateIndex
CREATE INDEX "leads_conversionStatus_idx" ON "leads"("conversionStatus");

-- CreateIndex
CREATE INDEX "leads_researchExecutiveId_idx" ON "leads"("researchExecutiveId");

-- AddForeignKey
ALTER TABLE "staff_monthly_commission_progress" ADD CONSTRAINT "staff_monthly_commission_progress_currentSlabId_fkey" FOREIGN KEY ("currentSlabId") REFERENCES "commission_slabs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_monthly_commission_progress" ADD CONSTRAINT "staff_monthly_commission_progress_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_recommendedPackageId_fkey" FOREIGN KEY ("recommendedPackageId") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_researchExecutiveId_fkey" FOREIGN KEY ("researchExecutiveId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addons" ADD CONSTRAINT "addons_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_currentSlabId_fkey" FOREIGN KEY ("currentSlabId") REFERENCES "commission_slabs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
