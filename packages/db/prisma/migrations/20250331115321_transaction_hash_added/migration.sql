/*
  Warnings:

  - Added the required column `transactionHash` to the `Purchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchases" ADD COLUMN     "transactionHash" TEXT NOT NULL;
