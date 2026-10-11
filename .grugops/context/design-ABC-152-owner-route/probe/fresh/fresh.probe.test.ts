import { expect, it, vi } from "vitest";

it("resetModules: same instance?", async () => {
  const a = await import("./dep.ts");
  vi.resetModules();
  const b = await import("./dep.ts");
  console.log(`reset same=${a === b}`);
});

it("query-string import: fresh instance of the module itself, shared deps", async () => {
  const a = (await import(`./dep2.ts?run=0`)) as typeof import("./dep2.ts");
  const b = (await import(`./dep2.ts?run=1`)) as typeof import("./dep2.ts");
  const d0 = (await import(`./dep.ts?run=0`)) as typeof import("./dep.ts");
  const d1 = (await import(`./dep.ts?run=1`)) as typeof import("./dep.ts");
  console.log(`query dep2 same=${a === b} dep2.salt equal=${a.SALT_SEEN === b.SALT_SEEN}`);
  console.log(`query dep same=${d0 === d1} salt equal=${d0.LOAD_SALT === d1.LOAD_SALT} next0=${d0.next()} next1=${d1.next()}`);
  expect(d0).not.toBe(d1);
  expect(d0.LOAD_SALT).not.toBe(d1.LOAD_SALT);
});
