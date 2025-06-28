/*
  Warnings:

  - Made the column `fixed` on table `Envelope` required. This step will fail if there are existing NULL values in that column.
  - Made the column `budget` on table `Envelope` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Envelope" ALTER COLUMN "fixed" SET NOT NULL,
ALTER COLUMN "budget" SET NOT NULL;
