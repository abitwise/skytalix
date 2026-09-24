import { defineConfig } from "vitest/config";

// The repo's own runner settings (pool: threads, isolate default) — nothing else.
export default defineConfig({ test: { pool: "threads", include: ["oracle.test.ts"] } });
