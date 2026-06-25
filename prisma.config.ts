import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Load env files in priority order — Next.js uses .env.development.local in dev
config({ path: ".env.development.local" });
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
