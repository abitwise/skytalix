// QE-104-d re-measure: does ADR-0004 (2a)'s "every input produces one of the three arms and none of
// them throws" hold for parseSan? Usage: node qe104d-parsesan.mts <worktree-root>
import { pathToFileURL } from "node:url";
const root = process.argv[2];
const { parseSan } = await import(pathToFileURL(`${root}/src/san.ts`).href);
const { parseFen } = await import(pathToFileURL(`${root}/src/fen.ts`).href);
const { legalMoves } = await import(pathToFileURL(`${root}/src/legal.ts`).href);
const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
const c = parseFen("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1"); // castling available
const L = legalMoves(p);
const LC = legalMoves(c);
let thrown = 0;
let returned = 0;
const run = (n: string, f: () => any, quiet = false) => {
  try {
    const r = f();
    returned++;
    if (!quiet) console.log(`${n.padEnd(46)} RETURNED ${r?.outcome}${r?.reason ? `/${r.reason}` : ""}`);
  } catch (e) {
    thrown++;
    console.log(`${n.padEnd(46)} THREW ${(e as Error).constructor.name}: ${(e as Error).message}`);
  }
};
console.log("== T: hostile TEXT, valid position, with and without legal (the domain the ADR's sentence is about)");
const texts: unknown[] = [
  "", " ", "e4", "e5", "Nf3", "Nf3+", "Nf3#", "O-O", "0-0", "O-O-O", "e8=Q", "exd5", "Qh4xe1", "Nbd2",
  "hello", "\u0000", "\u{1F600}", "e4".repeat(10000), "K", "Kx", "=Q", "+", "#", "e9", "i1", "Na1a1a1",
  "\n\t e4 \n", "e4++", "O-O+#", "--", null, undefined, 42, {}, [], true, Symbol("s"), () => 1, NaN,
];
const T0 = thrown;
for (const [i, t] of texts.entries()) {
  run(`T${i} (p, ${String(typeof t === "symbol" ? "Symbol" : JSON.stringify(t) ?? t).slice(0, 18)})`, () => parseSan(p, t), true);
  run(`T${i}L (p, …, L)`, () => parseSan(p, t, L), true);
  run(`T${i}C (c, …)`, () => parseSan(c, t), true);
  run(`T${i}CL (c, …, LC)`, () => parseSan(c, t, LC), true);
}
console.log(`  ${texts.length} texts x 4 calls = ${texts.length * 4}; threw ${thrown - T0}`);
console.log("== W: wrong-typed POSITION or LEGAL (the caller obligation; outside the text domain)");
run("W1 (null, 'e4')", () => parseSan(null, "e4"));
run("W2 (undefined, 'hello')", () => parseSan(undefined, "hello"));
run("W3 ({}, 'e4')", () => parseSan({}, "e4"));
run("W4 (p, 'e4', 42)", () => parseSan(p, "e4", 42));
run("W5 (p, 'e4', 'abc')", () => parseSan(p, "e4", "abc"));
run("W6 (p, 'e4', [null])", () => parseSan(p, "e4", [null]));
run("W7 (p, 'e4', [42])", () => parseSan(p, "e4", [42]));
run("W8 (null, 'e4', L)   position unread", () => parseSan(null, "e4", L));
run("W9 (null, 'O-O', LC) castle path reads it", () => parseSan(null, "O-O", LC));
run("W10 (null, 42)       text guard first", () => parseSan(null, 42));
run("W11 (p, 'e4', LC)    another position's list", () => parseSan(p, "e4", LC));
console.log(`TOTAL returned ${returned}, threw ${thrown}`);
