// qe-ABC-270-freeze: checks the hand table in pairs.json against (1) a rule re-implementation written
// from the STATED rule (not from main's kingExposure), and (2) main's own evaluate, by the only
// per-term reading main offers: zero one base exposure pair through withParametersForTest and read
// the white-POV change, which must be value x (black count - white count) on every row and both
// recursions' entries (evaluate, evaluateWithoutTaper). No ABC-270 code exists; nothing here grades it.
// usage (repo root as cwd): node <this> <pairs.json>
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const SRC = resolve(process.cwd(), "src") + "/";
const { parseFen, toFen } = await import(SRC + "fen.ts");
const ev = await import(SRC + "evaluate.ts");
const P = await import(SRC + "evaluate-params.ts");
const { isInCheck } = await import(SRC + "legal.ts");
const { mirrorPosition } = await import(SRC + "evaluate.mirror-corpus.ts");
const data = JSON.parse(readFileSync(process.argv[2], "utf8"));
let fail = 0;
const bad = (m) => { fail++; console.log("FAIL", m); };
const PAWN = 1, QUEEN = 5, KING = 6, BLK = 8;
const sqName = (s) => "abcdefgh"[s & 7] + ((s >> 4) + 1);
// the stated rule, re-implemented from the docblock
function counts(board, black) {
  let king = -1, enemyQueen = 0;
  for (let s = 0; s < 128; s++) { if (s & 0x88) continue; const p = board[s]; if (!p) continue;
    if ((p & 7) === KING && ((p & BLK) !== 0) === black) king = s;
    if ((p & 7) === QUEEN && ((p & BLK) !== 0) !== black) enemyQueen = 1; }
  const own = PAWN | (black ? BLK : 0), enemy = PAWN | (black ? 0 : BLK), step = black ? -1 : 1;
  const kf = king & 7, kr = king >> 4;
  let s_ = 0, h_ = 0, o_ = 0;
  for (let f = Math.max(0, kf - 1); f <= Math.min(7, kf + 1); f++) {
    let sheltered = false;
    for (const d of [1, 2]) { const r = kr + d * step; if (r >= 0 && r <= 7 && board[r * 16 + f] === own) sheltered = true; }
    if (!sheltered) s_++;
    let o = false, e = false;
    for (let r = 0; r < 8; r++) { if (board[r * 16 + f] === own) o = true; if (board[r * 16 + f] === enemy) e = true; }
    if (!o) { if (e) h_++; else o_++; }
  }
  return { s: s_, h: h_, o: o_, q: enemyQueen };
}
const wpov = (p, v) => (p.blackToMove ? 0 - v : v);
const zero = { mg: 0, eg: 0 };
const terms = [["KING_SHELTER_MISSING", "s", 15], ["KING_FILE_HALF_OPEN", "h", 10], ["KING_FILE_OPEN", "o", 20]];
for (const row of data.rows) {
  const pos = {};
  for (const side of ["A", "B"]) {
    const fen = row[side];
    let p; try { p = parseFen(fen); } catch (e) { bad(`${row.id}${side} parse: ${e.message}`); continue; }
    pos[side] = p;
    if (toFen(p) !== fen) bad(`${row.id}${side} not canonical: ${toFen(p)}`);
    const flipped = { ...p, board: p.board.slice(), blackToMove: !p.blackToMove };
    if (isInCheck(flipped)) bad(`${row.id}${side} side not to move is in check`);
    if (isInCheck(p)) bad(`${row.id}${side} side to move is in check (kept out by design)`);
    for (const [colour, black] of [["white", false], ["black", true]]) {
      const c = counts(p.board, black), x = row.expect[side][colour];
      for (const f of ["s", "h", "o", "q"]) if (c[f] !== x[f]) bad(`${row.id}${side} ${colour} ${f}: rule ${c[f]} hand ${x[f]}`);
      if (x.sQ !== x.s * x.q || x.hQ !== x.h * x.q || x.oQ !== x.o * x.q) bad(`${row.id}${side} ${colour} queen-on arithmetic`);
      if (x.baseCp !== 15 * x.s + 10 * x.h + 20 * x.o) bad(`${row.id}${side} ${colour} baseCp`);
    }
    // main's evaluate, per term: full - zeroed = value x (black - white), white POV, both entries
    const W = row.expect[side].white, B = row.expect[side].black;
    for (const fn of ["evaluate", "evaluateWithoutTaper"]) {
      const full = wpov(p, ev[fn](p));
      for (const [name, key, val] of terms) {
        const z = wpov(p, ev.withParametersForTest({ ...P, [name]: zero }, () => ev[fn](p)));
        if (full - z !== val * (B[key] - W[key])) bad(`${row.id}${side} ${fn} ${name}: main ${full - z} hand ${val * (B[key] - W[key])}`);
      }
      const zAll = wpov(p, ev.withParametersForTest({ ...P, KING_SHELTER_MISSING: zero, KING_FILE_HALF_OPEN: zero, KING_FILE_OPEN: zero }, () => ev[fn](p)));
      if (full - zAll !== B.baseCp - W.baseCp) bad(`${row.id}${side} ${fn} all three: main ${full - zAll} hand ${B.baseCp - W.baseCp}`);
    }
    const m = mirrorPosition(p);
    if (!Object.is(ev.evaluate(p), ev.evaluate(m))) bad(`${row.id}${side} main not mirror-exact`);
  }
  if (!pos.A || !pos.B) continue;
  const diff = [];
  for (let s = 0; s < 128; s++) { if (s & 0x88) continue; if (pos.A.board[s] !== pos.B.board[s]) diff.push(s); }
  const want = [...row.removed].sort().join(","), got = diff.map(sqName).sort().join(",");
  if (want !== got) bad(`${row.id} A/B differ at ${got}, removed says ${want}`);
  for (const s of diff) {
    const a = pos.A.board[s];
    const enemyOfSubject = row.subject === "white" ? BLK : 0;
    if ((a & 7) !== QUEEN || (a & BLK) !== enemyOfSubject || pos.B.board[s] !== 0) bad(`${row.id} ${sqName(s)} is not the subject's enemy queen removed`);
  }
  if (pos.A.blackToMove !== pos.B.blackToMove || pos.A.castling !== pos.B.castling || pos.A.epSquare !== pos.B.epSquare) bad(`${row.id} A/B differ off the board`);
  if (row.mirrorOf) {
    const src = data.rows.find((r) => r.id === row.mirrorOf);
    for (const side of ["A", "B"]) if (toFen(mirrorPosition(parseFen(src[side]))) !== row[side]) bad(`${row.id}${side} is not mirrorPosition(${src.id}${side})`);
    for (const side of ["A", "B"]) for (const f of ["s", "h", "o", "q"]) if (row.expect[side].black[f] !== src.expect[side].white[f] || row.expect[side].white[f] !== src.expect[side].black[f]) bad(`${row.id}${side} mirror counts not swapped`);
  }
  // the K1 (c) arithmetic the frozen counts imply
  const subj = row.subject, other = subj === "white" ? "black" : "white";
  const a = row.expect.A, b = row.expect.B;
  if (row.kind === "pair") {
    if (a[subj].seam2xCp !== 3 * b[subj].seam2xCp) bad(`${row.id} subject seam not 3x`);
    if (a[subj].q !== 1 || b[subj].q !== 0) bad(`${row.id} subject flag not 1 -> 0`);
  } else if (a[subj].seam2xCp !== b[subj].seam2xCp) bad(`${row.id} control not equal`);
  if (a[other].seam2xCp !== b[other].seam2xCp) bad(`${row.id} other king moved`);
  for (const side of ["A", "B"]) { const e = row.expect[side];
    if (e.seamNetWpov !== 2 * (e.black.q * e.black.baseCp - e.white.q * e.white.baseCp)) bad(`${row.id}${side} seamNetWpov`); }
  const sum = (x) => `${x.sQ}/${x.hQ}/${x.oQ}`;
  console.log(`${row.id} ok-so-far=${fail === 0} A W ${sum(a.white)} B ${sum(a.black)} | B W ${sum(b.white)} B ${sum(b.black)} | seam ${subj} ${a[subj].seam2xCp} vs ${b[subj].seam2xCp}`);
}
const pairs = data.rows.filter((r) => r.kind === "pair");
const has = (f) => pairs.some((r) => ["A", "B"].some((s) => r.expect[s][r.subject][f] > 0));
if (pairs.length < 6) bad("fewer than 6 pairs");
for (const f of ["s", "h", "o"]) if (!has(f)) bad(`no pair with subject ${f} > 0`);
if (!pairs.some((r) => r.mirrorOf)) bad("no mirrored pair");
if (!pairs.some((r) => r.bothQueens)) bad("no both-queens pair");
console.log(`pairs ${pairs.length}, controls ${data.rows.length - pairs.length}, failures ${fail}`);
process.exit(fail ? 1 : 0);
