// design-ABC-152 D2(b): each test file bumps the shared module once. With a fresh registry per file it
// reads 1. If two files share one registry (isolate: false on one worker), the second reads 2: the ARMED red.
import { threadId } from "node:worker_threads";
import { expect, it } from "vitest";
import { bump } from "./counter.mjs";

it("this file sees a fresh module registry", () => {
  const seen = bump();
  console.log(`iso-probe ${import.meta.url.split("/").pop()} thread=${threadId} count=${seen}`);
  expect(seen).toBe(1);
});
