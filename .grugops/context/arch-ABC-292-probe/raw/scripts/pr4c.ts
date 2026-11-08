// SCRATCH PROBE (arch-ABC-292-probe), PR4's cross-copy parts, after arch-ABC-291-probe's pr4c.ts. `main`, `cand` and
// `cut` are loaded side by side, each position parsed by its own copy. argv: <scratch root>. PGNS as for e5probe.ts;
// FIX = QE's fixtures.json; PRE = QE's pre-ticket.json.
// (a) OFF Object.is `main`: cand evaluateAtPhaseWithoutPieceTerms(p, phaseOf(p)) against main evaluate, and cand
//     evaluateWithoutTaper against main's, on the corpora; and both against QE's frozen K1 (b) `newRows`.
// (b) `cut` Object.is `cand`: evaluate, the off evaluation, evaluateWithoutTaper, evaluateWithoutMobility,
//     evaluateWithoutPawnCache and kingExposureForTest, on the same corpora.
import { readFileSync } from "node:fs";
const S = process.argv[2] as string;
const M = await import(`${S}/main/src/evaluate.ts`);
const C = await import(`${S}/cand/src/evaluate.ts`);
const X = await import(`${S}/cut/src/evaluate.ts`);
const fM = await import(`${S}/main/src/fen.ts`);
const fC = await import(`${S}/cand/src/fen.ts`);
const fX = await import(`${S}/cut/src/fen.ts`);
const aC = await import(`${S}/cand/src/apply.ts`);
const sC = await import(`${S}/cand/src/san.ts`);
const mc = await import(`${S}/main/src/evaluate.mirror-corpus.ts`);
const tc = await import(`${S}/main/src/evaluate.taper-corpus.ts`);
const FIX = JSON.parse(readFileSync(process.env.FIX as string, "utf8"));
const PRE = JSON.parse(readFileSync(process.env.PRE as string, "utf8"));
const fens: [string, string][] = [];
for (const { position } of mc.buildCorpus()) fens.push(["G3", fM.toFen(position)]);
for (const r of tc.TAPER_MIRROR_POSITIONS) fens.push(["taper-mirror", r.fen]);
for (const r of tc.TAPER_DOOR_CORPUS) fens.push(["taper-door", r.fen]);
const frozen: string[] = [...FIX.k1c.map((r: any) => r.fen), ...FIX.k1a.map((r: any) => r.fen)];
for (const k of FIX.k2) for (const f of [k.fen, k.closedF5, k.halfOpenE5]) if (f) frozen.push(f);
for (const f of frozen) {
  fens.push(["frozen", f]);
  fens.push(["frozen", fM.toFen(mc.mirrorPosition(fM.parseFen(f)))]);
}
let games = 0;
for (const file of (process.env.PGNS as string).split(",")) {
  for (const block of readFileSync(file, "utf8").split(/\n(?=\[Event )/)) {
    if (!block.includes("[Event ")) continue;
    games++;
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
if (games !== 200) throw new Error(`games ${games}`);
const ke = (o: any) => `${o.white.mg},${o.white.eg},${o.black.mg},${o.black.eg}`;
const out: Record<string, { positions: number; offBad: number; taperBad: number; cutBad: number }> = {};
for (const [set, fen] of fens) {
  const g = (out[set] ??= { positions: 0, offBad: 0, taperBad: 0, cutBad: 0 });
  const pm = fM.parseFen(fen), pc = fC.parseFen(fen), px = fX.parseFen(fen);
  g.positions++;
  if (!Object.is(M.evaluate(pm), C.evaluateAtPhaseWithoutPieceTerms(pc, C.phaseOf(pc)))) g.offBad++;
  if (!Object.is(M.evaluateWithoutTaper(pm), C.evaluateWithoutTaper(pc))) g.taperBad++;
  const pairs: [unknown, unknown][] = [
    [C.evaluate(pc), X.evaluate(px)],
    [C.evaluateAtPhaseWithoutPieceTerms(pc, C.phaseOf(pc)), X.evaluateAtPhaseWithoutPieceTerms(px, X.phaseOf(px))],
    [C.evaluateWithoutTaper(pc), X.evaluateWithoutTaper(px)],
    [C.evaluateWithoutMobility(pc), X.evaluateWithoutMobility(px)],
    [C.evaluateWithoutPawnCache(pc), X.evaluateWithoutPawnCache(px)],
    [ke(C.kingExposureForTest(pc)), ke(X.kingExposureForTest(px))],
  ];
  if (pairs.some(([a, b]) => !Object.is(a, b))) g.cutBad++;
}
// QE's frozen K1 (b) new rows: main's readings at the freeze on every new position and its mirror.
let preRows = 0, preOffBad = 0, preTaperBad = 0;
for (const r of PRE.newRows.rows) {
  preRows++;
  const pc = fC.parseFen(r.fen);
  if (!Object.is(C.evaluateAtPhaseWithoutPieceTerms(pc, C.phaseOf(pc)), r.evaluate)) preOffBad++;
  if (!Object.is(C.evaluateWithoutTaper(pc), r.evaluateWithoutTaper)) preTaperBad++;
}
console.log(JSON.stringify({ games, sets: out, k1bNewRows: { rows: preRows, offBad: preOffBad, taperBad: preTaperBad } }));
