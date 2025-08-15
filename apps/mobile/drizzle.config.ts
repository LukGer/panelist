import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./database/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "sqlite://./database/app.db",
  },
  verbose: true,
  strict: true,
});
