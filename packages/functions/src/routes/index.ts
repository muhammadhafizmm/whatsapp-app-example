import { FastifyInstance } from "fastify";
import healthRoutes from "./health";
import webhookRoutes from "./webhook";

export async function registerAllRoutes(app: FastifyInstance) {
  await app.register(healthRoutes, { prefix: "/health" });
  await app.register(webhookRoutes, { prefix: "/webhook" });
}
