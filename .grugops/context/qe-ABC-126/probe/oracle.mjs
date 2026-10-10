// QE ABC-126 independent oracle. Imports NO project code: its own FEN grammar, ADR-0033's six rules,
// its own legal-move generator (8x8 array, castling, en passant, promotions), its own attack test.
// Usage: node oracle.mjs <tree>   reads <tree>/src/puzzle-corpus.ts as TEXT only (regex), never imports it.
import { readFileSync } from "node:fs";

const tree = process.argv[2];
const FILES = "abcdefgh";
const sqName = (s) => FILES[s & 7] + ((s >> 3) + 1);
// board[sq], sq = rank*8+file, rank 0 = rank 1. piece: {c:'w'|'b', t:'p'|'n'|'b'|'r'|'q'|'k'} or null
function grammar(fen) {
  if (typeof fen !== "string") return { fault: "non-string input" };
  const f = fen.trim().split(/\s+/);
  if (f.length !== 6) return { fault: `grammar: ${f.length} fields` };
  const [place, side, cast, ep, half, full] = f;
  const ranks = place.split("/");
  if (ranks.length !== 8) return { fault: "grammar: ranks" };
  const board = new Array(64).fill(null);
  for (let i = 0; i < 8; i++) {
    const r = 7 - i;
    let file = 0;
    for (const ch of ranks[i]) {
      if (/[1-8]/.test(ch)) file += Number(ch);
      else if (/[pnbrqkPNBRQK]/.test(ch)) {
        if (file > 7) return { fault: "grammar: rank overflow" };
        board[r * 8 + file] = { c: ch === ch.toUpperCase() ? "w" : "b", t: ch.toLowerCase() };
        file++;
      } else return { fault: `grammar: bad char ${ch}` };
    }
    if (file !== 8) return { fault: `grammar: rank ${r + 1} has ${file} files` };
  }
  if (side !== "w" && side !== "b") return { fault: "grammar: side" };
  if (!/^(-|K?Q?k?q?)$/.test(cast) || cast === "") return { fault: "grammar: castling" };
  if (!/^(-|[a-h][1-8])$/.test(ep)) return { fault: "grammar: ep" };
  if (!/^\d+$/.test(half) || !/^\d+$/.test(full)) return { fault: "grammar: clocks" };
  const kings = (c) => board.filter((p) => p && p.c === c && p.t === "k").length;
  if (kings("w") !== 1 || kings("b") !== 1) return { fault: "grammar: king count" };
  const pos = {
    board, stm: side, castling: cast === "-" ? "" : cast,
    ep: ep === "-" ? -1 : (Number(ep[1]) - 1) * 8 + FILES.indexOf(ep[0]),
  };
  return { pos, fields: f };
}
const N_OFF = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
const K_OFF = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const ORTH = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const at = (b, f, r) => (f < 0 || f > 7 || r < 0 || r > 7 ? undefined : b[r * 8 + f]);
function attacked(b, sq, by) {
  const f = sq & 7, r = sq >> 3;
  const pr = by === "w" ? r - 1 : r + 1; // a white pawn attacking sq stands one rank below
  for (const df of [-1, 1]) { const p = at(b, f + df, pr); if (p && p.c === by && p.t === "p") return true; }
  for (const [df, dr] of N_OFF) { const p = at(b, f + df, r + dr); if (p && p.c === by && p.t === "n") return true; }
  for (const [df, dr] of K_OFF) { const p = at(b, f + df, r + dr); if (p && p.c === by && p.t === "k") return true; }
  for (const [dirs, ts] of [[DIAG, "bq"], [ORTH, "rq"]]) for (const [df, dr] of dirs) {
    for (let k = 1; ; k++) {
      const p = at(b, f + df * k, r + dr * k);
      if (p === undefined) break;
      if (p) { if (p.c === by && ts.includes(p.t)) return true; break; }
    }
  }
  return false;
}
const other = (c) => (c === "w" ? "b" : "w");
const kingSq = (b, c) => b.findIndex((p) => p && p.c === c && p.t === "k");
const inCheck = (pos) => attacked(pos.board, kingSq(pos.board, pos.stm), other(pos.stm));

// ADR-0033 decision 3 (c) order, after (a) non-string and (b) grammar + clock round-trip.
function rules(fen) {
  const g = grammar(fen);
  if (g.fault) return g.fault;
  const [, , , , half, full] = g.fields;
  for (const [v, n] of [[half, "halfmove"], [full, "fullmove"]]) if (String(Number(v)) !== v) return `clock ${n} does not round-trip`;
  const { board: b, castling, ep, stm } = g.pos;
  for (const r of [0, 7]) for (let f = 0; f < 8; f++) if (b[r * 8 + f]?.t === "p") return `pawn on rank ${r + 1} (${sqName(r * 8 + f)})`;
  const HOME = { K: ["w", 4, 7], Q: ["w", 4, 0], k: ["b", 60, 63], q: ["b", 60, 56] };
  for (const ch of "KQkq") if (castling.includes(ch)) {
    const [c, k, rk] = HOME[ch];
    if (!(b[k]?.c === c && b[k].t === "k")) return `castling ${ch}: no king`;
    if (!(b[rk]?.c === c && b[rk].t === "r")) return `castling ${ch}: no rook`;
  }
  if (ep >= 0) {
    const wantRank = stm === "w" ? 5 : 2, front = stm === "w" ? ep - 8 : ep + 8, origin = stm === "w" ? ep + 8 : ep - 8;
    if (ep >> 3 !== wantRank) return "ep wrong rank";
    if (b[ep]) return "ep occupied";
    if (!(b[front]?.t === "p" && b[front].c === other(stm))) return "ep no pushed pawn";
    if (b[origin]) return "ep origin occupied";
  }
  const nm = other(stm);
  if (attacked(b, kingSq(b, nm), stm)) return `side not to move (${nm === "b" ? "black" : "white"}) is in check`;
  return "accepted";
}

function pseudo(pos) {
  const { board: b, stm: c } = pos, out = [];
  const push = (from, to, extra = {}) => out.push({ from, to, captured: b[to], promo: null, ...extra });
  for (let sq = 0; sq < 64; sq++) {
    const p = b[sq];
    if (!p || p.c !== c) continue;
    const f = sq & 7, r = sq >> 3;
    if (p.t === "p") {
      const d = c === "w" ? 1 : -1, last = c === "w" ? 7 : 0, start = c === "w" ? 1 : 6;
      const add = (to, extra) => {
        if (to >> 3 === last) for (const pr of "qrbn") push(sq, to, { ...extra, promo: pr });
        else push(sq, to, extra);
      };
      if (at(b, f, r + d) === null) {
        add((r + d) * 8 + f, {});
        if (r === start && at(b, f, r + 2 * d) === null) push(sq, (r + 2 * d) * 8 + f, { dbl: true });
      }
      for (const df of [-1, 1]) {
        const t = at(b, f + df, r + d);
        if (t === undefined) continue;
        const to = (r + d) * 8 + f + df;
        if (t && t.c !== c) add(to, {});
        else if (t === null && to === pos.ep) push(sq, to, { epCap: to - 8 * d, captured: b[to - 8 * d] });
      }
    } else if (p.t === "n" || p.t === "k") {
      for (const [df, dr] of p.t === "n" ? N_OFF : K_OFF) {
        const t = at(b, f + df, r + dr);
        if (t === undefined || (t && t.c === c)) continue;
        push(sq, (r + dr) * 8 + f + df);
      }
      if (p.t === "k") {
        const rank = c === "w" ? 0 : 56, opp = other(c);
        if (sq === rank + 4 && !attacked(b, sq, opp)) {
          const [ks, qs] = c === "w" ? ["K", "Q"] : ["k", "q"];
          if (pos.castling.includes(ks) && !b[rank + 5] && !b[rank + 6] && b[rank + 7]?.t === "r" && b[rank + 7].c === c &&
            !attacked(b, rank + 5, opp) && !attacked(b, rank + 6, opp)) push(sq, rank + 6, { castle: [rank + 7, rank + 5] });
          if (pos.castling.includes(qs) && !b[rank + 3] && !b[rank + 2] && !b[rank + 1] && b[rank]?.t === "r" && b[rank].c === c &&
            !attacked(b, rank + 3, opp) && !attacked(b, rank + 2, opp)) push(sq, rank + 2, { castle: [rank, rank + 3] });
        }
      }
    } else {
      const dirs = p.t === "b" ? DIAG : p.t === "r" ? ORTH : [...DIAG, ...ORTH];
      for (const [df, dr] of dirs) for (let k = 1; ; k++) {
        const t = at(b, f + df * k, r + dr * k);
        if (t === undefined || (t && t.c === c)) break;
        push(sq, (r + dr * k) * 8 + f + df * k);
        if (t) break;
      }
    }
  }
  return out;
}
function make(pos, m) {
  const b = pos.board.slice();
  const p = b[m.from];
  b[m.to] = m.promo ? { c: p.c, t: m.promo } : p;
  b[m.from] = null;
  if (m.epCap !== undefined) b[m.epCap] = null;
  if (m.castle) { b[m.castle[1]] = b[m.castle[0]]; b[m.castle[0]] = null; }
  let castling = pos.castling;
  const strip = (sq, chs) => { if (m.from === sq || m.to === sq) castling = castling.replace(new RegExp(`[${chs}]`, "g"), ""); };
  strip(4, "KQ"); strip(60, "kq"); strip(0, "Q"); strip(7, "K"); strip(56, "q"); strip(63, "k");
  return { board: b, stm: other(pos.stm), castling, ep: m.dbl ? (m.from + m.to) / 2 : -1 };
}
function legal(pos) {
  return pseudo(pos).filter((m) => {
    const n = make(pos, m);
    return !attacked(n.board, kingSq(n.board, pos.stm), n.stm);
  });
}
const lbl = (m) => sqName(m.from) + sqName(m.to);
const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
function material(pos) {
  let s = 0;
  for (const p of pos.board) if (p) s += (p.c === "w" ? 1 : -1) * VAL[p.t];
  return pos.stm === "b" ? -s : s;
}

// Variant 084: ABC-084's raw-probe oracle semantics (depth 4, capture-only qs, no evasions, mate -1000[-d]).
function qs084(p, a, b) {
  const ms = legal(p);
  if (ms.length === 0) return inCheck(p) ? -1000 : 0;
  const stand = material(p);
  if (stand >= b) return stand;
  if (stand > a) a = stand;
  for (const m of ms) {
    if (!m.captured) continue;
    const v = -qs084(make(p, m), -b, -a);
    if (v >= b) return v;
    if (v > a) a = v;
  }
  return a;
}
function nm084(p, d, a, b) {
  const ms = legal(p);
  if (ms.length === 0) return inCheck(p) ? -1000 - d : 0;
  if (d === 0) return qs084(p, a, b);
  for (const m of ms) {
    const v = -nm084(make(p, m), d - 1, -b, -a);
    if (v >= b) return v;
    if (v > a) a = v;
  }
  return a;
}
// Variant 127: ABC-127 A2 semantics (3 plies after the root, then 8 capture plies; in check every evasion,
// no stand pat; mate -(1000 - ply)). Exact per-move scores with a full window.
function cap127(p, a, b, n) {
  const ms = legal(p);
  const chk = inCheck(p);
  if (ms.length === 0) return chk ? -1000 : 0;
  if (!chk) {
    const stand = material(p);
    if (stand >= b || n <= 0) return stand;
    if (stand > a) a = stand;
  }
  for (const m of ms) {
    if (!chk && !m.captured && !m.promo) continue;
    const v = -cap127(make(p, m), -b, -a, n - 1);
    if (v >= b) return v;
    if (v > a) a = v;
  }
  return a;
}
function s127(p, d, a, b, ply) {
  const ms = legal(p);
  if (ms.length === 0) return inCheck(p) ? -(1000 - ply) : 0;
  if (d === 0) return cap127(p, a, b, 8);
  for (const m of ms) {
    const v = -s127(make(p, m), d - 1, -b, -a, ply + 1);
    if (v >= b) return v;
    if (v > a) a = v;
  }
  return a;
}
function rootTable(pos, scoreChild) {
  const rows = legal(pos).map((m) => ({ mv: lbl(m), v: -scoreChild(make(pos, m)) }));
  rows.sort((x, y) => y.v - x.v || (x.mv < y.mv ? -1 : 1));
  const best = rows[0].v;
  return { stand: material(pos), best, keys: rows.filter((r) => r.v === best).map((r) => r.mv).sort(), next: rows.find((r) => r.v < best)?.v, rows };
}
const INF = 1e9;
const o084 = (pos) => rootTable(pos, (c) => nm084(c, 3, -10000, 10000));
const o127 = (pos) => rootTable(pos, (c) => s127(c, 3, -INF, INF, 1));

// Read the corpus as text.
const src = readFileSync(`${tree}/src/puzzle-corpus.ts`, "utf8");
const rows = src.split("\n").filter((l) => /^\s*\{ name: "/.test(l)).map((l) => {
  const g = (re) => l.match(re)?.[1];
  const accept = g(/accept: \[([^\]]*)\]/);
  const gain = g(/\$\{WIN\} \+(\d+)/);
  return {
    name: g(/name: "([^"]+)"/), fen: g(/fen: "([^"]+)"/), kind: g(/kind: "([^"]+)"/) ?? "do-not-hang",
    accept: accept ? accept.split(",").map((x) => x.trim().replace(/"/g, "")).filter(Boolean) : undefined,
    losing: g(/losing: "([^"]+)"/), gain: gain ? Number(gain) : undefined,
  };
});
const mode = process.argv[3] ?? "all";
console.log(`tree=${tree} rows=${rows.length} hanging=${rows.filter((r) => r.losing).length}`);
if (mode === "all" || mode === "scan") {
  let inChk = 0, rej = 0;
  for (const r of rows) {
    const g = grammar(r.fen);
    const ic = inCheck(g.pos), rule = rules(r.fen);
    if (ic) inChk++;
    if (rule !== "accepted") rej++;
    if (ic || rule !== "accepted") console.log(`  FLAG ${r.name}  inCheck=${ic} adr0033=${rule}`);
  }
  console.log(`SCAN ${rows.length} rows: stm in check ${inChk}, ADR-0033 rejected ${rej}`);
}
const focus = (process.env.FOCUS ?? "R takes a bishop a pawn defends|mirror: r takes a bishop a pawn defends|pin: Re1 pins the queen to the king|discovered check: the bishop moves, Rxd8").split("|");
const extra = JSON.parse(process.env.EXTRA ?? "[]"); // [[name, fen, losing|null], ...] e.g. the shipped FENs
if (mode === "all" || mode === "focus") {
  const targets = [...rows.filter((r) => focus.includes(r.name)), ...extra.map(([name, fen, losing]) => ({ name: `EXTRA ${name}`, fen, losing, kind: losing ? "do-not-hang" : "win-material" }))];
  for (const r of targets) {
    const g = grammar(r.fen);
    const pos = g.pos;
    const ms = legal(pos);
    const nonKing = ms.filter((m) => pos.board[m.from].t !== "k").length;
    const line = { name: r.name, fen: r.fen, inCheck: inCheck(pos), adr0033: rules(r.fen), legal: ms.length, nonKing };
    if (r.losing) {
      line.losingLegal = ms.some((m) => lbl(m) === r.losing);
      const t = o084(pos);
      const lv = t.rows.find((x) => x.mv === r.losing)?.v;
      const bo = t.rows.find((x) => x.mv !== r.losing)?.v;
      Object.assign(line, { mat4_losing: lv, mat4_bestOther: bo, mat4_margin: bo - lv, mat4_bestKeys: t.keys });
    } else {
      const a = o084(pos), b = o127(pos);
      Object.assign(line, {
        accept: r.accept, sourceGain: r.gain,
        o084: { stand: a.stand, best: a.best, next: a.next, keys: a.keys, gain: a.best - a.stand, margin: a.best - a.next },
        o127: { stand: b.stand, best: b.best, next: b.next, keys: b.keys, gain: b.best - b.stand, margin: b.best - b.next },
      });
      line.acceptEqualsO127 = JSON.stringify([...(r.accept ?? [])].sort()) === JSON.stringify(b.keys);
      line.acceptEqualsO084 = JSON.stringify([...(r.accept ?? [])].sort()) === JSON.stringify(a.keys);
      line.gainMatches = r.gain === b.best - b.stand && r.gain === a.best - a.stand;
    }
    console.log(JSON.stringify(line));
  }
}
if (mode === "perft") {
  const perft = (p, d) => (d === 0 ? 1 : legal(p).reduce((s, m) => s + perft(make(p, m), d - 1), 0));
  for (const [fen, d, want] of [
    ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 4, 197281],
    ["r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 3, 97862],
    ["8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", 5, 674624],
    ["r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", 4, 422333],
    ["rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", 3, 62379],
  ]) { const n = perft(grammar(fen).pos, d); console.log(`PERFT d${d} ${n} want ${want} ${n === want ? "OK" : "MISMATCH"}  ${fen}`); }
}
