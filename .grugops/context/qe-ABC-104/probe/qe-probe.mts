// QE probe for ABC-104. Usage: node qe-probe.mts <worktree-root>
import { pathToFileURL } from "node:url";
const root = process.argv[2];
const { parseCoordinateMove } = await import(pathToFileURL(`${root}/src/coordinate-move.ts`).href);
const { parseFen } = await import(pathToFileURL(`${root}/src/fen.ts`).href);
const { legalMoves } = await import(pathToFileURL(`${root}/src/legal.ts`).href);
const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
const L = legalMoves(p);
let thrown = 0;
const run = (n: string, f: () => any) => {
  try { const r = f(); console.log(`${n.padEnd(44)} RETURNED ${r?.outcome}${r?.reason ? "/" + r.reason : ""}`); }
  catch (e) { thrown++; console.log(`${n.padEnd(44)} THREW ${(e as Error).constructor.name}: ${(e as Error).message}`); }
};
console.log("== A2: the two documented throws + control");
run("A2.1 (null, 'e2e4')", () => parseCoordinateMove(null, "e2e4"));
run("A2.2 (p, 'e2e4', 42)", () => parseCoordinateMove(p, "e2e4", 42));
run("A2.c control (p, 'e2e4')", () => parseCoordinateMove(p, "e2e4"));
run("A2.c control (p, 'e2e4', L)", () => parseCoordinateMove(p, "e2e4", L));
console.log("== 'a wrong type throws' boundary");
run("B1 (null, 'hello')", () => parseCoordinateMove(null, "hello"));
run("B2 (undefined, '')", () => parseCoordinateMove(undefined, ""));
run("B3 (p, 'hello', 42)", () => parseCoordinateMove(p, "hello", 42));
run("B4 (null, 'e2e4', L)  position unread", () => parseCoordinateMove(null, "e2e4", L));
run("B5 (42, 'e2e4', L)", () => parseCoordinateMove(42, "e2e4", L));
run("B6 (p, 'e2e4', null) falls back via ??", () => parseCoordinateMove(p, "e2e4", null));
run("B7 (p, 'e2e4', 'abc')", () => parseCoordinateMove(p, "e2e4", "abc"));
run("B8 (p, 'e2e4', {})", () => parseCoordinateMove(p, "e2e4", {}));
run("B9 ({}, 'e2e4')", () => parseCoordinateMove({}, "e2e4"));
run("B10 (p, 'e2e4', [42])", () => parseCoordinateMove(p, "e2e4", [42]));
run("B11 (p, 'e2e4', [null])", () => parseCoordinateMove(p, "e2e4", [null]));
console.log("== text totality (valid position), with and without legal");
thrown = 0;
const evil = new Proxy({}, { get() { throw new Error("proxy"); }, has() { throw new Error("proxy"); } });
const texts: [string, unknown][] = [
  ["null", null], ["undefined", undefined], ["42", 42], ["NaN", NaN], ["BigInt", 10n], ["Symbol", Symbol("x")],
  ["throwing toString", { toString() { throw new Error("ts"); } }], ["throwing Proxy", evil],
  ["array ['e2e4']", ["e2e4"]], ["String object", new String("e2e4")], ["lone surrogate", "e2\uD800e4"],
  ["RTL override", "‮e2e4"], ["10M chars", "e".repeat(10_000_000)], ["10M then e2e4", " ".repeat(10_000_000) + "e2e4"],
  ["'E2-E4 '", " E2-E4 "], ["'e7e8q' startpos", "e7e8q"], ["'e2e4q'", "e2e4q"], ["'e2--e4'", "e2--e4"], ["''", ""],
];
for (const [n, t] of texts) { run(`T ${n}`, () => parseCoordinateMove(p, t)); run(`T ${n} +L`, () => parseCoordinateMove(p, t, L)); }
console.log(`text-domain throws: ${thrown} of ${texts.length * 2}`);
