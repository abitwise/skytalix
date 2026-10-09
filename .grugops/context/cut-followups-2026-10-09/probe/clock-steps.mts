// BA/PM probe (cut-followups-2026-10-09), read-only: QE's ABC-086 G-QE-1 remedy row, on the
// shipped module. Two live clocks at steps 1 and 0.5, reads interleaved.
// Run from the repo root: node .grugops/context/cut-followups-2026-10-09/probe/clock-steps.mts
import { virtualClock } from "../../../../src/virtual-clock.ts";

const a = virtualClock(1);
const b = virtualClock(0.5);
const reads = [a(), b(), a(), b(), a(), b()];
console.log(JSON.stringify(reads), JSON.stringify(reads) === JSON.stringify([0, 0, 1, 0.5, 2, 1]) ? "MATCH" : "DIFFER");
