export function ApiStack() {
  const api = new sst.aws.ApiGatewayV2("ApiGateway", {
    domain: {
      name: "whatsapp-webhook-example.ze9d4p.com",
      dns: sst.aws.dns({
        zone: "Z00775033ROEXONBADCX9",
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
