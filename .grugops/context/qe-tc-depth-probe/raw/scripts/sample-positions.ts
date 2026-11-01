// qe-tc-depth-probe: replay the milestone-1 batch PGNs (qe-EPIC-010-m1-batch-2 raw/batch/{base,candidate}/bNN/r.pgn)
// with the clone's own SAN/FEN code and draw a seeded, stratified sample of positions.
// usage: node sample-positions.ts <clone> <batch-dir> <out.json>
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const [clone, batch, out] = process.argv.slice(2);
const { parseFen, toFen } = await import(join(clone, "src/fen.ts"));
const { parseSan } = await import(join(clone, "src/san.ts"));
const { legalMoves, isInCheck } = await import(join(clone, "src/legal.ts"));
const { makeMove } = await import(join(clone, "src/apply.ts"));
const { FLAG_CASTLE } = await import(join(clone, "src/moves.ts"));
function mulberry32(a: number) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
type Pos = { fen: string; game: string; ply: number; mover: string; check: boolean };
const all: Pos[] = [];
for (const side of ["base", "candidate"]) for (const b of readdirSync(join(batch, side)).sort()) {
  const text = readFileSync(join(batch, side, b, "r.pgn"), "utf8");
  const games = text.split(/\n(?=\[Event )/);
  games.forEach((g, gi) => {
    const tag = (k: string) => (g.match(new RegExp(`\\[${k} "([^"]*)"\\]`)) ?? [])[1];
    const fen0 = tag("FEN"); const white = tag("White"); const black = tag("Black");
    const body = g.replace(/^\[.*\]$/gm, "").replace(/\{[^}]*\}/g, " ").replace(/\d+\.(\.\.)?/g, " ");
    const toks = body.split(/\s+/).filter((t) => t && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t));
    const pos = parseFen(fen0);
    let ply = 0;
    for (const t of toks) {
      all.push({ fen: toFen(pos), game: `${side}/${b}#${gi + 1}`, ply, mover: pos.blackToMove ? black : white, check: isInCheck(pos) });
      const clean = t.replace(/[+#!?]+$/, "");
      let mv;
      if (clean === "O-O" || clean === "O-O-O") {
        mv = legalMoves(pos).find((m: any) => (m.flags & FLAG_CASTLE) !== 0 && ((m.to & 7) === (clean === "O-O" ? 6 : 2)));
      } else { const r = parseSan(pos, clean); if (r.outcome === "move") mv = r.move; }
      if (!mv) throw new Error(`unparsed ${t} in ${side}/${b}#${gi + 1} at ply ${ply}`);
      makeMove(pos, mv); ply++;
    }
  });
}
// strata by ply from the game's start FEN (the opening is ply 4 of openings.epd): A 0-29, B 30-69, C 70+
const rnd = mulberry32(20261101);
const pick = (pool: Pos[], n: number) => { const p = [...pool]; const r: Pos[] = []; while (r.length < n && p.length) r.push(p.splice(Math.floor(rnd() * p.length), 1)[0]); return r; };
const strata = (mover: string, n: number[]) => [[0, 29], [30, 69], [70, 9999]].flatMap(([lo, hi], i) =>
  pick(all.filter((p) => p.mover === mover && p.ply >= lo && p.ply <= hi && legalMoves(parseFen(p.fen)).length > 1), n[i]));
const sky = strata("skytalix", [7, 7, 6]);
const sf = strata("stockfish", [14, 14, 12]);
writeFileSync(out, JSON.stringify({ seed: 20261101, total: all.length, skytalix: sky, stockfish: sf }, null, 1));
console.log(`positions replayed ${all.length}; skytalix sample ${sky.length}; stockfish sample ${sf.length}`);
