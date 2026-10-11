export default { test: { include: [".probe/fresh/*.probe.test.ts"], pool: "threads", maxWorkers: 1, experimental: { viteModuleRunner: process.env.RUNNER !== "off" } } };
