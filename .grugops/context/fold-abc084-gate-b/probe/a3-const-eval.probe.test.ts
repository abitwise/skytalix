// Probe (fold-abc084-gate-b): can ABC-084 A3's "evaluation returning a constant" be reached
// WITHOUT a production door? vitest module mock of src/evaluate.ts, shipped chooseMove, fresh
// virtual clock per move, ABC-079's corpus read from src/quiescence.test.ts.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, it, vi } from "vitest";
import { chooseMove } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { squareName } from "../../../../src/position.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";

vi.mock("../../../../src/evaluate.ts", async (importOriginal) => {
  const real = await importOriginal<typeof import("../../../../src/evaluate.ts")>();
  return { ...real, evaluate: () => 0 };
});

it("constant evaluator: hanging corpus losing count and the mate in 2", () => {
  const src = readFileSync(fileURLToPath(new URL("../../../../src/quiescence.test.ts", import.meta.url)), "utf8");
  const block = src.slice(src.indexOf("const HANGING_CORPUS"), src.indexOf("interface HangingArm"));
  const rows = [...block.matchAll(/\{ name: "([^"]+)", fen: "([^"]+)", losing: "([a-h1-8]{4})" \}/g)];
  let losing = 0;
  let nodes = 0;
  const depths: number[] = [];
  const t0 = performance.now();
  for (const m of rows) {
    const c = chooseMove(parseFen(m[2]), { budgetMs: 100, now: virtualClock(1) });
    if (c && `${squareName(c.move.from)}${squareName(c.move.to)}` === m[3]) losing++;
    nodes += c?.nodes ?? 0;
    depths.push(c?.depth ?? -1);
  }
  console.log(`CONST-EVAL corpus: nodes=${nodes} nodes/move=${Math.round(nodes / rows.length)} depths=${depths.join(",")} wall=${((performance.now() - t0) / 1000).toFixed(2)}s`);
  const mate = chooseMove(parseFen("7k/8/5K2/8/8/8/8/R7 w - - 0 1"), { budgetMs: 100, now: virtualClock(1) });
  const mv = mate ? `${squareName(mate.move.from)}${squareName(mate.move.to)}` : "null";
  console.log(`CONST-EVAL budget=100 step=1: losing=${losing}/${rows.length} mate_in_2_move=${mv} score=${mate?.score}`);
  expect(rows.length).toBe(24);
});
