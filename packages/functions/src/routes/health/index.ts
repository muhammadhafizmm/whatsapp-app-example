import { FastifyPluginAsync } from "fastify";

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async () => ({
    status: "ok",
    service: "whatsapp-webhook-example",
  }));
};

export default healthRoutes;
