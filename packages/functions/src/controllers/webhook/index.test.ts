import { FastifyReply } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleIncomingMessage, verifyWebhook } from "./index";

const createMockReply = () =>
  ({
    code: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    log: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  } as unknown as FastifyReply);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("verifyWebhook", () => {
  it("returns challenge when token matches", async () => {
    const req = {
      query: {
        "hub.mode": "subscribe",
        "hub.verify_token": "valid-token",
        "hub.challenge": "test-challenge",
      },
      log: { info: vi.fn() },
    } as any;

    process.env.WHATSAPP_VERIFY_TOKEN = "valid-token";
    const reply = createMockReply();

    await verifyWebhook(req, reply);

    expect(reply.send).toHaveBeenCalledWith("test-challenge");
  });

  it("returns 403 when token mismatches", async () => {
    const req = {
      query: {
        "hub.mode": "subscribe",
        "hub.verify_token": "wrong-token",
        "hub.challenge": "challenge",
      },
      log: { info: vi.fn() },
    } as any;

    process.env.WHATSAPP_VERIFY_TOKEN = "valid-token";
    const reply = createMockReply();

    await verifyWebhook(req, reply);

    expect(reply.code).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith("Verification failed");
  });
});

describe("handleIncomingMessage", () => {
  const baseReq = {
    log: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  };

  it("skips when no message is found", async () => {
    const req = { ...baseReq, body: {} } as any;
    const reply = createMockReply();

    await handleIncomingMessage(req, reply);

    expect(baseReq.log.warn).toHaveBeenCalledWith(
      "No message or phone_number_id found"
    );
    expect(reply.send).toHaveBeenCalledWith("No message");
  });

  it("sends message successfully to WhatsApp", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, text: () => Promise.resolve("ok") })
    );
    globalThis.fetch = fetchMock as any;

    const req = {
      ...baseReq,
      body: {
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [{ from: "123", text: { body: "hello" } }],
                  metadata: { phone_number_id: "456" },
                },
              },
            ],
          },
        ],
      },
    } as any;

    const reply = createMockReply();
    process.env.WHATSAPP_ACCESS_TOKEN = "dummy-token";

    await handleIncomingMessage(req, reply);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://graph.facebook.com/v19.0/456/messages",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: `Bearer dummy-token`,
        }),
        body: expect.stringContaining("hello"),
      })
    );

    expect(reply.send).toHaveBeenCalledWith("Message processed");
    expect(req.log.info).toHaveBeenCalledWith(
      "Message sent successfully to WhatsApp"
    );
  });

  it("returns 500 if WhatsApp API responds with failure", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve("Invalid token"),
      })
    );
    globalThis.fetch = fetchMock as any;

    const req = {
      ...baseReq,
      body: {
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [{ from: "123", text: { body: "hello" } }],
                  metadata: { phone_number_id: "456" },
                },
              },
            ],
          },
        ],
      },
    } as any;

    const reply = createMockReply();

    await handleIncomingMessage(req, reply);

    expect(req.log.error).toHaveBeenCalledWith(
      "Failed to send message to WhatsApp:",
      "Invalid token"
    );
    expect(reply.status).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith("Failed to send message");
  });

  it("returns 500 on internal error (e.g. fetch throws)", async () => {
    const fetchMock = vi.fn(() => {
      throw new Error("Network error");
    });
    globalThis.fetch = fetchMock as any;

    const req = {
      ...baseReq,
      body: {
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [{ from: "123", text: { body: "hello" } }],
                  metadata: { phone_number_id: "456" },
                },
              },
            ],
          },
        ],
      },
    } as any;

    const reply = createMockReply();

    await handleIncomingMessage(req, reply);

    expect(req.log.error).toHaveBeenCalledWith(
      expect.any(Error),
      "Error processing message"
    );
    expect(reply.status).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith("Internal server error");
  });
});
