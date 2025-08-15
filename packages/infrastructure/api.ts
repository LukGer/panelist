import { domain } from "./dns";

export const api = new sst.cloudflare.Worker("api", {
  url: true,
  handler: "./apps/api/src/index.ts",
  domain,
});
