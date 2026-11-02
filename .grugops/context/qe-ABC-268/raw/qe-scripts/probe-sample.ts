// qe-ABC-268 SCRATCH: the arch-phase2-p3 probe instrument's own audit SAMPLE on the base tree (patch_p3.py), dumped as
// fen|depth|alpha|beta, for a by-sha comparison with the QE hook on the ABC-268 build. Loop = probe3.ts audit mode.
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { makeMove, unmakeMove } from "./src/apply.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { PROBE, search } from "./src/search.ts";
const [out] = process.argv.slice(2);
const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1","8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1","r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1","rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8","r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const ENDGAMES = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1","k7/8/1K6/8/8/8/8/1R6 w - - 0 1","7k/8/6K1/8/8/8/8/6Q1 w - - 0 1","8/8/8/4k3/8/8/4P3/4K3 w - - 0 1","8/8/8/8/8/k7/8/KR6 w - - 0 1","8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const corpus: string[] = [];
for (const f of ROOTS) { corpus.push(f); const p = parseFen(f); for (const m of legalMoves(p)) { const u = makeMove(p, m); if (gameStatus(p).result === "in-progress") corpus.push(toFen(p)); unmakeMove(p, m, u); } }
corpus.push(...ENDGAMES);
const DEF = { ...PROBE };
let fired = 0, pruned = 0, nodes = 0;
const log: Array<{ fen: string; depth: number; alpha: number; beta: number }> = [];
for (const f of corpus) {
  Object.assign(PROBE, DEF, { fut: [0, 150, 350, 550], raz: [0, 0, 0, 0], auditLog: [], fired: 0, pruned: 0, cut: 0, audit: 10, auditMaxDepth: 99 });
  nodes += search(parseFen(f), 6).nodes;
  fired += PROBE.fired; pruned += PROBE.pruned;
  log.push(...PROBE.auditLog);
}
const text = log.map((r) => `${r.fen}|${r.depth}|${r.alpha}|${r.beta}`).join("\n");
writeFileSync(out, `${text}\n`);
console.log(JSON.stringify({ rows: corpus.length, nodes, fired, pruned, sampled: log.length, sampleSha: createHash("sha256").update(text).digest("hex").slice(0, 16) }));
