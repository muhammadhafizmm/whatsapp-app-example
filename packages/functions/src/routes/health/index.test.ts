import Fastify from "fastify";
import { describe, expect, it } from "vitest";

import healthRoutes from "./index";

describe("/health route", () => {
  it("returns ok status", async () => {
    const app = Fastify();
    await app.register(healthRoutes, { prefix: "/health" });

    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok", service: "whatsapp-webhook-example" });
  });
});
