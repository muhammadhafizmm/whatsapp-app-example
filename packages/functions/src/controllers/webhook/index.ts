import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyWebhook(req: FastifyRequest, reply: FastifyReply) {
  const query = req.query as any;
  req.log.info("Webhook verification query", query);

  if (
    query["hub.mode"] === "subscribe" &&
    query["hub.verify_token"] === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return reply.send(query["hub.challenge"]);
  }

  return reply.code(403).send("Verification failed");
}

export async function handleIncomingMessage(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const body = req.body as any;

  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const phoneNumberId =
    body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;

  if (!message || !phoneNumberId) {
    req.log.warn("No message or phone_number_id found");
    return reply.send("No message");
  }

  const from = message.from;
  const text = message.text?.body;

  req.log.info(`Incoming message from ${from}: ${text}`);

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: `Terima kasih! Anda mengirim: "${text}"` },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      req.log.error("Failed to send message to WhatsApp:", error);
      return reply.status(500).send("Failed to send message");
    }

    req.log.info("Message sent successfully to WhatsApp");
    return reply.send("Message processed");
  } catch (err) {
    req.log.error(err, "Error processing message");
    return reply.status(500).send("Internal server error");
  }
}
