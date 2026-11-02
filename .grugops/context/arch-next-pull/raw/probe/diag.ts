// SCRATCH DIAGNOSTIC (arch-next-pull; added after batch B, not pre-registered, no verdict): chooseMove to depth 5 on
// position-6/f3h4 (the 69 cp drift row) for H1, P1H1, J1, J1 with hLess 0 (a no-op term: must equal P1H1), J3.
import { makeMove } from "./src/apply.ts";
import { chooseMove } from "./src/engine.ts";
import { parseFen } from "./src/fen.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
import { PROBE } from "./src/search.ts";
const DEF = { ...PROBE, hist: [...PROBE.hist] };
const H1 = { hh: 1, hhIndex: "cft", hhMalus: 1 }, R0 = { lmr: "log", base: 1.0, div: 2.0, killerLess: 0, maxR: 2 };
const forms: Record<string, object> = { H1, P1H1: { ...H1, ...R0 }, J1: { ...H1, ...R0, hT: 1, hLess: 1 }, J1noop: { ...H1, ...R0, hT: 1, hLess: 0 }, J3: { ...H1, ...R0, hT: 1, hLess: 1, hMore: 1, hNegCap: 3 } };
const p0 = parseFen("r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10");
const m = legalMoves(p0).find((x) => squareName(x.from) + squareName(x.to) === "f3h4")!;
makeMove(p0, m);
const { toFen } = await import("./src/fen.ts"); const fen = toFen(p0);
for (const [k, cfg] of Object.entries(forms)) {
  Object.assign(PROBE, DEF, { hist: [0, 0, 0, 0, 0, 0, 0, 0], auditLog: [], fired: 0 }, cfg);
  const out: string[] = [];
  for (const d of [4, 5, 6]) { const c = chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }) as any; out.push(`d${d} ${squareName(c.move.from)}${squareName(c.move.to)} ${c.score} ${c.nodes}`); }
  console.log(k.padEnd(7), out.join(" | "));
}
