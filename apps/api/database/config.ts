import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Resource } from "sst";
import * as authSchema from "./auth-schema";
import * as appSchema from "./schema";

export const db = drizzle(postgres(Resource.Secret.DatabaseUrl.value), {
  schema: {
    ...authSchema,
    ...appSchema,
  },
});
