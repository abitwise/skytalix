// qe-ABC-271-freeze: checks the hand table in fixtures.json against
//  (1) a re-implementation of ADR-0070 d1 / d2 written from the ADR TEXT (not from any engine code; no
//      ABC-271 code exists), on every K1 (c) fixture and on its mirror (colours must swap);
//  (2) main itself, where main can speak: the FEN is canonical and parses, neither side is in check,
//      phaseOf equals the hand phase, main's isPassedPawn agrees with the passer list (frontmost per file),
//      main's evaluate is mirror-exact (Object.is) on every K1 (c) fixture and every K1 (a) position, and
//      the K1 (a) positions are new (not in G3's 184, TAPER_MIRROR_POSITIONS or TAPER_DOOR_CORPUS);
//  (3) the pair structure (one king step; one piece ahead of the passer) and the ticket's floors.
// usage (repo root as cwd): node <this> <fixtures.json>
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const SRC = resolve(process.cwd(), "src") + "/";
const { parseFen, toFen } = await import(SRC + "fen.ts");
const ev = await import(SRC + "evaluate.ts");
const { isInCheck } = await import(SRC + "legal.ts");
const { mirrorPosition, buildCorpus } = await import(SRC + "evaluate.mirror-corpus.ts");
const { TAPER_MIRROR_POSITIONS, TAPER_DOOR_CORPUS } = await import(SRC + "evaluate.taper-corpus.ts");
const data = JSON.parse(readFileSync(process.argv[2], "utf8"));
const V = data.values;
let fail = 0;
const bad = (m) => { fail++; console.log("FAIL", m); };
const PAWN = 1, KING = 6, BLK = 8, PW = [0, 0, 1, 1, 2, 4, 0];
const sqName = (s) => "abcdefgh"[s & 7] + ((s >> 4) + 1);
const cheb = (a, b) => Math.max(Math.abs((a & 7) - (b & 7)), Math.abs((a >> 4) - (b >> 4)));
// ---- the rule, from ADR-0070's text ----
function rule(pos) {
  const b = pos.board;
  let phase = 0; const king = { white: -1, black: -1 };
  for (let s = 0; s < 128; s++) { if (s & 0x88) continue; const x = b[s]; if (!x) continue;
    phase += PW[x & 7]; if ((x & 7) === KING) king[x & BLK ? "black" : "white"] = s; }
  const out = { phase };
  for (const colour of ["white", "black"]) {
    const black = colour === "black", own = PAWN | (black ? BLK : 0), enemy = PAWN | (black ? 0 : BLK), step = black ? -1 : 1;
    const ownK = king[colour], enK = king[black ? "white" : "black"];
    const defenderToMove = pos.blackToMove !== black;
    const passers = []; let kd = 0, free = 0, unst = false;
    for (let file = 0; file < 8; file++) {
      // frontmost own pawn on the file that is passed (no enemy pawn ahead on this or an adjacent file)
      const ranks = black ? [1, 2, 3, 4, 5, 6] : [6, 5, 4, 3, 2, 1];
      for (const r of ranks) {
        const sq = r * 16 + file; if (b[sq] !== own) continue;
        let passed = true;
        for (let rr = r + step; rr >= 1 && rr <= 6; rr += step) for (let ff = Math.max(0, file - 1); ff <= Math.min(7, file + 1); ff++) if (b[rr * 16 + ff] === enemy) passed = false;
        if (!passed) continue;
        const R = black ? 7 - r : r, Q = (black ? 0 : 7) * 16 + file;
        let isFree = 1;
        for (let rr = r + step; black ? rr >= 0 : rr <= 7; rr += step) if (b[rr * 16 + file]) isFree = 0;
        const dE = cheb(enK, Q), dO = cheb(ownK, Q);
        kd += V.PASSED_KING_ENEMY[R] * Math.min(dE, 5) - V.PASSED_KING_OWN[R] * Math.min(dO, 5);
        free += V.PASSED_FREE[R] * isFree;
        const moves = R === 1 ? 5 : 7 - R;
        if (phase === 0 && isFree && moves < dE - (defenderToMove ? 1 : 0)) unst = true;
        passers.push({ sq: sqName(sq), R, dE, dO, free: isFree });
        break; // only the frontmost passer of the file
      }
    }
    out[colour] = { passers, U: unst ? 1 : 0, seam: { kd, free, un: unst ? V.PASSED_UNSTOPPABLE : 0 } };
  }
  return out;
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const positions = {};
const corpusFens = new Set([...buildCorpus().map((c) => toFen(c.position)), ...TAPER_MIRROR_POSITIONS.map((r) => r.fen), ...TAPER_DOOR_CORPUS.map((r) => r.fen)]);
function mainChecks(id, fen, phase) {
  let p; try { p = parseFen(fen); } catch (e) { bad(`${id} parse: ${e.message}`); return null; }
  if (toFen(p) !== fen) bad(`${id} not canonical: ${toFen(p)}`);
  if (isInCheck(p)) bad(`${id} side to move in check`);
  if (isInCheck({ ...p, board: p.board.slice(), blackToMove: !p.blackToMove })) bad(`${id} side not to move in check`);
  if (ev.phaseOf(p) !== phase) bad(`${id} phase main ${ev.phaseOf(p)} hand ${phase}`);
  if (!Object.is(ev.evaluate(p), ev.evaluate(mirrorPosition(p)))) bad(`${id} main evaluate not mirror-exact`);
  return p;
}
for (const row of data.k1c) {
  const p = mainChecks(row.id, row.fen, row.phase); if (!p) continue;
  positions[row.id] = p;
  const r = rule(p);
  for (const c of ["white", "black"]) {
    const h = row[c];
    if (!same(r[c].passers, h.passers)) bad(`${row.id} ${c} passers rule ${JSON.stringify(r[c].passers)} hand ${JSON.stringify(h.passers)}`);
    if (r[c].U !== h.U) bad(`${row.id} ${c} U rule ${r[c].U} hand ${h.U}`);
    if (!same(r[c].seam, h.seam)) bad(`${row.id} ${c} seam rule ${JSON.stringify(r[c].seam)} hand ${JSON.stringify(h.seam)}`);
    // the hand seam equals the hand features . values
    const F = h.features; let kd = 0, fr = 0;
    for (let R = 0; R < 7; R++) { kd += V.PASSED_KING_ENEMY[R] * F.PASSED_KING_ENEMY[R] - V.PASSED_KING_OWN[R] * F.PASSED_KING_OWN[R]; fr += V.PASSED_FREE[R] * F.PASSED_FREE[R]; }
    if (kd !== h.seam.kd || fr !== h.seam.free || F.PASSED_UNSTOPPABLE * V.PASSED_UNSTOPPABLE !== h.seam.un) bad(`${row.id} ${c} features . values != seam`);
    // main's own passer test agrees on every pawn listed, and every frontmost passer main sees is listed
    for (const x of h.passers) { const sq = parseInt(x.sq[1]) * 16 - 16 + "abcdefgh".indexOf(x.sq[0]); if (!ev.isPassedPawn(p.board, sq)) bad(`${row.id} main says ${x.sq} not passed`); }
  }
  if (r.phase !== row.phase) bad(`${row.id} phase rule ${r.phase}`);
  // the rule is colour-symmetric on this fixture
  const m = rule(mirrorPosition(p));
  for (const [c, o] of [["white", "black"], ["black", "white"]]) if (!same(m[c].seam, r[o].seam)) bad(`${row.id} rule not mirror-symmetric (${c})`);
}
// ---- pair structure ----
const pairs = {};
for (const row of data.k1c) if (row.pair) (pairs[row.pair] ??= {})[row.half] = row;
for (const [id, pr] of Object.entries(pairs)) {
  const A = positions[pr.A.id], B = positions[pr.B.id]; if (!A || !B) { bad(`${id} incomplete`); continue; }
  const diff = []; for (let s = 0; s < 128; s++) if (!(s & 0x88) && A.board[s] !== B.board[s]) diff.push(s);
  if (A.blackToMove !== B.blackToMove) bad(`${id} side to move differs`);
  const kingStep = diff.length === 2 && diff.every((s) => (A.board[s] | B.board[s]) && (((A.board[s] || B.board[s]) & 7) === KING)) &&
    (A.board[diff[0]] || B.board[diff[0]]) === (A.board[diff[1]] || B.board[diff[1]]) && cheb(diff[0], diff[1]) === 1;
  const group = pr.A.group;
  if (group === "U" || group === "KD" || id === "FP5") { if (!kingStep) bad(`${id} is not one king step (${diff.map(sqName)})`); }
  else if (group === "FP") {
    if (diff.length !== 1 || B.board[diff[0]] !== 0 || (A.board[diff[0]] & 7) === KING || (A.board[diff[0]] & 7) === PAWN) bad(`${id} is not one piece added`);
    else { const ps = [...pr.A.white.passers, ...pr.A.black.passers]; const sq = diff[0];
      const ahead = ps.some((x) => { const f = "abcdefgh".indexOf(x.sq[0]), r = parseInt(x.sq[1]) - 1, black = pr.A.black.passers.includes(x);
        return (sq & 7) === f && (black ? (sq >> 4) < r : (sq >> 4) > r); });
      if (!ahead) bad(`${id} added piece ${sqName(sq)} not ahead of the passer`); }
  }
  const d = (c, k) => pr.A[c].seam[k] - pr.B[c].seam[k];
  console.log(`${id} A-B white kd ${d("white", "kd")} free ${d("white", "free")} un ${d("white", "un")} | black kd ${d("black", "kd")} free ${d("black", "free")} un ${d("black", "un")}`);
  if (group === "KD") for (const c of ["white", "black"]) if (d(c, "free") || d(c, "un")) bad(`${id} KD pair moves free/un`);
  if (group === "FP") for (const c of ["white", "black"]) if (d(c, "kd") || d(c, "un")) bad(`${id} FP pair moves kd/un`);
}
// KD7 is the mirror of KD1
for (const h of ["A", "B"]) if (toFen(mirrorPosition(parseFen(pairs.KD1[h].fen))) !== pairs.KD7[h].fen) bad(`KD7-${h} is not mirrorPosition(KD1-${h})`);
// ---- floors (test note 1; Orchestrator …6ccd8243 item 1) ----
const U = Object.values(pairs).filter((p) => p.A.group === "U");
const uOut = U.filter((p) => p.A.phase === 0 && (p.A.white.U || p.A.black.U) && !p.B.white.U && !p.B.black.U);
if (uOut.length < 4) bad(`U: ${uOut.length} outside/inside twins < 4`);
if (!data.k1c.some((r) => r.group === "U" && r.phase > 0 && !r.white.U && !r.black.U)) bad("no U fixture above phase 0 reading 0");
const KD = Object.values(pairs).filter((p) => p.A.group === "KD");
const movedKing = (p) => { const a = positions[p.A.id], b = positions[p.B.id]; for (let s = 0; s < 128; s++) if (!(s & 0x88) && a.board[s] !== b.board[s] && a.board[s]) return a.board[s] & BLK ? "black" : "white"; };
const passerSides = (p) => ["white", "black"].filter((c) => p.A[c].passers.length);
if (KD.length < 6) bad(`KD: ${KD.length} pairs < 6`);
if (!KD.some((p) => passerSides(p).some((c) => movedKing(p) !== c))) bad("no enemy-king KD pair");
if (!KD.some((p) => passerSides(p).some((c) => movedKing(p) === c && p.A[c].passers.some((x) => V.PASSED_KING_OWN[x.R] > 0)))) bad("no own-king KD pair");
if (!KD.some((p) => ["white", "black"].some((c) => p.A[c].passers.some((x, i) => { const y = p.B[c].passers[i]; return Math.min(x.dE, y.dE) >= 5 && x.dE !== y.dE || Math.min(x.dO, y.dO) >= 5 && x.dO !== y.dO; })))) bad("no KD pair beyond the cap");
const FP = Object.values(pairs).filter((p) => p.A.group === "FP" && p.A.id !== "FP5-A");
if (FP.length < 4) bad(`FP: ${FP.length} piece pairs < 4`);
// ---- K1 (a) ----
const seen = new Set();
for (const a of data.k1a) {
  const p = mainChecks(a.id, a.fen, a.phase); if (!p) continue;
  if (corpusFens.has(a.fen)) bad(`${a.id} already in G3 / TAPER_MIRROR_POSITIONS / TAPER_DOOR_CORPUS`);
  if (seen.has(a.fen)) bad(`${a.id} duplicate`); seen.add(a.fen);
  let n = 0; for (let s = 0; s < 128; s++) if (!(s & 0x88) && (p.board[s] & 7) === PAWN && ev.isPassedPawn(p.board, s)) n++;
  if (!n) bad(`${a.id} has no passer`);
  const r = rule(p), m = rule(mirrorPosition(p));
  if (!same(m.white.seam, r.black.seam) || !same(m.black.seam, r.white.seam)) bad(`${a.id} rule not mirror-symmetric`);
  console.log(`${a.id} phase ${a.phase} passers(main) ${n} rule@probed W ${JSON.stringify(r.white.seam)} B ${JSON.stringify(r.black.seam)}`);
}
if (data.k1a.length < 10) bad("K1 (a): fewer than 10 positions");
const sumK0 = Object.values(data.k0).join(" / ");
console.log(`K0 (ADR-0070 d5, copied): ${sumK0}`);
console.log(`k1c fixtures ${data.k1c.length}, pairs ${Object.keys(pairs).length} (U ${U.length}, KD ${KD.length}, FP ${FP.length}+FP5), k1a ${data.k1a.length}, failures ${fail}`);
process.exit(fail ? 1 : 0);
