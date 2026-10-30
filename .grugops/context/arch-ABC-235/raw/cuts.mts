// arch-ABC-235: re-read se-ABC-227's redacted cpu profiles (no new engine run) and attribute
// self time to each of the six candidate cuts by CALL STACK, so each cut's bound is its own.
// Usage: node cuts.mts <profiles-dir>
import { readdirSync, readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { join } from "node:path";

const DIR = process.argv[2] as string;
interface CF { functionName: string; url: string; lineNumber: number }
interface N { id: number; callFrame: CF; children?: number[]; positionTicks?: { line: number; ticks: number }[] }
interface P { nodes: N[]; startTime: number; samples: number[]; timeDeltas: number[] }

const boards = ["kiwipete", "position-6", "start"];
const out: Record<string, Record<string, number[]>> = {};

for (const board of boards) {
  out[board] = {};
  const acc = out[board] as Record<string, number[]>;
  const add = (k: string, run: number, v: number) => {
    (acc[k] ??= [0, 0, 0, 0, 0])[run] += v;
  };
  for (let run = 1; run <= 5; run++) {
    const p = JSON.parse(gunzipSync(readFileSync(join(DIR, `${board}-cpu-${run}.cpuprofile.gz`))).toString()) as P;
    const r = JSON.parse(readFileSync(join(DIR, `${board}-cpu-${run}.json`), "utf8"));
    const byId = new Map<number, N>();
    const parent = new Map<number, number>();
    for (const n of p.nodes) {
      byId.set(n.id, n);
      for (const c of n.children ?? []) parent.set(c, n.id);
    }
    const stackOf = (id: number): string[] => {
      const s: string[] = [];
      for (let cur: number | undefined = id; cur !== undefined; cur = parent.get(cur)) {
        const f = (byId.get(cur) as N).callFrame;
        s.push(f.functionName || (f.url.includes("quiescence.ts") ? "(anon-quiescence)" : f.url.includes("search.ts") ? "(anon-search)" : "(anon)"));
      }
      return s; // leaf first
    };
    const cache = new Map<number, string[]>();
    let t = p.startTime;
    let total = 0;
    const r1 = run - 1;
    for (let i = 0; i < p.samples.length; i++) {
      t += p.timeDeltas[i] as number;
      if (t < r.t0us || t > r.t1us) continue;
      const id = p.samples[i] as number;
      let s = cache.get(id);
      if (!s) {
        s = stackOf(id);
        cache.set(id, s);
      }
      if (!s.includes("chooseMove")) continue;
      total++;
      const leaf = s[0] as string;
      const parentFn = s[1] as string;
      const has = (f: string) => s.includes(f);
      // cut 1: kingSquareOf self, by its caller
      if (leaf === "kingSquareOf") add(`c1 kingSquareOf<-${parentFn}`, r1, 1);
      // legality filter cost: samples under a legal* filter but NOT under generateMoves (the make/test/unmake part)
      for (const lf of ["legalMoves", "legalCaptures", "hasLegalMove"]) {
        if (s.indexOf(lf) >= 0) {
          const gi = s.indexOf("generateMoves");
          const li = s.indexOf(lf);
          if (gi >= 0 && gi < li) add(`gen-under ${lf}`, r1, 1);
          else add(`test-under ${lf}`, r1, 1);
        }
      }
      // castling's own attack tests inside generateMoves
      if (has("addCastlingMoves")) {
        for (const lf of ["legalMoves", "legalCaptures", "hasLegalMove"]) if (has(lf)) add(`gen castling under ${lf}`, r1, 1);
      }
      if (has("generateMoves") && (leaf === "addMove" || leaf === "addPawnMoves" || leaf === "addRayMoves" || leaf === "addStepMoves" || leaf === "generateMoves" || leaf === "addPromotions")) {
        for (const lf of ["legalCaptures"]) if (has(lf)) add(`gen non-castling self under ${lf}`, r1, 1);
      }
      // cut 4/5: evaluation split
      if (leaf === "whiteMinusBlack") add("c4 whiteMinusBlack self", r1, 1);
      if (has("pawnStructure")) add("c5 pawnStructure incl (incl isPassedPawn)", r1, 1);
      if (has("kingExposure")) add("kingExposure incl", r1, 1);
      if (has("squaresReached")) add("squaresReached incl", r1, 1);

      // cut 6: ordering
      if (has("orderMoves")) add("c6 orderMoves incl", r1, 1);
      if (has("quiesce") && !has("orderMoves") && (leaf === "(anon-quiescence)" || leaf === "mvvLvaKey" || parentFn === "(anon-quiescence)" || /sort|Sort|merge|Merge|Insertion|Binary/.test(leaf)) && s.indexOf("quiesce") > 0) {
        // the capture sort inside quiesce: comparator closure, mvvLvaKey from it, the native sort frames
        const qi = s.indexOf("quiesce");
        const li = s.indexOf("legalCaptures");
        if (li === -1 || li > qi) add("c6b quiesce sort", r1, 1);
      }
      if (leaf === "(garbage collector)") add("GC", r1, 1);
    }
    add("TOTAL", r1, total);
    // whiteMinusBlack line ticks (whole profile; eval never runs outside chooseMove)
    for (const n of p.nodes) {
      if (n.callFrame.functionName === "whiteMinusBlack" && n.positionTicks) {
        for (const pt of n.positionTicks) add(`wmb line ${pt.line}`, r1, pt.ticks);
      }
    }
  }
}

for (const board of boards) {
  const acc = out[board] as Record<string, number[]>;
  const tot = acc.TOTAL as number[];
  console.log(`\n== ${board} (share of in-window samples, pooled; per-run min-max)`);
  const pooledTot = tot.reduce((a, b) => a + b, 0);
  const wmbTot = Object.entries(acc).filter(([k]) => k.startsWith("wmb line")).reduce((a, [, v]) => a + v.reduce((x, y) => x + y, 0), 0);
  for (const [k, v] of Object.entries(acc).sort()) {
    if (k === "TOTAL") continue;
    const pooled = v.reduce((a, b) => a + b, 0);
    if (k.startsWith("wmb line")) {
      console.log(`  ${k.padEnd(48)} ${((100 * pooled) / wmbTot).toFixed(1)} % of whiteMinusBlack ticks`);
      continue;
    }
    const per = v.map((x, i) => (100 * x) / (tot[i] as number));
    console.log(`  ${k.padEnd(48)} ${((100 * pooled) / pooledTot).toFixed(1).padStart(5)}  (${Math.min(...per).toFixed(1)}-${Math.max(...per).toFixed(1)})`);
  }
}
