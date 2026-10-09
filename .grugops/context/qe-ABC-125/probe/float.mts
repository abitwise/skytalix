// QE ABC-125 focus (4): is `toEqual` on the six readings exact? Run: npx tsx .grugops/context/qe-ABC-125/probe/float.mts
import { JestChaiExpect, JestExtend, JestAsymmetricMatchers } from "@vitest/expect";
import * as chai from "chai";
chai.use(JestExtend); chai.use(JestChaiExpect); chai.use(JestAsymmetricMatchers);
const expect = chai.expect as unknown as (v: unknown) => { toEqual(w: unknown): void };
import { virtualClock } from "../../../../src/virtual-clock.ts";
const tryEq = (label: string, got: unknown, want: unknown) => {
  try { expect(got).toEqual(want); console.log(`${label}: toEqual PASS`); }
  catch { console.log(`${label}: toEqual FAIL`); }
};
const a = virtualClock(1), b = virtualClock(0.5);
const six = [a(), b(), a(), b(), a(), b()];
console.log("shipped six:", JSON.stringify(six), "every reading === expected:", six.every((v, i) => Object.is(v, [0, 0, 1, 0.5, 2, 1][i])));
tryEq("off by 1 ulp (2 -> 2+eps*2)", [0, 0, 1, 0.5, 2 + Number.EPSILON * 2, 1], [0, 0, 1, 0.5, 2, 1]);
tryEq("string '1' for 1", [0, 0, "1", 0.5, 2, 1], [0, 0, 1, 0.5, 2, 1]);
tryEq("-0 for 0", [-0, 0, 1, 0.5, 2, 1], [0, 0, 1, 0.5, 2, 1]);
tryEq("seventh reading appended", [0, 0, 1, 0.5, 2, 1, 3], [0, 0, 1, 0.5, 2, 1]);
const t = virtualClock(0.1); const tenth = [t(), t(), t(), t()];
console.log("non-dyadic step 0.1, four reads:", JSON.stringify(tenth), "4th === 0.3:", tenth[3] === 0.3);
