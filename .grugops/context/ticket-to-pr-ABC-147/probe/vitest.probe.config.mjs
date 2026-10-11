// ABC-147 A2: a probe-only vitest config. The lane's vitest.config.ts is not touched. Same pool as the lane.
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
const here = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root: here,
  test: { pool: "threads", include: ["a2.probe.test.mjs"], testTimeout: 600000 },
});
