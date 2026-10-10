// ABC-127 curation oracle. INDEPENDENT of src/: the move generator is QE's qe-ABC-084 probe
// (indep-oracle.mjs, 0x88, perft-checked), copied as a library. Imports nothing from src/.
export const N = [33, 31, 18, 14, -33, -31, -18, -14];
const K = [1, -1, 16, -16, 15, 17, -15, -17];
const B = [15, 17, -15, -17];
const R = [1, -1, 16, -16];
const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const white = (p) => p !== "." && p === p.toUpperCase();
const colorOf = (p) => (p === "." ? null : white(p) ? "w" : "b");
export const name = (sq) => "abcdefgh"[sq & 7] + String((sq >> 4) + 1);

export function parse(fen) {
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

export function toFen(pos) {
  const rows = [];
  for (let r = 7; r >= 0; r--) {
    let s = "", e = 0;
    for (let f = 0; f < 8; f++) {
      const p = pos.board[r * 16 + f];
      if (p === ".") e++;
      else { if (e) s += e; e = 0; s += p; }
    }
    if (e) s += e;
    rows.push(s);
  }
  return `${rows.join("/")} ${pos.side} - - 0 1`;
}

export function attacked(board, sq, by) {
  const own = (p) => colorOf(p) === by;
  const pd = by === "w" ? -16 : 16;
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
export const inCheck = (pos) => attacked(pos.board, kingSq(pos.board, pos.side), pos.side === "w" ? "b" : "w");
export const otherInCheck = (pos) => attacked(pos.board, kingSq(pos.board, pos.side === "w" ? "b" : "w"), pos.side);

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

export function make(pos, m) {
  const board = pos.board.slice();
  const piece = board[m.from];
  board[m.to] = m.promo ? (pos.side === "w" ? m.promo.toUpperCase() : m.promo) : piece;
  board[m.from] = ".";
  if (m.isEp) board[m.to + (pos.side === "w" ? -16 : 16)] = ".";
  const ep = m.dbl ? (m.from + m.to) / 2 : -1;
  return { board, side: pos.side === "w" ? "b" : "w", ep };
}

export function legal(pos) {
  const out = [];
  for (const m of pseudo(pos)) {
    const next = make(pos, m);
    if (!attacked(next.board, kingSq(next.board, pos.side), next.side)) out.push(m);
  }
  return out;
}

export const label = (m) => name(m.from) + name(m.to);

export function perft(pos, d) {
  if (d === 0) return 1;
  let n = 0;
  for (const m of legal(pos)) n += perft(make(pos, m), d - 1);
  return n;
}

// mate search: exact, exhaustive. A last-level attacker move must give check (pre-filter, same answer).
export function defenderLost(pos, n) {
  const replies = legal(pos);
  if (replies.length === 0) return inCheck(pos);
  if (n <= 1) return false;
  return replies.every((r) => {
    const after = make(pos, r);
    return legal(after).some((m) => {
      const next = make(after, m);
      if (n - 1 === 1 && !inCheck(next)) return false;
      return defenderLost(next, n - 1);
    });
  });
}
export const matingMoves = (pos, n) =>
  legal(pos).filter((m) => { const next = make(pos, m); return (n > 1 || inCheck(next)) && defenderLost(next, n); }).map(label);

// material negamax (P1 N3 B3 R5 Q9), 4 plies + capture quiescence — ABC-084's definition.
const MATE = 1000;
export function material(pos) {
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
export function rootScores(pos, depth = 4) {
  const base = material(pos);
  return legal(pos)
    .map((m) => ({ move: label(m), m, gain: -search(make(pos, m), depth - 1, -Infinity, Infinity, 1) - base }))
    .sort((a, b) => b.gain - a.gain);
}
export function quiet(pos, m) {
  return !m.cap && !m.promo && !inCheck(make(pos, m));
}
// mirror-normalised key: placement + side, and its colour mirror
export function mirrorFen(fen) {
  const [placement, side] = fen.split(" ");
  const swap = (c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());
  const m = placement.split("/").reverse().map((r) => r.replace(/[a-zA-Z]/g, swap)).join("/");
  return `${m} ${side === "w" ? "b" : "w"}`;
}

// Faster exact form of the same definition: the best gain by alpha-beta (captures tried first, which
// changes no value), then a null-window test per root move for membership of the best set and for
// "within `gap` of best". Same numbers as rootScores; cross-checked on every curated row.
const VALS = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
function ord(pos, moves) {
  return moves.map((m) => ({ m, k: m.cap ? 10 * VALS[(pos.board[m.to] === "." ? "p" : pos.board[m.to]).toLowerCase()] - VALS[pos.board[m.from].toLowerCase()] : -100 })).sort((a, b) => b.k - a.k).map((x) => x.m);
}
function qs2(pos, alpha, beta, qd) {
  const moves = legal(pos);
  const check = inCheck(pos);
  if (moves.length === 0) return check ? -MATE : 0;
  if (!check) {
    const stand = material(pos);
    if (stand >= beta || qd <= 0) return stand;
    if (stand > alpha) alpha = stand;
  }
  for (const m of ord(pos, moves)) {
    if (!check && !m.cap && !m.promo) continue;
    const v = -qs2(make(pos, m), -beta, -alpha, qd - 1);
    if (v >= beta) return v;
    if (v > alpha) alpha = v;
  }
  return alpha;
}
function s2(pos, depth, alpha, beta, ply) {
  const moves = legal(pos);
  if (moves.length === 0) return inCheck(pos) ? -(MATE - ply) : 0;
  if (depth === 0) return qs2(pos, alpha, beta, 8);
  for (const m of ord(pos, moves)) {
    const v = -s2(make(pos, m), depth - 1, -beta, -alpha, ply + 1);
    if (v >= beta) return v;
    if (v > alpha) alpha = v;
  }
  return alpha;
}
export function materialBest(pos, depth = 4, gapWanted = 2) {
  const base = material(pos);
  const moves = ord(pos, legal(pos));
  let best = -Infinity;
  for (const m of moves) {
    const v = -s2(make(pos, m), depth - 1, -Infinity, -best, 1);
    if (v > best) best = v;
  }
  const set = [], near = [];
  for (const m of moves) {
    const child = make(pos, m);
    // score >= best  <=>  -s2(child) >= best  <=>  s2(child, -best, -best+1) <= -best
    if (-s2(child, depth - 1, -best, -best + 1, 1) >= best) set.push(m);
    else if (-s2(child, depth - 1, -(best - gapWanted + 1), -(best - gapWanted + 1) + 1, 1) >= best - gapWanted + 1) near.push(m);
  }
  return { gain: best - base, set, setLabels: [...new Set(set.map(label))].sort(), gapOk: near.length === 0 };
}

// Material that a game can reach without promotion: Q<=1, R/B/N<=2, P<=8, bishops on both colours.
export function plausible(pos) {
  for (const side of ["w", "b"]) {
    const c = {}; const bcol = new Set();
    for (let sq = 0; sq < 128; sq++) {
      if (sq & 0x88) continue;
      const p = pos.board[sq];
      if (p === "." || (side === "w") !== (p === p.toUpperCase())) continue;
      const t = p.toLowerCase(); c[t] = (c[t] ?? 0) + 1;
      if (t === "b") bcol.add(((sq >> 4) + (sq & 7)) % 2);
    }
    if ((c.q ?? 0) > 1 || (c.r ?? 0) > 2 || (c.n ?? 0) > 2 || (c.b ?? 0) > 2 || (c.p ?? 0) > 8) return false;
    if ((c.b ?? 0) === 2 && bcol.size < 2) return false;
  }
  return true;
}
