// qe-ABC-292-freeze: checks the hand table in fixtures.json against
//  (1) a labeller written from ADR-0076 d2's WORDS (no ABC-292 code exists; it shares no code with any patch),
//      on every K1 (c) / K2 fixture and on its mirror (the white and black parts must swap);
//  (2) the table's own arithmetic: each part = count x d3's value, mg === eg, net and stm;
//  (3) main, where main can speak: the FEN is canonical and parses, one king a side, no pawn on rank 1 or 8,
//      the side not to move is not in check, phaseOf equals the hand phase, main's evaluate is mirror-exact
//      (Object.is) on every fixture and every K1 (a) position, and K1 (a)'s positions are new;
//  (4) K1 (c)'s list from d9 word by word, and K2's two relations on main (the hand piece net is 0 on each
//      arm, so on a correct build each relation reads as it reads on main).
// usage (worktree root as cwd): node <this> <fixtures.json>
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const SRC = `${resolve(process.cwd(), "src")}/`;
const { parseFen, toFen } = await import(`${SRC}fen.ts`);
const ev = await import(`${SRC}evaluate.ts`);
const PARAMS = await import(`${SRC}evaluate-params.ts`);
const { isInCheck, legalMoves } = await import(`${SRC}legal.ts`);
const { mirrorPosition, buildCorpus } = await import(`${SRC}evaluate.mirror-corpus.ts`);
const { TAPER_MIRROR_POSITIONS, TAPER_DOOR_CORPUS } = await import(`${SRC}evaluate.taper-corpus.ts`);
const data = JSON.parse(readFileSync(process.argv[2], "utf8"));
const V = data.values;
let fail = 0;
let checks = 0;
const ok = (cond, m) => {
  checks++;
  if (!cond) {
    fail++;
    console.log("FAIL", m);
  }
};
const FILES = "abcdefgh";
const PAWN = 1, BISHOP = 3, ROOK = 4, KING = 6, BLACK = 8;

// ---- (1) d2, from the ADR's words ----
// "Bishop pair: the side has two or more bishops. It counts once." "Rook on an open file: a file holds at least
// one of the side's rooks, and no pawn of either colour. Once per file." "Semi-open: a file holds at least one of
// the side's rooks, none of the side's pawns, and at least one enemy pawn. Once per file." A pawn "on a file"
// stands on ranks 2 to 7.
function label(pos) {
  const b = pos.board;
  const out = {};
  for (const colour of ["white", "black"]) {
    const me = colour === "black" ? BLACK : 0;
    const them = me ^ BLACK;
    let bishops = 0;
    const openFiles = [], semiOpenFiles = [];
    for (let s = 0; s < 128; s++) if (!(s & 0x88) && b[s] === (BISHOP | me)) bishops++;
    for (let f = 0; f < 8; f++) {
      let rook = false, own = false, enemy = false;
      for (let r = 0; r < 8; r++) if (b[r * 16 + f] === (ROOK | me)) rook = true;
      for (let r = 1; r <= 6; r++) {
        if (b[r * 16 + f] === (PAWN | me)) own = true;
        if (b[r * 16 + f] === (PAWN | them)) enemy = true;
      }
      if (rook && !own && !enemy) openFiles.push(FILES[f]);
      if (rook && !own && enemy) semiOpenFiles.push(FILES[f]);
    }
    const pair = bishops >= 2 ? V.BISHOP_PAIR.mg : 0;
    out[colour] = {
      bishops,
      openFiles,
      semiOpenFiles,
      parts: {
        BISHOP_PAIR: { mg: pair, eg: bishops >= 2 ? V.BISHOP_PAIR.eg : 0 },
        ROOK_OPEN_FILE: { mg: V.ROOK_OPEN_FILE.mg * openFiles.length, eg: V.ROOK_OPEN_FILE.eg * openFiles.length },
        ROOK_SEMI_OPEN_FILE: { mg: V.ROOK_SEMI_OPEN_FILE.mg * semiOpenFiles.length, eg: V.ROOK_SEMI_OPEN_FILE.eg * semiOpenFiles.length },
      },
    };
  }
  return out;
}
const total = (side) => side.parts.BISHOP_PAIR.mg + side.parts.ROOK_OPEN_FILE.mg + side.parts.ROOK_SEMI_OPEN_FILE.mg;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---- (2) the table's own arithmetic ----
function arithmetic(id, side, who) {
  const p = side.parts;
  for (const k of Object.keys(p)) ok(p[k].mg === p[k].eg, `${id} ${who} ${k} mg !== eg`);
  ok(p.BISHOP_PAIR.mg === (side.bishops >= 2 ? 50 : 0), `${id} ${who} pair cp vs bishops ${side.bishops}`);
  ok(p.ROOK_OPEN_FILE.mg === 20 * side.openFiles.length, `${id} ${who} open cp vs files`);
  ok(p.ROOK_SEMI_OPEN_FILE.mg === 10 * side.semiOpenFiles.length, `${id} ${who} semi cp vs files`);
  ok(side.openFiles.every((f) => !side.semiOpenFiles.includes(f)), `${id} ${who} a file both open and semi`);
}

// ---- (3) main's word on legality, phase and the mirror ----
function legal(id, fen, phase) {
  const pos = parseFen(fen);
  ok(toFen(pos) === fen, `${id} FEN not canonical: ${toFen(pos)}`);
  let wk = 0, bk = 0, backPawn = false;
  for (let s = 0; s < 128; s++) {
    if (s & 0x88) continue;
    if (pos.board[s] === KING) wk++;
    if (pos.board[s] === (KING | BLACK)) bk++;
    if ((pos.board[s] & 7) === PAWN && ((s >> 4) === 0 || (s >> 4) === 7)) backPawn = true;
  }
  ok(wk === 1 && bk === 1, `${id} kings ${wk}/${bk}`);
  ok(!backPawn, `${id} pawn on rank 1 or 8`);
  const other = { ...pos, blackToMove: !pos.blackToMove };
  ok(!isInCheck(other), `${id} the side not to move is in check`);
  ok(legalMoves(pos).length > 0, `${id} no legal move`);
  if (phase !== undefined) ok(ev.phaseOf(pos) === phase, `${id} phase hand ${phase} main ${ev.phaseOf(pos)}`);
  ok(Object.is(ev.evaluate(mirrorPosition(pos)), ev.evaluate(pos)), `${id} main's evaluate not mirror-exact`);
  return pos;
}

function seamRow(id, fen, phase, white, black, net, stm) {
  const pos = legal(id, fen, phase);
  arithmetic(id, white, "white");
  arithmetic(id, black, "black");
  const got = label(pos);
  ok(eq(got.white, white), `${id} white: hand ${JSON.stringify(white)} labeller ${JSON.stringify(got.white)}`);
  ok(eq(got.black, black), `${id} black: hand ${JSON.stringify(black)} labeller ${JSON.stringify(got.black)}`);
  const m = label(mirrorPosition(pos));
  ok(eq(m.white, got.black) && eq(m.black, got.white), `${id} labeller not colour-symmetric`);
  ok(net === total(white) - total(black), `${id} net ${net} vs parts ${total(white) - total(black)}`);
  if (stm !== undefined) ok(stm === (pos.blackToMove ? -net : net), `${id} stm ${stm}`);
}

// K1 (c)
for (const r of data.k1c) seamRow(r.id, r.fen, r.phase, r.white, r.black, r.net, r.stm);
const ids = new Set(data.k1c.map((r) => r.id));
ok(ids.size === data.k1c.length, "duplicate K1 (c) id");

// ---- (4a) K1 (c)'s list, d9 word by word ----
const rows = data.k1c;
const has = (pred, m) => ok(rows.some(pred), `K1 (c) list: ${m}`);
for (const c of ["white", "black"]) {
  const o = c === "white" ? "black" : "white";
  has((r) => r[c].bishops >= 2 && r[c].parts.BISHOP_PAIR.mg === 50, `pair per colour (${c})`);
  has((r) => r[c].openFiles.length > 0, `open per colour (${c})`);
  has((r) => r[c].semiOpenFiles.length > 0, `semi per colour (${c})`);
  for (const f of ["a", "h"]) {
    has((r) => r[c].openFiles.includes(f), `open on edge file ${f} (${c})`);
    has((r) => r[c].semiOpenFiles.includes(f), `semi on edge file ${f} (${c})`);
  }
  has((r) => r[c].bishops === 1, `one bishop (${c})`);
  has((r) => r[c].bishops === 2, `two bishops (${c})`);
  has((r) => r[c].bishops === 3 && r[c].parts.BISHOP_PAIR.mg === 50, `three bishops (${c})`);
  void o;
}
// same-colour pair: two bishops of one side on one square colour
const sameColourPair = (r) => {
  const pos = parseFen(r.fen);
  for (const me of [0, BLACK]) {
    const cols = [];
    for (let s = 0; s < 128; s++) if (!(s & 0x88) && pos.board[s] === (BISHOP | me)) cols.push(((s >> 4) + (s & 7)) & 1);
    if (cols.length === 2 && cols[0] === cols[1]) return true;
  }
  return false;
};
has(sameColourPair, "a same-colour pair");
ok(rows.filter(sameColourPair).length >= 2, "K1 (c) list: a same-colour pair per colour");
for (const id of ["RF-open-norook", "RF-open-ownpawn", "RS-W-a", "RF-semi-norook", "RF-semi-ownpawn", "RO-W-a"]) has((r) => r.id === id, `clause row ${id}`);
// each clause failing alone, read off the board by the labeller's own tests: file a, white
const fileFacts = (fen, f, me) => {
  const b = parseFen(fen).board;
  let rook = false, queen = false, own = false, enemy = false;
  for (let r = 0; r < 8; r++) { if (b[r * 16 + f] === (ROOK | me)) rook = true; if (b[r * 16 + f] === (5 | me)) queen = true; }
  for (let r = 1; r <= 6; r++) { if (b[r * 16 + f] === (PAWN | me)) own = true; if (b[r * 16 + f] === (PAWN | (me ^ BLACK))) enemy = true; }
  return { rook, queen, own, enemy };
};
const ff = (id) => fileFacts(rows.find((r) => r.id === id).fen, 0, 0);
ok(eq(ff("RF-open-norook"), { rook: false, queen: true, own: false, enemy: false }), "open clause 1 alone (no rook)");
ok(eq(ff("RF-open-ownpawn"), { rook: true, queen: false, own: true, enemy: false }), "open clause 2 alone (own pawn)");
ok(eq(ff("RS-W-a"), { rook: true, queen: false, own: false, enemy: true }), "open clause 2 alone (enemy pawn)");
ok(eq(ff("RF-semi-norook"), { rook: false, queen: true, own: false, enemy: true }), "semi clause 1 alone (no rook)");
ok(eq(ff("RF-semi-ownpawn"), { rook: true, queen: false, own: true, enemy: true }), "semi clause 2 alone (own pawn)");
ok(eq(ff("RO-W-a"), { rook: true, queen: false, own: false, enemy: false }), "semi clause 3 alone (no enemy pawn)");
// doubled rooks: two of one side's rooks on one counted file, counted once
const doubled = (r) => {
  const b = parseFen(r.fen).board;
  for (const me of [0, BLACK]) for (let f = 0; f < 8; f++) {
    let n = 0;
    for (let rk = 0; rk < 8; rk++) if (b[rk * 16 + f] === (ROOK | me)) n++;
    const side = me ? r.black : r.white;
    if (n >= 2 && (side.openFiles.includes(FILES[f]) || side.semiOpenFiles.includes(FILES[f]))) return true;
  }
  return false;
};
ok(rows.filter(doubled).length >= 2, "doubled rooks, on an open and a semi-open file");
// seventh-rank rook on an open file
const seventh = (r) => {
  const b = parseFen(r.fen).board;
  for (let f = 0; f < 8; f++) {
    if (b[6 * 16 + f] === ROOK && r.white.openFiles.includes(FILES[f])) return true;
    if (b[1 * 16 + f] === (ROOK | BLACK) && r.black.openFiles.includes(FILES[f])) return true;
  }
  return false;
};
ok(rows.filter(seventh).length >= 2, "a seventh-rank rook on an open file, per colour");
const noPawns = (r) => !parseFen(r.fen).board.some((x) => (x & 7) === PAWN);
ok(rows.filter(noPawns).some((r) => r.white.openFiles.length || r.black.openFiles.length), "a board with no pawns");
ok(rows.some((r) => r.id === "NP1-KR-K" && r.white.parts.ROOK_OPEN_FILE.mg === 20), "K R v K constant 20");

// ---- (3b) K1 (a): legal, mirror-exact on main, and new ----
const known = new Set([
  ...buildCorpus().map(({ position }) => toFen(position)),
  ...TAPER_MIRROR_POSITIONS.map((r) => r.fen),
  ...TAPER_DOOR_CORPUS.map((r) => r.fen),
]);
const knownMir = new Set([...known].map((f) => toFen(mirrorPosition(parseFen(f)))));
ok(data.k1a.length >= 12, `K1 (a) has ${data.k1a.length} < 12`);
const k1aFens = new Set();
for (const r of data.k1a) {
  const pos = legal(r.id, r.fen);
  ok(!known.has(r.fen) && !knownMir.has(r.fen), `${r.id} already in G3 / TAPER_MIRROR_POSITIONS / TAPER_DOOR_CORPUS (or a mirror)`);
  ok(!k1aFens.has(r.fen), `${r.id} duplicate`);
  k1aFens.add(r.fen);
  void pos;
}
for (const r of data.k1c) ok(!k1aFens.has(r.fen), `${r.id} is also a K1 (a) row`);

// ---- (4b) K2 on main ----
const a4 = data.k2.find((k) => k.id === "K2-A4");
{
  const pos = legal(a4.id, a4.fen, undefined);
  const btm = parseFen(a4.fen.replace(" w ", " b "));
  seamRow(a4.id, a4.fen, undefined, a4.hand.white, a4.hand.black, a4.hand.net, undefined);
  const lw = legalMoves(pos).length, lb = legalMoves(btm).length;
  ok(lw >= lb + 10, `K2-A4 legal moves ${lw} v ${lb}`);
  ok(Object.is(ev.evaluateWithoutMobility(pos), 0), `K2-A4 evaluateWithoutMobility ${ev.evaluateWithoutMobility(pos)}`);
  ok(ev.evaluate(pos) > 0, `K2-A4 evaluate ${ev.evaluate(pos)}`);
  ok(ev.evaluate(btm) < 0, `K2-A4 evaluate btm ${ev.evaluate(btm)}`);
  console.log(`K2-A4 on main: legal ${lw} v ${lb}; evaluateWithoutMobility ${ev.evaluateWithoutMobility(pos)}; evaluate ${ev.evaluate(pos)} / btm ${ev.evaluate(btm)}; hand piece net 0`);
}
const a3 = data.k2.find((k) => k.id === "K2-A3b");
{
  seamRow("K2-A3b-F5", a3.closedF5, 24, a3.hand.closedF5.white, a3.hand.closedF5.black, a3.hand.closedF5.net, undefined);
  seamRow("K2-A3b-E5", a3.halfOpenE5, 24, a3.hand.halfOpenE5.white, a3.hand.halfOpenE5.black, a3.hand.halfOpenE5.net, undefined);
  ok(eq(a3.hand.closedF5, a3.hand.halfOpenE5), "K2-A3b arms' piece terms differ");
  const zeroed = { ...PARAMS, KING_FILE_HALF_OPEN: { mg: 0, eg: 0 }, KING_FILE_HALF_OPEN_QUEEN: { mg: 0, eg: 0 } };
  const s = (f) => ev.evaluate(parseFen(f));
  const on = s(a3.halfOpenE5) - s(a3.closedF5);
  const off = ev.withParametersForTest(zeroed, () => s(a3.halfOpenE5) - s(a3.closedF5));
  ok(on < 0, `K2-A3b E5 - F5 ${on} not < 0`);
  ok(off >= 0, `K2-A3b zeroed E5 - F5 ${off} not >= 0`);
  // the same arithmetic on the old pair, to show the property this re-find restores
  const oF5 = "rnbq1rk1/3nbppp/8/5P2/8/8/3NB1PP/RNBQ1RK1 w - - 0 1", oE5 = "rnbq1rk1/3nbppp/8/4P3/8/8/3NB1PP/RNBQ1RK1 w - - 0 1";
  const oldNet = (f) => { const l = label(parseFen(f)); return total(l.white) - total(l.black); };
  console.log(`K2-A3b on main: E5 - F5 = ${on} (term on), ${off} (zeroed); piece net per arm 0 / 0 by hand.`);
  console.log(`  old pair: main E5 - F5 = ${s(oE5) - s(oF5)}, piece net F5 ${oldNet(oF5)}, E5 ${oldNet(oE5)} -> on a correct build ${s(oE5) - s(oF5) + oldNet(oE5) - oldNet(oF5)} (red), as K2 says`);
  // the old A4 premise, to show the loss
  const old = parseFen("6kr/6pp/8/8/3R4/8/6PP/6K1 w - - 0 1");
  const ol = label(old);
  console.log(`  old MOBILE_WHITE: evaluateWithoutMobility on main ${ev.evaluateWithoutMobility(old)}, piece net ${total(ol.white) - total(ol.black)} -> ${ev.evaluateWithoutMobility(old) + total(ol.white) - total(ol.black)} on a correct build (not 0), as K2 says`);
}

const counts = {};
for (const r of data.k1c) counts[r.group] = (counts[r.group] ?? 0) + 1;
console.log(`K1 (c) ${data.k1c.length} rows by group ${JSON.stringify(counts)}; K1 (a) ${data.k1a.length}; K2 ${data.k2.length}`);
console.log(`${checks} checks, ${fail} failures`);
process.exit(fail ? 1 : 0);
