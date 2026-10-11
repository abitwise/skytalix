// ABC-147 A2, vitest side. Run only through vitest.probe.config.mjs (never part of the lane:
// vitest.config.ts excludes .grugops/**). Usage: WHICH=E|S OUT_JSON=<file> vitest run -c <that config>
import { writeFileSync } from "node:fs";
import { expect, it } from "vitest";
import { measure } from "./workload.mjs";
it(`ABC-147 A2 probe ${process.env.WHICH}`, () => {
  const r = measure(process.env.WHICH);
  writeFileSync(process.env.OUT_JSON, JSON.stringify({ runner: "vitest", ...r }));
  expect(r.digest).toMatch(/^[0-9a-f]{16}$/);
});
