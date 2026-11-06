// qe-ABC-291-k1: my rows against a src tree, by the seam, the hot path and the memo. Usage: node k1-run.ts <src dir>
// Reads, per image, both sides to move where legal: seam parts mg and eg; evaluate minus the off door against the seam's net; memo shape against fresh.
import { pathToFileURL } from "node:url";
import { join, resolve } from "node:path";
import { ROWS } from "./k1-rows.mjs";
import { fenOf, image, illegal } from "./k1-labeller.mjs";
const src = resolve(process.argv[2] as string);
const load = (f: string) => import(pathToFileURL(join(src, f)).href);
const { parseFen } = await load("fen.ts");
const { evaluate, evaluateAtPhaseWithoutPawnShape, pawnShapeForTest, pawnStructureForTest, phaseOf, clearPawnCacheForTest } = await load("evaluate.ts");
let reads = 0, seamBad = 0, hotBad = 0, memoBad = 0, parseBad = 0, rowsFired = 0;
const failed = new Set<string>();
const parts = (s: any, h: "mg" | "eg") => [s.connected[h], s.phalanx[h], s.backward[h]];
const same = (a: number[], b: number[]) => a.join() === b.join();
for (const row of ROWS as any[]) {
  const base = fenOf(row);
  for (const [v, h] of [[0, 0], [1, 0], [0, 1], [1, 1]] as const) {
    const fen0 = image(base, v, h);
    const flip = fen0.replace(/ ([wb]) /, (_, c) => ` ${c === "w" ? "b" : "w"} `).replace(/ [a-h][36] 0 1$/, " - 0 1");
    for (const fen of illegal(flip) ? [fen0] : [fen0, flip]) {
      reads++;
      let p: any;
      try { p = parseFen(fen); } catch (e) { parseBad++; console.log("PARSE", row.id, fen, String(e)); continue; }
      const W = v ? row.B : row.W, B = v ? row.W : row.B;
      const s = pawnShapeForTest(p);
      for (const half of ["mg", "eg"] as const) {
        if (!same(parts(s.white, half), W) || !same(parts(s.black, half), B)) {
          seamBad++; failed.add(row.id);
          console.log("SEAM", row.id, v, h, fen, half, "want", W, B, "read", parts(s.white, half), parts(s.black, half));
        }
      }
      const net = W[0] + W[1] - W[2] - (B[0] + B[1] - B[2]);
      const hot = evaluate(p) - evaluateAtPhaseWithoutPawnShape(p, phaseOf(p));
      if (hot !== (p.blackToMove ? -net : net)) { hotBad++; failed.add(row.id); console.log("HOT", row.id, fen, hot, net); }
      clearPawnCacheForTest();
      const miss = pawnStructureForTest(p, true), hit = pawnStructureForTest(p, true), fresh = pawnStructureForTest(p, false);
      if (miss.shape !== fresh.shape || hit.shape !== fresh.shape) { memoBad++; failed.add(row.id); console.log("MEMO", row.id, fen); }
      if (net !== 0 || W.some(Boolean) || B.some(Boolean)) rowsFired++;
    }
  }
}
console.log(JSON.stringify({ baseRows: ROWS.length, images: ROWS.length * 4, reads, readsWithAPart: rowsFired, parseBad, seamBad, hotBad, memoBad, failedRows: [...failed] }));
