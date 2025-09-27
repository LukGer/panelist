import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
  schema: ["./database/schema.ts", "./database/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: Resource.Secret.DatabaseUrl.value,
  },
  verbose: true,
  strict: true,
});
