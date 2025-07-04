import multipart from "@fastify/multipart";
import { FastifyPluginAsync } from "fastify";

export const multipartPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(multipart);
};
