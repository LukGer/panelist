/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "panelist",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "cloudflare",
    };
  },
  async run() {
    const { domain, zone } = await import("./packages/infrastructure/dns");
    const { api } = await import("./packages/infrastructure/api");
    const { secret } = await import("./packages/infrastructure/secret");

    return {
      domain,
      zone,
      api,
      secret,
    };
  },
});
