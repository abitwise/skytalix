import { it } from "vitest";
it("p", () => { setTimeout(() => { throw new Error("PLANT-timer"); }, 0); });
