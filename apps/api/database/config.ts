import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "./auth-schema";
import * as appSchema from "./schema";

export const getDb = (env: Env) => {
  return drizzle(postgres(env.DATABASE_URL), {
    schema: {
      ...authSchema,
      ...appSchema,
    },
  });
};
