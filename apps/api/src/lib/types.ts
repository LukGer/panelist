import { AuthContext } from "@/middleware/auth-middleware";
import { JobContext } from "@/middleware/job-middleware";
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

export type AppContext = AuthContext & JobContext;

export interface AppBindings {
  Variables: AppContext;
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
