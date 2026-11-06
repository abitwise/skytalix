// Hand values against the labeller, on all four images. Reads no src.
import { ROWS } from "./k1-rows.mjs";
import { fenOf, image, label, illegal } from "./k1-labeller.mjs";
let n = 0, bad = 0, ill = 0;
const eq = (a, b) => a.join() === b.join();
for (const row of ROWS) {
  const base = fenOf(row);
  for (const [v, h] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
    const fen = image(base, v, h);
    const got = label(fen);
    const W = v ? row.B : row.W, B = v ? row.W : row.B;
    n++;
    if (!eq(got.W, W) || !eq(got.B, B)) { bad++; console.log("MISMATCH", row.id, v, h, fen, "hand", W, B, "label", got.W, got.B); }
    if (illegal(fen)) { ill++; console.log("ILLEGAL", row.id, v, h, fen); }
  }
}
console.log(`rows ${ROWS.length} images ${n} mismatches ${bad} illegal ${ill}`);
