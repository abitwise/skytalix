// design-ABC-152 D2(b): ISOLATE=true|false, RUNNER=on|off. One worker, so two files CAN share a worker.
export default {
  test: {
    include: ["*.iso.test.mjs"],
    pool: "threads",
    maxWorkers: 1,
    isolate: process.env.ISOLATE !== "false",
    ...(process.env.RUNNER === "off" ? { experimental: { viteModuleRunner: false } } : {}),
  },
};
