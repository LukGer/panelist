import { Scalar } from "@scalar/hono-api-reference";
import { secureHeaders } from "hono/secure-headers";
import { getAuth } from "./auth";
import rssRouter from "./routers/rss";
import { createApp } from "./utils/createApp";

const app = createApp();

app.use(secureHeaders());

app.get("/scalar", Scalar({ url: "/doc" }));

app.on(["POST", "GET"], "/api/auth/**", (c) =>
  getAuth(c.env).handler(c.req.raw)
);

app.route("/api/rss", rssRouter);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "panelist-api",
  },
});

export default app;
