-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "notifyByEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyByPhone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyEmail" TEXT,
ADD COLUMN     "notifyPhone" TEXT;
