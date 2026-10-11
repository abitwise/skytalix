// design-ABC-152: does `vi.resetModules()` give a FRESH module instance on the next dynamic import?
// `src/book.test.ts` ABC-094 A2's premise ("two fresh module instances"). Prints identity; asserts freshness.
import { expect, it, vi } from "vitest";

it("vi.resetModules() then import() returns a new module instance", async () => {
  const first = await import("./dep.ts");
  vi.resetModules();
  const second = await import("./dep.ts");
  console.log(`reset-probe same-instance=${first === second}`);
  expect(second).not.toBe(first);
});
