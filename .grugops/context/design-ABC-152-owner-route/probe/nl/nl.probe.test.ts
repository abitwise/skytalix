import { expect, it, vi } from "vitest";
import { f } from "./m.ts";
import { useF } from "./user.ts";
vi.mock("./m.ts", { spy: true });
it("a { spy: true } automock counts calls made through an importer", () => {
  vi.mocked(f).mockClear();
  useF();
  console.log(`isMock=${vi.isMockFunction(f)} calls=${vi.isMockFunction(f) ? vi.mocked(f).mock.calls.length : "n/a"}`);
  expect(vi.mocked(f)).toHaveBeenCalledTimes(2);
});
