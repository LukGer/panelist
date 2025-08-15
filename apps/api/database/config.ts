import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "./auth-schema";
import * as appSchema from "./schema";

const client = postgres(process.env.DATABASE_URL as string, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, {
  schema: {
    ...authSchema,
    ...appSchema,
  },
});
