/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "whatsapp-webhook-example",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const { ApiStack } = await import("./infra");
    const { api } = ApiStack();

    return {
      ApiUrl: api.url,
    };
  },
});
