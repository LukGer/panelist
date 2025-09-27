import { handle } from "hono/aws-lambda";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "./auth";
import configureOpenAPI from "./lib/configureOpenApi";
import createApp from "./lib/createApp";
import rssRouter from "./routes/rss";

const app = createApp();

configureOpenAPI(app);

app.use(secureHeaders());

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

const routes = [rssRouter] as const;
type Routes = typeof routes;
export type AppType = Routes[number];

routes.forEach((route) => {
  app.route("/", route);
});

export const handler = handle(app);

export default app;
