import { OpenAPIHono } from "@hono/zod-openapi";
import { AuthContext } from "../middleware/auth-middleware";
import { JobContext } from "../middleware/job-middleware";

type AppContext = AuthContext & JobContext;

export const createApp = () => {
  const app = new OpenAPIHono<{
    Variables: AppContext;
  }>();

  return app;
};
