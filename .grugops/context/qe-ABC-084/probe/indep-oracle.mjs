// QE probe (qe-ABC-084, focus 1 / A6): an INDEPENDENT oracle. Imports NOTHING from src/ —
// its own 0x88 move generator (no castling: every corpus FEN has castling "-"; en passant and
// promotion implemented), validated against published perft counts before use. Reads the
// corpus as text from the path given in argv[2] (parsed with a regex, never executed).
//
// For every row: duplicates (placement + side), mate-in-1 / mate-in-2 first-move sets, and a
// material-only (P1 N3 B3 R5 Q9) negamax at 4 plies + capture quiescence ranking every root move.
// Usage: node indep-oracle.mjs <path to src/puzzle-corpus.ts>
import { readFileSync } from "node:fs";

const N = [33, 31, 18, 14, -33, -31, -18, -14];
const K = [1, -1, 16, -16, 15, 17, -15, -17];
const B = [15, 17, -15, -17];
const R = [1, -1, 16, -16];
const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const white = (p) => p !== "." && p === p.toUpperCase();
const colorOf = (p) => (p === "." ? null : white(p) ? "w" : "b");
const name = (sq) => "abcdefgh"[sq & 7] + String((sq >> 4) + 1);

function parse(fen) {
  const [placement, side, castling, ep] = fen.split(" ");
  if (castling !== "-") throw new Error(`castling not supported: ${fen}`);
  const board = new Array(128).fill(".");
  placement.split("/").forEach((row, i) => {
    let f = 0;
    for (const c of row) {
      if (/\d/.test(c)) f += Number(c);
      else board[(7 - i) * 16 + f++] = c;
    }
  });
  const epSq = ep === "-" ? -1 : (Number(ep[1]) - 1) * 16 + "abcdefgh".indexOf(ep[0]);
  return { board, side, ep: epSq };
}

function attacked(board, sq, by) {
  const own = (p) => colorOf(p) === by;
  const pd = by === "w" ? -16 : 16; // a pawn of `by` attacks sq from sq + pd ± 1
  for (const d of [pd - 1, pd + 1]) {
    const s = sq + d;
    if (!(s & 0x88) && own(board[s]) && board[s].toLowerCase() === "p") return true;
  }
  for (const d of N) {
    const s = sq + d;
    if (!(s & 0x88) && own(board[s]) && board[s].toLowerCase() === "n") return true;
  }
  for (const d of K) {
    const s = sq + d;
    if (!(s & 0x88) && own(board[s]) && board[s].toLowerCase() === "k") return true;
  }
  for (const [dirs, kinds] of [[B, "bq"], [R, "rq"]]) {
    for (const d of dirs) {
      for (let s = sq + d; !(s & 0x88); s += d) {
        if (board[s] === ".") continue;
        if (own(board[s]) && kinds.includes(board[s].toLowerCase())) return true;
        break;
      }
    }
  }
  return false;
}

const kingSq = (board, side) => board.findIndex((p) => p === (side === "w" ? "K" : "k"));
const inCheck = (pos) => attacked(pos.board, kingSq(pos.board, pos.side), pos.side === "w" ? "b" : "w");

function pseudo(pos) {
  const { board, side, ep } = pos;
  const moves = [];
  const enemy = (p) => p !== "." && colorOf(p) !== side;
  for (let sq = 0; sq < 128; sq++) {
    if (sq & 0x88) continue;
    const p = board[sq];
    if (colorOf(p) !== side) continue;
    const t = p.toLowerCase();
    if (t === "p") {
      const d = side === "w" ? 16 : -16;
      const startRank = side === "w" ? 1 : 6;
      const lastRank = side === "w" ? 7 : 0;
      const add = (to, cap, isEp = false) => {
        if (to >> 4 === lastRank) for (const pr of "qrbn") moves.push({ from: sq, to, promo: pr, cap });
        else moves.push({ from: sq, to, cap, isEp });
      };
      if (!((sq + d) & 0x88) && board[sq + d] === ".") {
        add(sq + d, false);
        if (sq >> 4 === startRank && board[sq + 2 * d] === ".") moves.push({ from: sq, to: sq + 2 * d, cap: false, dbl: true });
      }
      for (const c of [d - 1, d + 1]) {
        const to = sq + c;
        if (to & 0x88) continue;
        if (enemy(board[to])) add(to, true);
        else if (to === ep) add(to, true, true);
      }
      continue;
    }
    const slide = t === "b" || t === "r" || t === "q";
    const dirs = t === "n" ? N : t === "k" ? K : t === "b" ? B : t === "r" ? R : K;
    for (const d of dirs) {
      for (let to = sq + d; !(to & 0x88); to += d) {
        if (board[to] === ".") moves.push({ from: sq, to, cap: false });
        else {
          if (enemy(board[to])) moves.push({ from: sq, to, cap: true });
          break;
        }
        if (!slide) break;
      }
    }
  }
  return moves;
}

function make(pos, m) {
  const board = pos.board.slice();
  const piece = board[m.from];
  board[m.to] = m.promo ? (pos.side === "w" ? m.promo.toUpperCase() : m.promo) : piece;
  board[m.from] = ".";
  if (m.isEp) board[m.to + (pos.side === "w" ? -16 : 16)] = ".";
  const ep = m.dbl ? (m.from + m.to) / 2 : -1;
  return { board, side: pos.side === "w" ? "b" : "w", ep };
}

function legal(pos) {
  const out = [];
  for (const m of pseudo(pos)) {
    const next = make(pos, m);
    if (!attacked(next.board, kingSq(next.board, pos.side), next.side)) out.push(m);
  }
  return out;
}

const label = (m) => name(m.from) + name(m.to);

function perft(pos, d) {
  if (d === 0) return 1;
  let n = 0;
  for (const m of legal(pos)) n += perft(make(pos, m), d - 1);
  return n;
}

// --- mate search -------------------------------------------------------------------------
function defenderLost(pos, n) {
  const replies = legal(pos);
  if (replies.length === 0) return inCheck(pos);
  if (n <= 1) return false;
  return replies.every((r) => {
    const after = make(pos, r);
    return legal(after).some((m) => defenderLost(make(after, m), n - 1));
  });
}
const matingMoves = (pos, n) => legal(pos).filter((m) => defenderLost(make(pos, m), n)).map(label);

// --- material negamax --------------------------------------------------------------------
const MATE = 1000;
function material(pos) {
  let s = 0;
  for (let sq = 0; sq < 128; sq++) {
    if (sq & 0x88) continue;
    const p = pos.board[sq];
    if (p === ".") continue;
    s += (white(p) ? 1 : -1) * VAL[p.toLowerCase()];
  }
  return pos.side === "w" ? s : -s;
}
function qsearch(pos, alpha, beta, qd) {
  const moves = legal(pos);
  const check = inCheck(pos);
  if (moves.length === 0) return check ? -MATE : 0;
  if (!check) {
    const stand = material(pos);
    if (stand >= beta || qd <= 0) return stand;
    if (stand > alpha) alpha = stand;
  }
  for (const m of moves) {
    if (!check && !m.cap && !m.promo) continue;
    const v = -qsearch(make(pos, m), -beta, -alpha, qd - 1);
    if (v >= beta) return v;
    if (v > alpha) alpha = v;
  }
  return alpha;
}
function search(pos, depth, alpha, beta, ply) {
  const moves = legal(pos);
  if (moves.length === 0) return inCheck(pos) ? -(MATE - ply) : 0;
  if (depth === 0) return qsearch(pos, alpha, beta, 8);
  for (const m of moves) {
    const v = -search(make(pos, m), depth - 1, -beta, -alpha, ply + 1);
    if (v >= beta) return v;
    if (v > alpha) alpha = v;
  }
  return alpha;
}
function rootScores(pos, depth) {
  const base = material(pos);
  return legal(pos)
    .map((m) => ({ move: label(m), gain: -search(make(pos, m), depth - 1, -Infinity, Infinity, 1) - base }))
    .sort((a, b) => b.gain - a.gain);
}

// --- driver ------------------------------------------------------------------------------
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";
const POS3 = "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1";
const checks = [
  [START, 3, 8902], [START, 4, 197281], [POS3, 4, 43238], [POS3, 5, 674624],
];
for (const [fen, d, want] of checks) {
  const got = perft(parse(fen), d);
  console.log(`PERFT ${got === want ? "OK " : "BAD"} d${d} ${got} (want ${want}) ${fen}`);
  if (got !== want) process.exit(2);
}

const text = readFileSync(process.argv[2], "utf8");
const rows = [];
const rowRe = /\{ name: "([^"]+)", fen: "([^"]+)", (?:losing: "(\w+)"|kind: "([\w-]+)", accept: \[([^\]]*)\])/g;
for (const m of text.matchAll(rowRe)) {
  rows.push(m[3]
    ? { name: m[1], fen: m[2], kind: "do-not-hang", losing: m[3] }
    : { name: m[1], fen: m[2], kind: m[4], accept: [...m[5].matchAll(/"(\w+)"/g)].map((x) => x[1]) });
}
console.log(`ROWS ${rows.length}: ${["mate-in-2", "win-material", "do-not-hang"].map((k) => `${k} ${rows.filter((r) => r.kind === k).length}`).join(", ")}`);

const seen = new Map();
for (const r of rows) {
  const key = r.fen.split(" ").slice(0, 2).join(" ");
  if (seen.has(key)) console.log(`DUPLICATE ${r.name} == ${seen.get(key)}`);
  seen.set(key, r.name);
}
console.log(`DISTINCT positions ${seen.size} of ${rows.length}`);

let bad = 0;
for (const r of rows) {
  const pos = parse(r.fen);
  const t0 = performance.now();
  const m1 = matingMoves(pos, 1);
  const m2 = matingMoves(pos, 2).sort();
  const scores = rootScores(pos, 4);
  const best = scores[0].gain;
  const top = scores.filter((s) => s.gain === best).map((s) => s.move).sort();
  const next = scores.find((s) => s.gain < best);
  const ms = (performance.now() - t0).toFixed(0);
  const check = inCheck(pos) ? " IN-CHECK" : "";
  let verdict;
  if (r.kind === "mate-in-2") {
    const ok = m1.length === 0 && JSON.stringify(m2) === JSON.stringify([...r.accept].sort());
    verdict = `${ok ? "OK " : "BAD"} mate1=[${m1}] mate2=[${m2}] accept=[${[...r.accept].sort()}]`;
    if (!ok) bad++;
  } else if (r.kind === "win-material") {
    const ok = m1.length === 0 && m2.length === 0 && JSON.stringify(top) === JSON.stringify([...r.accept].sort()) && best > 0;
    verdict = `${ok ? "OK " : "BAD"} best=+${best} top=[${top}] accept=[${[...r.accept].sort()}] next=${next ? `${next.move}:${next.gain}` : "-"} mate1=[${m1}] mate2=[${m2}]`;
    if (!ok) bad++;
  } else {
    const lose = scores.find((s) => s.move === r.losing);
    const ok = lose !== undefined && lose.gain < best && lose.gain < 0 && m1.length === 0;
    verdict = `${ok ? "OK " : "BAD"} losing=${r.losing}:${lose?.gain} best=${scores[0].move}:${best} deficit=${lose ? best - lose.gain : "?"} mate1=[${m1}] mate2=[${m2}]`;
    if (!ok) bad++;
  }
  console.log(`${r.kind}\t${verdict}${check}\t${ms}ms\t${r.name}`);
}
console.log(`RESULT ${bad === 0 ? "ALL OK" : `${bad} BAD`} over ${rows.length} rows`);
