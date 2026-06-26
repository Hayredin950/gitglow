-- AlterTable
ALTER TABLE "Polish" ADD COLUMN IF NOT EXISTS "scriptResult" JSONB;
ALTER TABLE "Polish" ADD COLUMN IF NOT EXISTS "executionScript" TEXT;
