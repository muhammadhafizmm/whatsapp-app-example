# whatsapp-app-example – WhatsApp Chatbot API Starter (SST v3 + Fastify)

A modern starter template for building WhatsApp chatbot APIs using:

- ✅ **Fastify** as the web framework (modular, testable)
- ✅ **SST v3** for infrastructure as code and deployment
- ✅ **AWS Lambda** + API Gateway
- ✅ **Webhook-ready** for WhatsApp Business Cloud API
- ✅ **Vitest** for unit/integration testing
- ✅ **Monorepo** structure with workspaces

> Built for scalability, maintainability, and production readiness.

---

## 🚀 Getting Started

1. **Create repo from this template**  
   [Use this template](https://github.com/muhammadhafizmm/whatsapp-app-example/generate)

2. **Clone & install dependencies**

   ```bash
   git clone <YOUR_REPO_URL> whatsapp-app-example
   cd whatsapp-app-example
   npm install
   ```

3. **Start local development**

   ```bash
   npx sst dev
   ```

4. **Deploy to AWS**

   ```bash
   npx sst deploy
   ```

---

## 📦 Project Structure

```txt
.
├── infra/                   # Infrastructure (SST v3)
│   └── stacks/
│       └── ApiStack.ts     # Defines API Gateway + Lambda
├── packages/
│   └── functions/          # Fastify Lambda backend
│       └── src/
│           ├── api.handler.ts      # Lambda entry
│           ├── server.ts           # Fastify app
│           ├── routes/             # Modular route definitions
│           ├── controllers/        # Webhook logic
│           └── plugins/            # Fastify plugins
├── sst.config.ts           # SST config file
├── vitest.config.ts        # Vitest coverage config
└── package.json
```

---

## 🧠 Features

- **📬 WhatsApp Webhook Handler**  
  Handles `GET` verification + `POST` message receiving from WhatsApp Business API

- **⚡️ Fastify Routing**  
  Modular & testable routes + controllers with plugin system

- **🧪 Full Testing Support**  
  Using `vitest` for unit + integration tests (with `fetch` mocks)

- **🌐 Custom Domain Ready**  
  Easily connect your domain via Route53 + API Gateway

---

## ✅ Endpoints

| Method | Path        | Description                             |
|--------|-------------|-----------------------------------------|
| GET    | `/webhook`  | WhatsApp token verification handler     |
| POST   | `/webhook`  | Handles incoming WhatsApp messages      |
| GET    | `/health`   | Simple health check                     |

---

## 🧪 Testing

```bash
npm run test
```

Test files are colocated with source files:

- `controllers/webhook/index.test.ts`
- `routes/webhook/index.test.ts`
- `routes/health/index.test.ts`

With coverage support via `vitest.config.ts`.

---

## 🛠 Deployment Options

- Supports `sst deploy` to AWS
- Setup custom domain via `customDomain` in `ApiGatewayV2`
- Logging via CloudWatch
- Optional: set webhook URL permanently on Facebook Developers dashboard

---

## 🔐 Environment Variables

Set these in your environment (e.g. `.env`, Console):

```env
WHATSAPP_VERIFY_TOKEN=...
WHATSAPP_ACCESS_TOKEN=...
```

---

## 📚 Resources

- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/)
- [SST v3 Docs](https://docs.sst.dev/)
- [Fastify Docs](https://www.fastify.io/)
- [Vitest Docs](https://vitest.dev/)

---

## 💬 Community

- [SST Discord](https://sst.dev/discord)
- [SST YouTube](https://www.youtube.com/@sstdev)
- [WhatsApp Meta Developer Support](https://developers.facebook.com/support/)

---

## 🧑‍💻 Author

Made with ❤️ by [@muhammadhafizmm](https://github.com/muhammadhafizmm)
