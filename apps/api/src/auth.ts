import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import { Resource } from "sst";
import { db } from "../database/config";

export const auth = betterAuth({
  plugins: [expo(), openAPI(), admin()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      clientId: Resource.Secret.GOOGLE_CLIENT_ID.value,
      clientSecret: Resource.Secret.GOOGLE_CLIENT_SECRET.value,
    },
  },
  trustedOrigins: [
    // Basic scheme
    "panelist-app://",
    "panelist-pre://",
    "panelist-dev://",
  ],
});
