import { FastifyPluginAsync } from "fastify";
import {
    handleIncomingMessage,
    verifyWebhook,
} from "../../controllers/webhook";

const webhookRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", verifyWebhook);
  fastify.post("/", handleIncomingMessage);
};

export default webhookRoutes;
