// se-ABC-271 cross-build value identity (report beside K1 (b)): every position of the two C2' PGNs on record,
// evaluate and evaluateAtPhase(p, phaseOf(p)) on main's copy vs the build, Object.is; and the seam at 0 on the build.
import { readFileSync } from "node:fs";
const B = await import("<scratch>/se271/main/src/evaluate.ts");
const H = await import("<worktree>/src/evaluate.ts");
const fen = await import("<scratch>/se271/main/src/fen.ts");
const apply = await import("<scratch>/se271/main/src/apply.ts");
const san = await import("<scratch>/se271/main/src/san.ts");
let n = 0, diff = 0, seamNonZero = 0, games = 0, passers = 0;
for (const pgn of process.argv.slice(2)) {
  for (const block of readFileSync(pgn, "utf8").split(/\n(?=\[Event )/)) {
    const fenM = block.match(/\[FEN "([^"]+)"\]/);
    const sans = (block.replace(/^\[.*\]$/gm, "").replace(/\{[^}]*\}/g, " ").match(/[^\s]+/g) ?? []).filter((t) => !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)).map((t) => t.replace(/^\d+\.+/, "")).filter((t) => t.length);
    if (sans.length === 0) continue;
    games++;
    const p = fen.parseFen(fenM ? fenM[1] : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    for (const s of sans) {
      const r = san.parseSan(p, s); if (r.outcome !== "move") break; apply.makeMove(p, r.move);
      const f = fen.toFen(p); const hp = fen.parseFen(f);
      n++;
      const ph = B.phaseOf(p);
      if (!Object.is(B.evaluate(p), H.evaluate(hp)) || !Object.is(B.evaluateAtPhase(p, ph), H.evaluateAtPhase(hp, ph))) diff++;
      const t = H.passerTermsForTest(hp);
      if (t.white.kd || t.white.free || t.white.un || t.black.kd || t.black.free || t.black.un) seamNonZero++;
      const w = H.pawnStructureForTest(hp, false); if (w.whitePassers | w.blackPassers) passers++;
    }
  }
}
console.log(JSON.stringify({ games, positions: n, differ: diff, seamNonZeroAtShippedValues: seamNonZero, positionsWithAPasser: passers }));
