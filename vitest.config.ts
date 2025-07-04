import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: [
        "packages/functions/src/controllers/**",
        "packages/functions/src/routes/*/**"
      ],
      exclude: [
        "**/*.test.ts",
        "**/__tests__/**",
        "node_modules/**"
      ]
    }
  }
});
