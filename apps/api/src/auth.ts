import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import { getDb } from "../database/config";

export const getAuth = (env: Env) => {
  const db = getDb(env);
  return betterAuth({
    plugins: [expo(), openAPI(), admin()],
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    trustedOrigins: [
      // Basic scheme
      "panelist-app://",
      "panelist-pre://",
      "panelist-dev://",
    ],
  });
};
