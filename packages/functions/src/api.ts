import awsLambdaFastify from "@fastify/aws-lambda";
import { createApp } from "./server";

const appPromise = createApp().then((app) => awsLambdaFastify(app));

export const handler = async (event: any, context: any) => {
  const proxy = await appPromise;
  return proxy(event, context);
};

