export default { test: { include: [".probe/nl/*.probe.test.ts"], pool: "threads", maxWorkers: 1, experimental: { viteModuleRunner: false, nodeLoader: process.env.NL !== "off" } } };
