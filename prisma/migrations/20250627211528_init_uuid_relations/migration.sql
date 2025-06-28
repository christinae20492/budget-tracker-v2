/*
  Warnings:

  - The primary key for the `Envelope` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expenses` on the `Envelope` table. All the data in the column will be lost.
  - The primary key for the `Expense` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `envelope` on the `Expense` table. All the data in the column will be lost.
  - The primary key for the `Income` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Note` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Envelope` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `envelopeId` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Expense` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Income` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Note` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Envelope" DROP CONSTRAINT "Envelope_pkey",
DROP COLUMN "expenses",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Envelope_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_pkey",
DROP COLUMN "envelope",
ADD COLUMN     "envelopeId" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Expense_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Income" DROP CONSTRAINT "Income_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Income_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Note" DROP CONSTRAINT "Note_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Note_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Envelope_userId_idx" ON "Envelope"("userId");

-- CreateIndex
CREATE INDEX "Expense_envelopeId_idx" ON "Expense"("envelopeId");

-- CreateIndex
CREATE INDEX "Expense_userId_idx" ON "Expense"("userId");

-- CreateIndex
CREATE INDEX "Income_userId_idx" ON "Income"("userId");

-- CreateIndex
CREATE INDEX "Note_userId_idx" ON "Note"("userId");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_envelopeId_fkey" FOREIGN KEY ("envelopeId") REFERENCES "Envelope"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
