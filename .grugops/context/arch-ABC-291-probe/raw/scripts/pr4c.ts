// SCRATCH PROBE (arch-ABC-291-probe), PR4's last part: OFF is Object.is-equal to `main` on the corpora. `main` and `cand`
// are loaded side by side, each position parsed by its own copy. argv: <scratch root>. PGNS as for e4bprobe.ts.
import { readFileSync } from "node:fs";
const S = process.argv[2] as string;
const M = await import(`${S}/main/src/evaluate.ts`);
const C = await import(`${S}/cand/src/evaluate.ts`);
const fM = await import(`${S}/main/src/fen.ts`);
const fC = await import(`${S}/cand/src/fen.ts`);
const aC = await import(`${S}/cand/src/apply.ts`);
const sC = await import(`${S}/cand/src/san.ts`);
const mc = await import(`${S}/main/src/evaluate.mirror-corpus.ts`);
const tc = await import(`${S}/main/src/evaluate.taper-corpus.ts`);
const fens: [string, string][] = [];
for (const { position } of mc.buildCorpus()) fens.push(["G3", fM.toFen(position)]);
for (const r of tc.TAPER_MIRROR_POSITIONS) fens.push(["taper-mirror", r.fen]);
for (const r of tc.TAPER_DOOR_CORPUS) fens.push(["taper-door", r.fen]);
for (const file of (process.env.PGNS as string).split(",")) {
  for (const block of readFileSync(file, "utf8").split(/\n(?=\[Event )/)) {
    if (!block.includes("[Event ")) continue;
    const fenM = block.match(/\[FEN "([^"]+)"\]/);
    const movesText = block.replace(/^\[.*\]$/gm, "").replace(/\{[^}]*\}/g, " ").replace(/\([^)]*\)/g, " ");
    const sans = (movesText.match(/[^\s]+/g) ?? []).filter((t) => !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)).map((t) => t.replace(/^\d+\.+/, "")).filter((t) => t.length);
    const p = fC.parseFen(fenM ? (fenM[1] as string) : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    fens.push(["games", fC.toFen(p)]);
    for (const san of sans) {
      const r = sC.parseSan(p, san);
      if (r.outcome !== "move") throw new Error(`san ${san}`);
      aC.makeMove(p, r.move);
      fens.push(["games", fC.toFen(p)]);
    }
  }
}
const out: Record<string, { positions: number; offBad: number; taperBad: number }> = {};
for (const [set, fen] of fens) {
  const g = (out[set] ??= { positions: 0, offBad: 0, taperBad: 0 });
  const pm = fM.parseFen(fen), pc = fC.parseFen(fen);
  g.positions++;
  if (!Object.is(M.evaluate(pm), C.evaluateAtPhaseWithoutPawnShape(pc, C.phaseOf(pc)))) g.offBad++;
  if (!Object.is(M.evaluateWithoutTaper(pm), C.evaluateWithoutTaper(pc))) g.taperBad++;
}
console.log(JSON.stringify(out));
