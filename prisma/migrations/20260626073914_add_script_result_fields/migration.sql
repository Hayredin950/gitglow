/*
  Warnings:

  - You are about to drop the column `errorMessage` on the `Polish` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "PolishStatus" ADD VALUE 'READY';

-- AlterTable
ALTER TABLE "Polish" DROP COLUMN "errorMessage",
ADD COLUMN     "executionScript" TEXT,
ADD COLUMN     "scriptResult" JSONB;
