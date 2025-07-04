import Fastify from "fastify";
import { describe, expect, it } from "vitest";
import webhookRoutes from "./index";

describe("/webhook route", () => {
  it("returns challenge if token valid", async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = "test-token";

    const app = Fastify();
    await app.register(webhookRoutes, { prefix: "/webhook" });

    const res = await app.inject({
      method: "GET",
      url: "/webhook?hub.mode=subscribe&hub.verify_token=test-token&hub.challenge=hello",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("hello");
  });

  it("returns 'No message' on empty post", async () => {
    const app = Fastify();
    await app.register(webhookRoutes, { prefix: "/webhook" });

    const res = await app.inject({
      method: "POST",
      url: "/webhook",
      payload: {},
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("No message");
  });
});
