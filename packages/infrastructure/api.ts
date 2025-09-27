import { allSecrets } from "./secret";

export const api = new sst.aws.Function("trpc", {
  url: true,
  handler: "./apps/api/src/index.handler",
  link: [...allSecrets],
});
