// Writes the base-values emission to argv[3], through the tool's exported emitSource, from the tree argv[2].
import { writeFileSync } from "node:fs";
const [, , root, out] = process.argv;
const T = await import(`${root}/tools/tune/tune.ts`);
const { SHIPPED } = await import(`${root}/tools/tune/tracer.ts`);
const ce = { ce: 0 };
writeFileSync(out as string, T.emitSource(
  { counts: {}, manifest: [], manifestSha256: "0", baseTableSha256: "0", lichess: false },
  { table: { mg: Array.from(SHIPPED.mg), eg: Array.from(SHIPPED.eg), wmg: SHIPPED.wmg, weg: SHIPPED.weg, cap: SHIPPED.cap },
    rows: { ownTrain: 0, ownVal: 0, lichess: 0 }, K_own: 1, K_lichess: null, ownWeight: T.OWN_WEIGHT, config: "C-S", lambda: 0, ratio: 1,
    val: { base: ce, fit: ce }, train: { base: ce, fit: ce } },
  "0000000000000000000000000000000000000000"));
