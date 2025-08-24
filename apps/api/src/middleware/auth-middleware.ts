import { env } from "cloudflare:workers";
import { Context, Next } from "hono";
import { getAuth } from "../auth";

export type AuthContext = {
  user: Awaited<ReturnType<typeof getAuth>>["$Infer"]["Session"]["user"] | null;
  session:
    | Awaited<ReturnType<typeof getAuth>>["$Infer"]["Session"]["session"]
    | null;
};

export const authenticate = async (c: Context, next: Next) => {
  const auth = getAuth(c.env);
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);

  await next();
};

export const authenticateApiKey = async (c: Context, next: Next) => {
  const apiKey = c.req.header("X-API-Key");

  if (!apiKey) {
    return c.json({ error: "API key required" }, 401);
  }

  // Check against environment variable
  const validApiKey = env.CRON_API_KEY;

  if (!validApiKey || apiKey !== validApiKey) {
    return c.json({ error: "Invalid API key" }, 401);
  }

  // Set a special user context for API key requests
  c.set("user", { id: "cron-job", type: "api-key" });
  c.set("session", null);

  await next();
};
