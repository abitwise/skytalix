// NFR-009 at 30 s (ABC-212): the ABC-081 A7 instrument, budgets 3 000 and LEVELS[7].budgetMs.
// Usage: node --expose-gc nfr009-30s.mjs <worktree-root>
import { pathToFileURL } from "node:url";
const root = process.argv[2];
const u = (p) => pathToFileURL(`${root}/src/${p}`).href;
const { chooseMove, HARD_CEILING_MS } = await import(u("engine.ts"));
const { parseFen } = await import(u("fen.ts"));
const { LEVELS } = await import(u("levels.ts"));
const { tableByteLength } = await import(u("transposition.ts"));
const { KEY_ARRAY_CAPACITY } = await import(u("search.ts"));
const fen = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const read = () => { gc(); gc(); const m = process.memoryUsage(); return { heapUsed: m.heapUsed, arrayBuffers: m.arrayBuffers }; };
const t0 = Date.now();
const three = chooseMove(parseFen(fen), { budgetMs: LEVELS[5].budgetMs }); const t1 = Date.now(); const a = read();
const thirty = chooseMove(parseFen(fen), { budgetMs: LEVELS[7].budgetMs }); const t2 = Date.now(); const b = read();
// Positive control: a retained growing Map (the mutant class (c) exists for) must move heapUsed > 1 MiB.
const retained = new Map(); for (let i = 0; i < 200000; i++) retained.set(BigInt(i), { m: i, d: i & 7 });
const c = read();
const MIB = 1024 * 1024;
const out = {
  budgets: [LEVELS[5].budgetMs, LEVELS[7].budgetMs], HARD_CEILING_MS,
  depths: [three.depth, thirty.depth], nodes: [three.nodes ?? null, thirty.nodes ?? null],
  wallMs_informational_only: [t1 - t0, t2 - t1],
  a, b,
  deltaHeapUsedMiB: (b.heapUsed - a.heapUsed) / MIB, deltaArrayBuffersMiB: (b.arrayBuffers - a.arrayBuffers) / MIB,
  staticBytes_table_plus_keys: tableByteLength() + (KEY_ARRAY_CAPACITY + 1) * 8,
  control_retainedMap_deltaHeapUsedMiB: (c.heapUsed - b.heapUsed) / MIB, control_size: retained.size,
  node: process.version,
};
console.log(JSON.stringify(out, null, 1));
