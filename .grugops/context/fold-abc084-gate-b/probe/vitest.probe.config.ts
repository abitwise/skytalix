import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: [".grugops/context/fold-abc084-gate-b/probe/*.probe.test.ts"], exclude: [] } });
