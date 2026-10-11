// ABC-150 D1/D2 workloads. E and S are ABC-147's own, imported unchanged from its probe. P is the third,
// moves.ts/legal.ts-heavy workload (RISK-ABC147-02), declared in METHOD.md before any graded run:
//   P = src/perft.test.ts "startpos perft(4) = 197281", the file's largest default-lane case:
//       perft(parseFen(START_FEN), 4). Its digest is the leaf count.
// measure() for P is ABC-147's algorithm, copied: one warm-up call, then k timed calls, median reported,
// digest checked on every call.
import { createHash } from "node:crypto";
import { parseFen } from "../../../../src/fen.ts";
import { perft } from "../../../../src/perft.ts";
import { measure as measure147 } from "../../ticket-to-pr-ABC-147/probe/workload.mjs";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const P = () => [perft(parseFen(START_FEN), 4)];
export const WHERE = import.meta.url;

export function measure(which, k = 5) {
  if (which !== "P") return measure147(which, k);
  const t0 = performance.now();
  const first = P();
  const coldMs = performance.now() - t0;
  const digest = createHash("sha256").update(JSON.stringify(first)).digest("hex").slice(0, 16);
  const ms = [];
  for (let i = 0; i < k; i++) {
    const s = performance.now();
    const res = P();
    ms.push(performance.now() - s);
    const d = createHash("sha256").update(JSON.stringify(res)).digest("hex").slice(0, 16);
    if (d !== digest) throw new Error(`non-deterministic workload P: ${d} != ${digest}`);
  }
  const s = [...ms].sort((x, y) => x - y);
  return { which, digest, coldMs: +coldMs.toFixed(2), ms: ms.map((x) => +x.toFixed(2)), medianMs: +s[s.length >> 1].toFixed(2), first };
}
