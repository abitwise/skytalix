// ABC-150 D1/D2, vitest side. Run only through vitest.d.config.mjs (never part of the lane: vitest.config.ts
// excludes .grugops/**). Usage: CAND=base|C1|C2|C3|C4 WHICH=E|S|P OUT_JSON=<file> vitest run -c vitest.d.config.mjs
// After the timed calls (never before), it records which mechanism actually applied, so a candidate that
// silently did not take effect is visible: thread or process, and whether a src/ export is a runner
// accessor (module runner) or a data property of a native ES namespace (externalized).
import { writeFileSync } from "node:fs";
import { isMainThread, threadId } from "node:worker_threads";
import { expect, it } from "vitest";

it(`ABC-150 D probe ${process.env.CAND} ${process.env.WHICH}`, async () => {
  const cand = process.env.CAND ?? "base";
  const mod = cand === "C3" ? await import("./bundle/workload150.bundle.mjs") : await import("./workload150.mjs");
  const r = mod.measure(process.env.WHICH);
  const ns = await import("../../../../src/position.ts");
  const d = Object.getOwnPropertyDescriptor(ns, "EMPTY");
  const mech = {
    cand,
    isMainThread,
    threadId,
    srcBinding: d ? ("get" in d ? "accessor" : "data") : "none",
    workload: String(mod.WHERE).replace(/^.*\/probe\//, "probe/"),
  };
  if (process.env.INSPECT === "1") {
    // Only under `node --allow-natives-syntax` (ungraded inspection). Built with new Function so the
    // runner's parser never sees the % syntax.
    const fast = new Function("o", "return %HasFastProperties(o)");
    mech.srcNamespaceFastProperties = fast(ns);
    mech.srcNamespaceProto = Object.getPrototypeOf(ns) === null ? "null" : "object";
  }
  writeFileSync(process.env.OUT_JSON, JSON.stringify({ runner: "vitest", mech, ...r }));
  expect(r.digest).toMatch(/^[0-9a-f]{16}$/);
});
