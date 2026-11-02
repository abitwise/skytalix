// qe-ABC-266-d12 prototype worker (ADR-0062 D3-D5). Imports the scratch tree by absolute path; adopts the owner's
// table once (D4); per go runs today's chooseMove with the D5 step-5 budget and the stop-slot clock.
import { parentPort, workerData } from "node:worker_threads";
const { tree, table, stop, index } = workerData;
const tt = await import(`${tree}/src/transposition.ts`);
const fen = await import(`${tree}/src/fen.ts`);
const eng = await import(`${tree}/src/engine.ts`);
tt.adoptTable(table);
const slot = new Int32Array(stop);
const stopClock = () => (Atomics.load(slot, 0) !== 0 ? Number.POSITIVE_INFINITY : Date.now());
parentPort.on("message", (m) => {
  const budgetMs = Math.max(1, m.budget - (Date.now() - m.goAt));
  const c = eng.chooseMove(fen.parseFen(m.fen), { budgetMs, now: stopClock });
  const mv = c ? `${c.move.from}-${c.move.to}-${c.move.promotion ?? ""}` : null;
  parentPort.postMessage({ index, depth: c?.depth ?? 0, nodes: c?.nodes ?? 0, score: c?.score ?? null, move: mv });
});
parentPort.postMessage({ online: index });
