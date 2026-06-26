/*
  Warnings:

*/
-- AlterEnum
ALTER TYPE "PolishStatus" ADD VALUE 'READY';

-- AlterTable
ALTER TABLE "Polish"
ADD COLUMN     "executionScript" TEXT,
ADD COLUMN     "scriptResult" JSONB;
