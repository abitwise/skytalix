// Architect/Design probe, subtask arch-levels-recut. Read-only use of src/; VIRTUAL CLOCK ONLY.
// What does one ADR-0032 blunder cost at a given budget? createLevel with a rate that always fires
// (0.999999, the levels.test.ts fixture's rate) returns the scored root list; the blunder plays the
// strict second-best. Per position: best score, the played score, the gap (centipawns, positive = the
// blunder gave that much away by the level's own search), and the kind (blunder / no-candidate).
// Usage (from this directory): node blunder-gap.mjs <budgetMs> [step]
import { buildCorpus } from "../../../../src/evaluate.mirror-corpus.ts";
import { createLevel } from "../../../../src/levels.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";

const budgetMs = Number(process.argv[2]);
const step = Number(process.argv[3] ?? 4);
const corpus = buildCorpus().filter((e, i) => !e.name.includes("child") || i % 4 === 0);
for (const { name, position } of corpus) {
  const c = createLevel({ budgetMs, blunderRate: 0.999_999 }, { seed: 1, now: virtualClock(step) })(position);
  const scores = c.scored.map((s) => s.score);
  const best = Math.max(...scores);
  const played = c.scored.find((s) => s.move === c.move)?.score ?? null;
  console.log(
    JSON.stringify({ name, budgetMs, step, kind: c.kind, moves: scores.length, best, played, gap: best - played, depth: c.depth }),
  );
}
