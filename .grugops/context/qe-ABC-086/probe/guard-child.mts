// QE probe (qe-ABC-086, focus 2), child: one step input, by index. Reports what the factory does
// with it, and — if it accepts — what the SHIPPED engine does on that clock (kiwipete, budget 2;
// then a second search on the SAME clock, which is what `createEngine` does across a game).
// Run only under guard.mts, which bounds each child with a timeout.
import { chooseMove } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";

export const INPUTS: ReadonlyArray<[string, () => unknown]> = [
  ["0", () => 0],
  ["-0", () => -0],
  ["-1", () => -1],
  ["NaN", () => Number.NaN],
  ["Infinity", () => Number.POSITIVE_INFINITY],
  ["-Infinity", () => Number.NEGATIVE_INFINITY],
  ["Number.MIN_VALUE", () => Number.MIN_VALUE],
  ["1e-17", () => 1e-17],
  ["Number.EPSILON", () => Number.EPSILON],
  ["1e-9", () => 1e-9],
  ["1e-4", () => 1e-4],
  ["0.001", () => 0.001],
  ["0.1", () => 0.1],
  ["2**53", () => 2 ** 53],
  ["1e300", () => 1e300],
  ["Number.MAX_VALUE", () => Number.MAX_VALUE],
  ['"1" (string)', () => "1"],
  ['"abc" (string)', () => "abc"],
  ["undefined", () => undefined],
  ["null", () => null],
  ["true", () => true],
  ["1n (bigint)", () => 1n],
  ["new Number(1)", () => new Number(1)],
  ["{ valueOf: () => 1 }", () => ({ valueOf: () => 1 })],
  ["[1]", () => [1]],
  ["Symbol()", () => Symbol("s")],
  ["Object.create(null)", () => Object.create(null)],
];

if (import.meta.main) {
  const [name, make] = INPUTS[Number(process.argv[2])] as [string, () => unknown];
  let clock: (() => number) | undefined;
  try {
    clock = virtualClock(make() as number);
  } catch (error) {
    const e = error as Error;
    console.log(JSON.stringify({ input: name, factory: "threw", error: e.constructor.name, message: e.message }));
    process.exit(0);
  }
  const probeClock = virtualClock(make() as number);
  const readings = [probeClock(), probeClock(), probeClock(), probeClock()];
  console.log(JSON.stringify({ input: name, factory: "accepted", firstFourReadings: readings.map(String) }));
  const fen = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
  const t0 = performance.now();
  const first = chooseMove(parseFen(fen), { budgetMs: 2, now: clock });
  const second = chooseMove(parseFen(fen), { budgetMs: 2, now: clock });
  const wallMs = Math.round(performance.now() - t0);
  const show = (c: typeof first) =>
    c === null ? null : { depth: c.depth, nodes: c.nodes, elapsedMs: String(c.elapsedMs) };
  console.log(JSON.stringify({ input: name, engine: "returned", first: show(first), secondOnSameClock: show(second), wallMs }));
}
