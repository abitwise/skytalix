// arch-ABC-266-repropose prototype worker (ADR-0062 D3-D5, from qe-ABC-266-d12 worker.mjs) plus the candidate knobs.
// Per go: cfg { deeper, skip, perturb }. Worker 0 never skips and is never perturbed (it is the unmodified search).
import { parentPort, workerData } from "node:worker_threads";
const { tree, table, stop, index } = workerData;
const tt = await import(`${tree}/src/transposition.ts`);
const fen = await import(`${tree}/src/fen.ts`);
const eng = await import(`${tree}/src/engine.ts`);
tt.adoptTable(table);
const slot = new Int32Array(stop);
const stopClock = () => (Atomics.load(slot, 0) !== 0 ? Number.POSITIVE_INFINITY : Date.now());
const SKIP_SIZE = [1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4];
const SKIP_PHASE = [0, 1, 0, 1, 2, 3, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 6, 7];
parentPort.on("message", (m) => {
  const c = m.cfg ?? {};
  tt.scratchSetDeeper(!!c.deeper);
  const h = (index - 1) % 20;
  eng.scratchSetDiversity(c.skip && index > 0 ? SKIP_SIZE[h] : 0, c.skip && index > 0 ? SKIP_PHASE[h] : 0, c.perturb && index > 0 ? index : 0);
  const budgetMs = Math.max(1, m.budget - (Date.now() - m.goAt));
  const r = eng.chooseMove(fen.parseFen(m.fen), { budgetMs, now: stopClock });
  const mv = r ? `${r.move.from}-${r.move.to}-${r.move.promotion ?? ""}` : null;
  parentPort.postMessage({ index, depth: r?.depth ?? 0, nodes: r?.nodes ?? 0, score: r?.score ?? null, move: mv });
});
parentPort.postMessage({ online: index });
