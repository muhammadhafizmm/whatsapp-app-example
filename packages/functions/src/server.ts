import Fastify from "fastify";
import { errorHandlerPlugin } from "./plugins/error-handler";
import { multipartPlugin } from "./plugins/multipart";
import { registerAllRoutes } from "./routes";

export async function createApp() {
  const fastify = Fastify({ logger: true });

  // Register plugins
  await fastify.register(multipartPlugin);
  await fastify.register(errorHandlerPlugin);

  // Register routes
  await registerAllRoutes(fastify);

  return fastify;
}
