// ABC-146 A0, the in-vitest arm. Run under the repository's own vitest.config.ts, unedited, with the
// probe directory as --root (the config's exclude names `.grugops/**` relative to the root, so this is the
// only way the repo's config can collect a file that lives here without editing it). Writes one JSON
// object to the path in A0_OUT. One test, one call, no warm-up: the same call node-run.mjs makes.
import { writeFileSync } from "node:fs";
import { expect, it } from "vitest";
import { runWorkload } from "./workload.mjs";

it("A0 workload: chooseMove(start, 4000 ms, virtualClock(120))", () => {
  const out = process.env.A0_OUT;
  expect(out, "A0_OUT is not set").toBeTruthy();
  const r = runWorkload();
  writeFileSync(out, JSON.stringify({ runner: "vitest", node: process.version, ...r }));
});
