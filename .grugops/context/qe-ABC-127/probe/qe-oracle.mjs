// qe-ABC-127 (A2): QE's OWN answer oracle, written for this review. Imports NOTHING from src/ and
// shares no code with QE-084's indep-oracle.mjs (which the build's curation oracle reuses): a fresh
// 64-square mailbox generator (a1 = 0 … h8 = 63, pieces as FEN letters, copy-make), with en passant
// and promotion; no castling (every row has castling "-", so none can arise). It is perft-checked
// against published counts before any row is judged; a perft mismatch aborts the run.
//
// For each answered row of the corpus (read as TEXT from argv[2], parsed by regex, never executed):
// - mate-in-2 / mate-in-3 (n): the set of first moves that force mate within n; red unless it
//   equals `accept` exactly AND no first move forces mate within n - 1.
// - win-material: ABC-084's rule — material only (P1 N3 B3 R5 Q9), 4 plies full width, then a
//   capture search to 8 plies (stand pat unless in check; in check every evasion; promotions
//   count as captures; mated in the capture search -1000, mated at full width -(1000 - ply);
//   stalemate 0). Each root move gets its EXACT score (full window); red unless `accept` equals
//   exactly the set of best-scoring moves and the gain is > 0. Also reported for the new rows,
//   the curation claims: gain >= 2, the runner-up >= 2 behind, no mate within 2.
// Also: the quiet-key property of every `quiet-key` row; duplicates and colour mirrors over (placement, side), and the two ADR-0033 rules a random
// placement can break (pawn on rank 1/8; side NOT to move in check).
// Usage: node qe-oracle.mjs <path to src/puzzle-corpus.ts> [name-substring filter]
import { readFileSync } from "node:fs";

const FILES = "abcdefgh";
const sqName = (s) => `${FILES[s & 7]}${(s >> 3) + 1}`;
const isW = (p) => p !== "." && p === p.toUpperCase();
const isB = (p) => p !== "." && p === p.toLowerCase();
const own = (p, white) => (white ? isW(p) : isB(p));
const enemy = (p, white) => (white ? isB(p) : isW(p));

function parse(fen) {
  const [placement, side, castling, ep] = fen.split(" ");
  if (castling !== "-") throw new Error(`castling not supported: ${fen}`);
  const b = new Array(64).fill(".");
  placement.split("/").forEach((row, i) => {
    let f = 0;
    for (const c of row) {
      if (/\d/.test(c)) f += Number(c);
      else b[(7 - i) * 8 + f++] = c;
    }
  });
  const epSq = ep === "-" ? -1 : FILES.indexOf(ep[0]) + (Number(ep[1]) - 1) * 8;
  return { b, white: side === "w", ep: epSq };
}

const KN = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
const KG = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const ORTH = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const at = (f, r) => (f >= 0 && f < 8 && r >= 0 && r < 8 ? r * 8 + f : -1);

/** Is square `s` attacked by the side `byWhite`? */
function attacked(b, s, byWhite) {
  const f = s & 7, r = s >> 3;
  const P = byWhite ? "P" : "p", N = byWhite ? "N" : "n", K = byWhite ? "K" : "k";
  const BQ = byWhite ? "BQ" : "bq", RQ = byWhite ? "RQ" : "rq";
  const pr = byWhite ? r - 1 : r + 1; // a white pawn attacking s stands one rank below
  for (const df of [-1, 1]) { const t = at(f + df, pr); if (t >= 0 && b[t] === P) return true; }
  for (const [df, dr] of KN) { const t = at(f + df, r + dr); if (t >= 0 && b[t] === N) return true; }
  for (const [df, dr] of KG) { const t = at(f + df, r + dr); if (t >= 0 && b[t] === K) return true; }
  for (const [dirs, set] of [[DIAG, BQ], [ORTH, RQ]]) {
    for (const [df, dr] of dirs) {
      for (let k = 1; ; k++) {
        const t = at(f + df * k, r + dr * k);
        if (t < 0) break;
        if (b[t] !== ".") { if (set.includes(b[t])) return true; break; }
      }
    }
  }
  return false;
}

const kingSq = (b, white) => b.indexOf(white ? "K" : "k");
const inCheck = (pos) => attacked(pos.b, kingSq(pos.b, pos.white), !pos.white);

function pseudo(pos) {
  const { b, white, ep } = pos;
  const out = [];
  // A king is never captured: in a legal game it cannot happen, and in an ILLEGAL row (side not to
  // move in check — the ADR-0033 defect two ABC-084 rows carry, routed to ABC-126) a king capture
  // would make the material score meaningless. Such rows are reported by the LEGALITY lines below.
  const add = (from, to, promo = "") => b[to].toLowerCase() !== "k" && out.push({ from, to, promo, cap: b[to] !== "." || (to === ep && b[from].toLowerCase() === "p") });
  for (let s = 0; s < 64; s++) {
    const p = b[s];
    if (!own(p, white)) continue;
    const f = s & 7, r = s >> 3, t = p.toLowerCase();
    if (t === "p") {
      const dir = white ? 1 : -1, start = white ? 1 : 6, last = white ? 7 : 0;
      const push = (from, to) => (to >> 3 === last ? ["q", "r", "b", "n"].forEach((x) => add(from, to, x)) : add(from, to));
      const one = at(f, r + dir);
      if (one >= 0 && b[one] === ".") {
        push(s, one);
        const two = at(f, r + 2 * dir);
        if (r === start && b[two] === ".") add(s, two);
      }
      for (const df of [-1, 1]) {
        const c = at(f + df, r + dir);
        if (c < 0) continue;
        if (enemy(b[c], white)) push(s, c);
        else if (c === ep) add(s, c);
      }
    } else if (t === "n" || t === "k") {
      for (const [df, dr] of t === "n" ? KN : KG) {
        const to = at(f + df, r + dr);
        if (to >= 0 && !own(b[to], white)) add(s, to);
      }
    } else {
      const dirs = t === "b" ? DIAG : t === "r" ? ORTH : [...DIAG, ...ORTH];
      for (const [df, dr] of dirs) {
        for (let k = 1; ; k++) {
          const to = at(f + df * k, r + dr * k);
          if (to < 0 || own(b[to], white)) break;
          add(s, to);
          if (b[to] !== ".") break;
        }
      }
    }
  }
  return out;
}

function make(pos, m) {
  const b = pos.b.slice();
  const p = b[m.from];
  const pawn = p.toLowerCase() === "p";
  if (pawn && m.to === pos.ep) b[m.to + (pos.white ? -8 : 8)] = "."; // en passant victim
  b[m.to] = m.promo ? (pos.white ? m.promo.toUpperCase() : m.promo) : p;
  b[m.from] = ".";
  const ep = pawn && Math.abs(m.to - m.from) === 16 ? (m.to + m.from) / 2 : -1;
  return { b, white: !pos.white, ep };
}

function legal(pos) {
  return pseudo(pos).filter((m) => {
    const n = make(pos, m);
    return !attacked(n.b, kingSq(n.b, pos.white), !pos.white);
  });
}

const label = (m) => `${sqName(m.from)}${sqName(m.to)}`;

function perft(pos, d) {
  if (d === 0) return 1;
  const ms = legal(pos);
  if (d === 1) return ms.length;
  let n = 0;
  for (const m of ms) n += perft(make(pos, m), d - 1);
  return n;
}

// --- mate within n ---------------------------------------------------------------------------
/** After the attacker's move: the defender (to move) is mated now, or every reply allows mate within n - 1. */
function defenderLoses(pos, n) {
  const replies = legal(pos);
  if (replies.length === 0) return inCheck(pos);
  if (n <= 1) return false;
  for (const r of replies) {
    const after = make(pos, r);
    if (!legal(after).some((m) => defenderLoses(make(after, m), n - 1))) return false;
  }
  return true;
}
const mateSet = (pos, n) => [...new Set(legal(pos).filter((m) => defenderLoses(make(pos, m), n)).map(label))].sort();

// --- material (ABC-084's rule) ---------------------------------------------------------------
const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const MATE = 1000;
function material(pos) {
  let s = 0;
  for (const p of pos.b) if (p !== ".") s += (isW(p) ? 1 : -1) * VAL[p.toLowerCase()];
  return pos.white ? s : -s;
}
function capSearch(pos, alpha, beta, n) {
  const ms = legal(pos);
  const chk = inCheck(pos);
  if (ms.length === 0) return chk ? -MATE : 0;
  if (!chk) {
    const stand = material(pos);
    if (stand >= beta || n <= 0) return stand;
    if (stand > alpha) alpha = stand;
  }
  for (const m of ms) {
    if (!chk && !m.cap && !m.promo) continue;
    const v = -capSearch(make(pos, m), -beta, -alpha, n - 1);
    if (v >= beta) return v;
    if (v > alpha) alpha = v;
  }
  return alpha;
}
function fullWidth(pos, depth, alpha, beta, ply) {
  const ms = legal(pos);
  if (ms.length === 0) return inCheck(pos) ? -(MATE - ply) : 0;
  if (depth === 0) return capSearch(pos, alpha, beta, 8);
  for (const m of ms) {
    const v = -fullWidth(make(pos, m), depth - 1, -beta, -alpha, ply + 1);
    if (v >= beta) return v;
    if (v > alpha) alpha = v;
  }
  return alpha;
}
function materialScores(pos) {
  const base = material(pos);
  return legal(pos)
    .map((m) => ({ move: label(m), gain: -fullWidth(make(pos, m), 3, -Infinity, Infinity, 1) - base }))
    .sort((a, b) => b.gain - a.gain);
}

// --- perft check first -----------------------------------------------------------------------
const PERFT = [
  ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1", [20, 400, 8902, 197281]], // castling unreachable in 4 plies
  ["8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", [14, 191, 2812, 43238, 674624]], // CPW position 3 (en passant, pins)
  ["n1n5/PPPk4/8/8/8/8/4Kppp/5N1N b - - 0 1", [24, 496, 9483, 182838]], // promotion stress test
];
for (const [fen, want] of PERFT) {
  want.forEach((w, i) => {
    const got = perft(parse(fen), i + 1);
    console.log(`PERFT ${got === w ? "ok" : "MISMATCH"}\td${i + 1}\t${got}\t(want ${w})\t${fen}`);
    if (got !== w) process.exit(3);
  });
}

// --- the corpus ------------------------------------------------------------------------------
const text = readFileSync(process.argv[2], "utf8");
const filter = process.argv[3];
const rowRe = /\{ name: "([^"]+)", fen: "([^"]+)", kind: "(mate-in-2|mate-in-3|win-material)", accept: \[([^\]]*)\](?:, tags: \[([^\]]*)\])?/g;
const rows = [...text.matchAll(rowRe)].map((m) => ({
  name: m[1], fen: m[2], kind: m[3],
  accept: [...m[4].matchAll(/"(\w+)"/g)].map((x) => x[1]).sort(),
  tags: m[5] ? [...m[5].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : null,
}));
const hanging = [...text.matchAll(/\{ name: "([^"]+)", fen: "([^"]+)", losing: "(\w+)"/g)].map((m) => ({ name: m[1], fen: m[2] }));
console.log(`ROWS answered ${rows.length} (${["mate-in-2", "mate-in-3", "win-material"].map((k) => `${k} ${rows.filter((r) => r.kind === k).length}`).join(", ")}), new (tagged) ${rows.filter((r) => r.tags).length}, hanging ${hanging.length}`);

// duplicates and colour mirrors over (placement, side)
const key = (fen) => fen.split(" ").slice(0, 2).join(" ");
const mirror = (fen) => {
  const [pl, side] = fen.split(" ");
  const sw = pl.split("/").reverse().map((r) => [...r].map((c) => (/[a-z]/.test(c) ? c.toUpperCase() : /[A-Z]/.test(c) ? c.toLowerCase() : c)).join("")).join("/");
  return `${sw} ${side === "w" ? "b" : "w"}`;
};
const all = [...rows, ...hanging];
for (const r of [...rows, ...hanging]) {
  const pos = parse(r.fen);
  const pawnEdge = pos.b.some((p, s) => p.toLowerCase() === "p" && (s >> 3 === 0 || s >> 3 === 7));
  const oppInCheck = attacked(pos.b, kingSq(pos.b, !pos.white), pos.white);
  if (pawnEdge || oppInCheck) console.log(`LEGALITY\t${r.tags ? "new" : "old"}\t${r.name}\tpawn-rank1/8 ${pawnEdge} side-not-to-move-in-check ${oppInCheck}`);
}
for (const r of rows.filter((x) => x.tags)) {
  const others = all.filter((o) => o !== r);
  const dup = others.find((o) => key(o.fen) === key(r.fen));
  const mir = others.find((o) => key(o.fen) === mirror(r.fen));
  const pos = parse(r.fen);
  const pawnEdge = pos.b.some((p, s) => p.toLowerCase() === "p" && (s >> 3 === 0 || s >> 3 === 7));
  const oppInCheck = attacked(pos.b, kingSq(pos.b, !pos.white), pos.white);
  if (dup || mir || pawnEdge || oppInCheck) console.log(`STRUCTURE FAIL\t${r.name}\tdup ${dup?.name ?? "-"} mirror ${mir?.name ?? "-"} pawn-rank1/8 ${pawnEdge} side-not-to-move-in-check ${oppInCheck}`);
}
// quiet-key (A1): every accepted move of a `quiet-key` row is neither a capture, a check nor a promotion.
for (const r of rows.filter((x) => x.tags?.includes("quiet-key"))) {
  const pos = parse(r.fen);
  for (const m of legal(pos).filter((x) => r.accept.includes(label(x)))) {
    const after = make(pos, m);
    if (m.cap || m.promo || inCheck(after)) console.log(`QUIET-KEY FAIL\t${r.name}\t${label(m)} cap ${m.cap} promo ${m.promo || "-"} check ${inCheck(after)}`);
  }
}
console.log(`QUIET-KEY checked over ${rows.filter((x) => x.tags?.includes("quiet-key")).length} rows (no QUIET-KEY FAIL line = all quiet)`);
console.log("STRUCTURE checked over the new rows (no STRUCTURE FAIL line = no duplicate, no colour mirror, no pawn on rank 1/8, side not to move not in check); LEGALITY lines cover every row");

let red = 0;
for (const r of rows) {
  if (filter && !r.name.includes(filter)) continue;
  const t0 = performance.now();
  const pos = parse(r.fen);
  let verdict, detail;
  if (r.kind === "win-material") {
    const sc = materialScores(pos);
    const best = sc[0].gain;
    const set = [...new Set(sc.filter((x) => x.gain === best).map((x) => x.move))].sort();
    const runnerUp = sc.find((x) => x.gain < best)?.gain ?? null;
    const exact = JSON.stringify(set) === JSON.stringify(r.accept) && best > 0;
    let curation = "";
    if (r.tags) {
      const mate2 = mateSet(pos, 2);
      const okC = best >= 2 && (runnerUp === null || best - runnerUp >= 2) && mate2.length === 0;
      curation = `\tcuration(gain>=2, margin>=2, no mate<=2) ${okC ? "ok" : "NOT MET"} [margin ${runnerUp === null ? "-" : best - runnerUp}, mate<=2 ${mate2.length}]`;
    }
    verdict = exact ? "OK" : "MISMATCH";
    detail = `gain +${best}\tbest ${set.join(",")}\taccept ${r.accept.join(",")}${curation}`;
  } else {
    const n = r.kind === "mate-in-2" ? 2 : 3;
    const set = mateSet(pos, n);
    const shorter = mateSet(pos, n - 1);
    const exact = JSON.stringify(set) === JSON.stringify(r.accept) && shorter.length === 0;
    verdict = exact ? "OK" : "MISMATCH";
    detail = `mate<=${n} ${set.join(",") || "-"}\tmate<=${n - 1} ${shorter.join(",") || "-"}\taccept ${r.accept.join(",")}`;
  }
  if (verdict !== "OK") red++;
  console.log(`${r.kind}\t${verdict}\t${(performance.now() - t0).toFixed(0)}ms\t${r.tags ? "new" : "old"}\t${r.name}\t${detail}`);
}
console.log(`ORACLE qe-ABC-127: ${red === 0 ? "ALL OK" : `${red} MISMATCH`}`);
process.exit(red === 0 ? 0 : 1);
