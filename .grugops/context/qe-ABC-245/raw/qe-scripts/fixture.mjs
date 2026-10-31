// qe-ABC-245 FIXTURE CHECK (frozen in PREREG.txt). Reads the committed ABC-245 fixture (FAR_FEN, FAR_MOVES, REPEAT) out
// of the head tree's src/levels.test.ts by regex (no transcription), then checks it with an INDEPENDENT K+Q v K move
// generator and position identity (own 8x8 board + side to move; no Zobrist), cross-checked against the project's
// legalMoves / history / trimPriorKeys / repetitionKey at every ply. Node type-stripping imports H's src/*.ts.
// usage: node fixture.mjs <H>
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const H = process.argv[2];
const imp = (f) => import(pathToFileURL(join(H, "src", f)).href);
const { legalMoves } = await imp("legal.ts");
const { newGame, playMove, repetitionKeyHistory, gameStatusOf } = await imp("history.ts");
const { trimPriorKeys } = await imp("engine.ts");
const { repetitionKey } = await imp("gameend.ts");
const { zobristKey } = await imp("zobrist.ts");
const { makeMove, unmakeMove } = await imp("apply.ts");
const { squareName } = await imp("position.ts");

const src = readFileSync(join(H, "src/levels.test.ts"), "utf8");
const FEN = /const FAR_FEN = "([^"]+)";/.exec(src)[1];
const block = /const FAR_MOVES = \[([\s\S]*?)\]\.join\(" "\);/.exec(src)[1];
const MOVES = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]).join(" ").split(" ");
const REPEAT = /const REPEAT = "([^"]+)";/.exec(src)[1];
const label = (m) => `${squareName(m.from)}${squareName(m.to)}`;

let fails = 0;
const check = (ok, what) => { console.log(`${ok ? "PASS" : "FAIL"} ${what}`); if (!ok) fails++; };

// ---------- independent board ----------
const [placement, side0, castling, ep, clock0] = FEN.split(" ");
const board = new Map(); // "e4" -> "K" | "Q" | "k" | ...
placement.split("/").forEach((row, r) => { let f = 0; for (const c of row) { if (/\d/.test(c)) f += Number(c); else { board.set("abcdefgh"[f] + (8 - r), c); f++; } } });
check([...board.values()].sort().join("") === "KQk", `start material is exactly K+Q v k (got ${[...board.values()].sort().join("")}); castling ${castling}, ep ${ep}, clock ${clock0}`);
const sq = (f, r) => (f >= 0 && f < 8 && r >= 0 && r < 8 ? "abcdefgh"[f] + (r + 1) : null);
const fr = (s) => [s.charCodeAt(0) - 97, Number(s[1]) - 1];
const white = (p) => p === p.toUpperCase();
const KDIR = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
function attacked(b, s, byWhite) {
  const [f, r] = fr(s);
  for (const [df, dr] of KDIR) {
    const t = sq(f + df, r + dr); if (t && b.get(t) === (byWhite ? "K" : "k")) return true;
    for (let k = 1; ; k++) { const u = sq(f + df * k, r + dr * k); if (!u) break; const p = b.get(u); if (p === undefined) continue; if (p === (byWhite ? "Q" : "q")) return true; break; }
  }
  return false;
}
function gen(b, wtm) {
  const out = [];
  for (const [s, p] of b) {
    if (white(p) !== wtm) continue;
    const [f, r] = fr(s), t = p.toUpperCase();
    if (t !== "K" && t !== "Q") throw new Error(`unexpected piece ${p}`);
    for (const [df, dr] of KDIR) for (let k = 1; k <= (t === "K" ? 1 : 7); k++) {
      const u = sq(f + df * k, r + dr * k); if (!u) break;
      const q = b.get(u);
      if (q !== undefined && white(q) === wtm) break;
      if (q !== undefined && q.toUpperCase() === "K") break; // never a king capture
      const nb = new Map(b); nb.delete(s); nb.set(u, p);
      const king = [...nb].find(([, x]) => x === (wtm ? "K" : "k"))[0];
      if (!attacked(nb, king, !wtm)) out.push({ text: s + u, capture: q !== undefined, piece: t });
      if (q !== undefined) break;
    }
  }
  return out;
}
const ident = (b, wtm) => `${[...b].sort().map(([s, p]) => s + p).join(",")}|${wtm ? "w" : "b"}`;

// ---------- replay ----------
let b = new Map(board), wtm = side0 === "w";
const idents = [ident(b, wtm)];
const game = newGame(FEN);
let pawnOrCapture = 0, genMismatch = 0, illegal = 0, endedEarly = 0;
const plies = [...MOVES, REPEAT];
plies.forEach((text, i) => {
  const mine = gen(b, wtm);
  const theirs = legalMoves(game.position).map(label).sort();
  if (mine.map((m) => m.text).sort().join() !== theirs.join()) genMismatch++;
  const status = gameStatusOf(game);
  if (status.result !== "in-progress") endedEarly++;
  const mv = mine.find((m) => m.text === text);
  if (!mv) { illegal++; console.log(`  illegal at ply ${i}: ${text}`); return; }
  if (mv.capture || mv.piece === "P") pawnOrCapture++;
  const p = b.get(text.slice(0, 2)); b.delete(text.slice(0, 2)); b.set(text.slice(2), p); wtm = !wtm;
  playMove(game, legalMoves(game.position).find((m) => label(m) === text));
  idents.push(ident(b, wtm));
});
const N = plies.length; // child is ply N
check(illegal === 0, `every one of the ${N} plies (${MOVES.length} fixture moves + the repeat ${REPEAT}) is legal by QE's own K+Q v K generator`);
check(genMismatch === 0, `QE's generator equals the project's legalMoves at every one of the ${N} positions before a move (${genMismatch} mismatches)`);
check(pawnOrCapture === 0, "no capture and no pawn move on any ply (the material never changes)");
check(endedEarly === 0, "gameStatusOf reads in-progress at every position before the child (no mate, stalemate, fifty-move or fivefold end)");
const childId = idents[N];
const occ = idents.map((x, i) => (x === childId ? i : -1)).filter((i) => i >= 0);
check(JSON.stringify(occ) === JSON.stringify([0, 4, N]), `the child position occurs at plies ${occ} (expected 0, 4, ${N})`);
const counts = new Map(); idents.slice(0, N).forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
const repeats = [...counts].filter(([, c]) => c > 1);
check(repeats.length === 1 && repeats[0][0] === childId && repeats[0][1] === 2, `before the child, the only position seen twice is the start (${repeats.length} repeated, start x${counts.get(childId)}); no earlier third occurrence`);
check(game.position.halfmoveClock === N && N === 98, `child halfmove clock ${game.position.halfmoveClock} (independent ply count ${N}); 98 < 100, the fifty-move claim never reached`);
const childStatus = gameStatusOf(game);
console.log(`  child status by gameStatusOf: ${JSON.stringify(childStatus)}`);
check(childStatus.result === "in-progress" && JSON.stringify(childStatus.claimable ?? {}).includes("threefold") , "the project's own game-end reads the child as a claimable threefold (a real third occurrence)");

// ---------- the handed list (production form: trimmed prior keys + the root key) ----------
const g2 = newGame(FEN);
for (const t of MOVES) playMove(g2, legalMoves(g2.position).find((m) => label(m) === t));
const rootClock = g2.position.halfmoveClock;
const prior = trimPriorKeys(repetitionKeyHistory(g2), rootClock);
const handed = [...prior, repetitionKey(g2.position, zobristKey(g2.position))];
check(rootClock === 97 && prior.length === 97, `root clock ${rootClock}; trimPriorKeys hands ${prior.length} keys`);
check(handed.length <= 101, `handed list ${handed.length} keys <= 101 (trimmed prior + root key)`);
const rep = legalMoves(g2.position).find((m) => label(m) === REPEAT);
const u = makeMove(g2.position, rep);
const childKey = repetitionKey(g2.position, zobristKey(g2.position));
const childClock = g2.position.halfmoveClock;
unmakeMove(g2.position, rep, u);
const offsets = handed.flatMap((k, i) => (k === childKey ? [i - handed.length] : []));
check(JSON.stringify(offsets) === "[-98,-94]", `key offsets of the child in the handed list ${JSON.stringify(offsets)} (expected [-98,-94])`);
// independent: handed[i] stands for ply N - (handed.length - i); key equality must mirror position identity
let mirror = 0;
for (let i = 0; i < handed.length; i++) for (let j = 0; j < handed.length; j++) {
  const same = idents[N - (handed.length - i)] === idents[N - (handed.length - j)];
  if (same !== (handed[i] === handed[j])) mirror++;
}
const indOff = handed.map((_, i) => i - handed.length).filter((o) => idents[N + o] === childId);
check(mirror === 0 && JSON.stringify(indOff) === "[-98,-94]", `key equality mirrors QE's position identity over all ${handed.length}^2 pairs (${mirror} mismatches); independent offsets ${JSON.stringify(indOff)}`);
check(offsets.every((o) => o < -50 && -o <= Math.min(childClock, handed.length)), `both offsets < -50 and within min(child clock ${childClock}, list ${handed.length}) = ${Math.min(childClock, handed.length)}`);
check(Math.min(childClock, handed.length) === 98, "the -98 match sits exactly at the oldest readable entry (min(clock, list) = 98): an edge, not slack");
const nearest = handed.map((k, i) => i - handed.length).filter((o) => o <= -4 && o >= -92 && handed[handed.length + o] === childKey);
check(nearest.length === 0, "nothing matches the child in -4 ... -92 (so any cap < 98 leaves at most one match)");
const legalAtRoot = legalMoves(g2.position).length;
console.log(`  root legal moves ${legalAtRoot}: ${legalMoves(g2.position).map(label).join(" ")}; repeat index ${legalMoves(g2.position).map(label).indexOf(REPEAT)}`);
console.log(fails === 0 ? "FIXTURE MET (0 FAIL)" : `FIXTURE NOT MET (${fails} FAIL)`);
process.exit(fails === 0 ? 0 : 1);
