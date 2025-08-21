import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "./auth-schema";
import * as appSchema from "./schema";

export const db = drizzle(postgres(process.env.DATABASE_URL as string), {
  schema: {
    ...authSchema,
    ...appSchema,
  },
});
