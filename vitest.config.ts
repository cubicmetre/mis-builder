import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    includeSource: ["src/**/*.{ts,tsx}"],
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
    },
  },
});
