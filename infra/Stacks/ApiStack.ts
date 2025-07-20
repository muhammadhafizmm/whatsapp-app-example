/// <reference path="../../sst.config.ts" />

export function ApiStack() {
  const api = new sst.aws.ApiGatewayV2("ApiGateway", {
    domain: {
      name: "whatsapp-webhook-example.com", // Replace with your domain
      dns: sst.aws.dns({
        zone: "ZXXXXXXXXXXXXXXX", // Replace with your hosted zone ID
      }),
    },
  });

  const handler = new sst.aws.Function("ApiHandler", {
    url: true,
    handler: "packages/functions/src/api.handler",
    environment: {
      WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN!,
      WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN!,
    },
    logging: {
      format: "json",
      retention: "1 week",
    },
  });

  api.route("ANY /{proxy+}", handler.arn);

  return { api };
}
