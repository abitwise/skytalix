// ABC-226 records scan. Usage: node scan.mts <worktree> > scan.txt   (also writes scan.json next to this file)
// Reads the 14 committed reading PGNs, replays every game with the repository's own move code, and
// reports repetitions the search could not see. Imports src/ read-only; writes nothing outside raw/.
// No games, no engine. Paths in the output are repository-relative.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const wt = process.argv[2];
if (!wt) throw new Error("usage: node scan.mts <worktree>");
const { parseFen } = await import(`${wt}/src/fen.ts`);
const { parseSan } = await import(`${wt}/src/san.ts`);
const { makeMove, unmakeMove } = await import(`${wt}/src/apply.ts`);
const { legalMoves, hasLegalEnPassant } = await import(`${wt}/src/legal.ts`);
const { zobristKey } = await import(`${wt}/src/zobrist.ts`);
const { NO_SQUARE } = await import(`${wt}/src/position.ts`);
const { toSan } = await import(`${wt}/src/san.ts`);

const CTX = ".grugops/context";
const PGNS: [string, "R" | "D"][] = [
  ["qe-ABC-204/raw/a4-e1910-baseline/r.pgn", "R"],
  ["qe-ABC-204/raw/a4-e1650/r.pgn", "R"],
  ["qe-epic008-close/raw/r1/r.pgn", "R"],
  ["qe-epic008-close/raw/r2/r.pgn", "R"],
  ["qe-ABC-204/raw/a5/d.pgn", "D"],
  ["qe-ABC-207/raw/d1/d.pgn", "D"],
  ["qe-ABC-207/raw/d2/d.pgn", "D"],
  ["qe-ABC-208/raw/d1/d.pgn", "D"],
  ["qe-ABC-209/raw/d1/d.pgn", "D"],
  ["qe-ABC-209/raw/d2/d.pgn", "D"],
  ["qe-ABC-210/raw/d1/d.pgn", "D"],
  ["qe-ABC-210/raw/d2/d.pgn", "D"],
  ["qe-ABC-215/raw/d1/d.pgn", "D"],
  ["qe-epic008-q4c/raw/d/d.pgn", "D"],
];
const STARTPOS = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const WON = 100; // cp, A3 / A4 threshold
const MATE = 100000;

/** cutechess comment "+1.48/8 3.0s" / "-M4/245 0.007s" -> cp from the mover's own view, or null. */
function evalOf(comment: string | null): number | null {
  if (comment === null) return null;
  const m = /^\s*([+-]?)(M?)(\d+(?:\.\d+)?)\/\d+/.exec(comment);
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  if (m[2] === "M") return sign * (MATE - Number(m[3]));
  return sign * Math.round(Number(m[3]) * 100);
}

/** The key the repository uses (ADR-0020 d2) and the ep-normalised key (ep only when a legal ep capture exists). */
function keys(p: any): [bigint, bigint] {
  const k = zobristKey(p);
  if (p.epSquare === NO_SQUARE || hasLegalEnPassant(p)) return [k, k];
  return [k, zobristKey({ ...p, epSquare: NO_SQUARE })];
}

type Ply = { san: string; mover: string; white: boolean; cp: number | null; comment: string | null };
type Game = {
  pgn: string; kind: "R" | "D"; index: number; round: string; white: string; black: string; result: string;
  plyCountTag: number; fen: string; plies: Ply[]; termination: string; unparsed?: string;
};

function splitGames(text: string): string[] {
  const out: string[] = [];
  let cur: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith("[Event ") && cur.some((l) => l.trim() !== "")) { out.push(cur.join("\n")); cur = []; }
    cur.push(line);
  }
  if (cur.some((l) => l.trim() !== "")) out.push(cur.join("\n"));
  return out;
}

function readGame(raw: string, pgn: string, kind: "R" | "D", index: number): Game {
  const tag = (n: string) => new RegExp(`^\\[${n} "([^"]*)"\\]`, "m").exec(raw)?.[1] ?? "";
  const g: Game = {
    pgn, kind, index, round: tag("Round"), white: tag("White"), black: tag("Black"), result: tag("Result"),
    plyCountTag: Number(tag("PlyCount") || "NaN"), fen: tag("FEN") || STARTPOS, plies: [], termination: "",
  };
  const body = raw.split(/\r?\n/).filter((l) => !l.startsWith("[")).join(" ");
  const tokens = body.match(/\{[^}]*\}|\(|\)|\$\d+|[^\s{}()]+/g) ?? [];
  let lastComment = "";
  for (const t of tokens) {
    if (t.startsWith("{")) {
      const c = t.slice(1, -1).trim();
      lastComment = c;
      const last = g.plies[g.plies.length - 1];
      if (last && last.comment === null) { last.comment = c; last.cp = evalOf(c); }
      continue;
    }
    if (t === "(" || t === ")") { g.unparsed ??= "variation in movetext"; continue; }
    if (/^\$\d+$/.test(t) || /^\d+\.+$/.test(t)) continue;
    if (/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)) continue;
    const san = t.replace(/^\d+\.+/, "");
    if (san === "") continue;
    const white = g.plies.length % 2 === 0 ? !/ b /.test(g.fen) : / b /.test(g.fen);
    g.plies.push({ san, white, mover: white ? g.white : g.black, cp: null, comment: null });
  }
  const comma = lastComment.indexOf(",");
  g.termination = comma >= 0 ? lastComment.slice(comma + 1).trim() : lastComment;
  return g;
}

// ---------------------------------------------------------------- replay + analysis
type Row = Record<string, unknown>;
const perPgn: Row[] = [];
const unparsedList: Row[] = [];
const a2Games: Row[] = [];
const a4Games: Row[] = [];
const keyMismatch: Row[] = [];
const epEarlierOutsideA2: Row[] = [];
const handCheck: Row[] = [];

for (const [rel, kind] of PGNS) {
  const text = readFileSync(join(wt, CTX, rel), "utf8");
  const raws = splitGames(text);
  const s = {
    pgn: rel, kind, gamesRead: raws.length, gamesParsed: 0, unparsed: 0,
    threefold: 0, threefoldBeforeRoot: 0, threefoldInsideRoot: 0,
    a3Strict: 0, a3Family: 0, a4Strict: 0, a4StrictLost: 0, a4StrictDrawn: 0, a4Family: 0, a6EpEarlier: 0,
  };
  raws.forEach((raw, i) => {
    const g = readGame(raw, rel, kind, i + 1);
    const id = `${rel}#${i + 1} (Round ${g.round}, ${g.white}-${g.black}, ${g.result})`;
    if (g.unparsed) { s.unparsed++; unparsedList.push({ id, reason: g.unparsed }); return; }
    // replay
    let pos: any;
    try { pos = parseFen(g.fen); } catch (e) { s.unparsed++; unparsedList.push({ id, reason: `FEN: ${(e as Error).message}` }); return; }
    const rk: bigint[] = [];
    const ek: bigint[] = [];
    const moves: any[] = [];
    { const [a, b] = keys(pos); rk.push(a); ek.push(b); }
    let bad: string | null = null;
    // A4 needs, per ply, the set of legal moves completing a threefold from history (repo key).
    const avoid: Row[] = [];
    for (let n = 0; n < g.plies.length; n++) {
      const ply = g.plies[n] as Ply;
      const legal = legalMoves(pos);
      const r = parseSan(pos, ply.san, legal);
      if (r.outcome !== "move") { bad = `ply ${n + 1} "${ply.san}": ${r.outcome}${r.reason ? ` (${r.reason})` : ""}`; break; }
      // A4 probe: at a move with eval <= -100 for its mover, did a legal move complete a threefold?
      if (ply.cp !== null && ply.cp <= -WON) {
        const counts = new Map<bigint, number>();
        for (const k of rk) counts.set(k, (counts.get(k) ?? 0) + 1);
        const completing: string[] = [];
        for (const m of legal) {
          const u = makeMove(pos, m);
          const k = zobristKey(pos);
          unmakeMove(pos, m, u);
          if ((counts.get(k) ?? 0) >= 2) completing.push(toSan(pos, m, legal));
        }
        const played = r.move;
        const u = makeMove(pos, played);
        const kp = zobristKey(pos);
        unmakeMove(pos, played, u);
        const playedCompletes = (counts.get(kp) ?? 0) >= 2;
        if (completing.length > 0 && !playedCompletes) {
          avoid.push({ ply: n + 1, mover: ply.mover, cp: ply.cp, played: ply.san, couldComplete: completing });
        }
      }
      moves.push(r.move);
      makeMove(pos, r.move);
      const [a, b] = keys(pos);
      rk.push(a); ek.push(b);
    }
    if (bad) { s.unparsed++; unparsedList.push({ id, reason: bad }); return; }
    if (Number.isFinite(g.plyCountTag) && g.plyCountTag !== g.plies.length) {
      s.unparsed++; unparsedList.push({ id, reason: `PlyCount tag ${g.plyCountTag} != ${g.plies.length} replayed` }); return;
    }
    s.gamesParsed++;
    const N = g.plies.length; // final position index
    const isRep = /3-fold repetition/.test(g.termination);
    const skySides = kind === "R" ? ["skytalix"] : ["skytalix", "base"]; // family view in D: both are skytalix builds
    const lastEval = (side: string, upto: number) => {
      for (let n = upto; n >= 1; n--) { const p = g.plies[n - 1] as Ply; if (p.mover === side && p.cp !== null) return { ply: n, cp: p.cp }; }
      return null;
    };
    const sideResult = (side: string) => {
      if (g.result === "1/2-1/2") return "draw";
      const whiteWon = g.result === "1-0";
      return (g.white === side) === whiteWon ? "win" : "loss";
    };

    // ---- A2 / A3 / A6
    let firstRepoThird = -1; // first index where a repo key reaches its 3rd occurrence
    let firstEpThird = -1;
    { const c = new Map<bigint, number>(); rk.forEach((k, i) => { const v = (c.get(k) ?? 0) + 1; c.set(k, v); if (v === 3 && firstRepoThird < 0) firstRepoThird = i; }); }
    { const c = new Map<bigint, number>(); ek.forEach((k, i) => { const v = (c.get(k) ?? 0) + 1; c.set(k, v); if (v === 3 && firstEpThird < 0) firstEpThird = i; }); }
    if (isRep) {
      s.threefold++;
      const K = rk[N] as bigint;
      const occ = rk.map((k, i) => (k === K ? i : -1)).filter((i) => i >= 0);
      const occEp = ek.map((k, i) => (k === ek[N] ? i : -1)).filter((i) => i >= 0);
      if (occ.length < 3) keyMismatch.push({ id, repoOccurrences: occ, epNormOccurrences: occEp });
      const completer = (g.plies[N - 1] as Ply).mover;
      // the skytalix search that completed it: root = N-1 if skytalix moved last, else its previous search at N-2
      const strictRoot = completer === "skytalix" ? N - 1 : N - 2;
      const familyRoot = N - 1; // in D the completer is always a skytalix build; in R only strict applies
      const inside = (occ[0] as number) >= strictRoot;
      if (inside) s.threefoldInsideRoot++; else s.threefoldBeforeRoot++;
      // A6: would the ep-normalised key have reached the 3rd occurrence of this position earlier?
      const epThirdOfP = occEp.length >= 3 ? (occEp[2] as number) : -1;
      const repoThirdOfP = occ.length >= 3 ? (occ[2] as number) : -1;
      const epEarlier = epThirdOfP >= 0 && (repoThirdOfP < 0 || epThirdOfP < repoThirdOfP);
      if (epEarlier) s.a6EpEarlier++;
      const sky = lastEval("skytalix", N);
      const a3s = sky !== null && sky.cp >= WON;
      let sf: Row | null = null;
      if (kind === "R" && sky) {
        const pick = sky.ply + 1 <= N ? sky.ply + 1 : sky.ply - 1;
        const p = g.plies[pick - 1] as Ply | undefined;
        if (p && p.mover === "stockfish") sf = { ply: pick, cpForSkytalix: p.cp === null ? null : -p.cp };
      }
      const fam: Row[] = [];
      for (const side of skySides) { const e = lastEval(side, N); if (e && e.cp >= WON) fam.push({ side, ...e }); }
      if (a3s) s.a3Strict++;
      if (fam.length > 0) s.a3Family++;
      a2Games.push({
        id, kind, plies: N, completer, occurrencesRepoKey: occ, strictRoot, familyRoot,
        firstOccurrence: inside ? "inside the search" : "before the root",
        skytalixLastEval: sky, stockfishSameMove: sf, a3Strict: a3s, a3FamilyWonSides: fam,
        epNormOccurrences: occEp, a6EpEarlier: epEarlier,
      });
    } else if (firstEpThird >= 0 && (firstRepoThird < 0 || firstEpThird < firstRepoThird)) {
      epEarlierOutsideA2.push({ id, termination: g.termination, epThirdAt: firstEpThird, repoThirdAt: firstRepoThird });
    }

    // ---- A4: lost, or drew, after avoiding a threefold at <= -100 cp
    const strictHits = avoid.filter((a) => a.mover === "skytalix" && sideResult("skytalix") !== "win");
    const famHits = avoid.filter((a) => skySides.includes(a.mover as string) && sideResult(a.mover as string) !== "win");
    if (strictHits.length) { s.a4Strict++; if (sideResult("skytalix") === "loss") s.a4StrictLost++; else s.a4StrictDrawn++; }
    if (famHits.length) s.a4Family++;
    if (famHits.length) a4Games.push({ id, kind, termination: g.termination, strict: strictHits.length > 0, hits: famHits, resultFor: Object.fromEntries(skySides.map((x) => [x, sideResult(x)])) });

    // hand-check candidates: shortest D repetition game, and the first R game not ending by repetition
    if (kind === "D" && isRep) handCheck.push({ id, kind, plies: N, termination: g.termination, occ: rk.map((k, i) => (k === rk[N] ? i : -1)).filter((i) => i >= 0) });
    if (kind === "R" && !isRep && handCheck.filter((h) => h.kind === "R").length === 0)
      handCheck.push({ id, kind, plies: N, termination: g.termination, maxRepoCount: Math.max(...[...rk.reduce((m, k) => m.set(k, (m.get(k) ?? 0) + 1), new Map<bigint, number>()).values()]) });
  });
  perPgn.push(s);
}

// ---------------------------------------------------------------- report
const sum = (rows: Row[], k: string, f?: (r: Row) => boolean) => rows.filter((r) => !f || f(r)).reduce((a, r) => a + Number(r[k]), 0);
const isR = (r: Row) => r.kind === "R";
const shortestD = handCheck.filter((h) => h.kind === "D").sort((a, b) => Number(a.plies) - Number(b.plies))[0];
const firstR = handCheck.find((h) => h.kind === "R");
const out = {
  perPgn, unparsed: unparsedList,
  totals: {
    gamesRead: sum(perPgn, "gamesRead"), gamesParsed: sum(perPgn, "gamesParsed"), unparsed: sum(perPgn, "unparsed"),
    threefold: sum(perPgn, "threefold"), threefoldR: sum(perPgn, "threefold", isR),
    beforeRoot: sum(perPgn, "threefoldBeforeRoot"), insideRoot: sum(perPgn, "threefoldInsideRoot"),
    a3Strict: sum(perPgn, "a3Strict"), a3StrictR: sum(perPgn, "a3Strict", isR), a3Family: sum(perPgn, "a3Family"),
    a4Strict: sum(perPgn, "a4Strict"), a4StrictR: sum(perPgn, "a4Strict", isR), a4StrictLost: sum(perPgn, "a4StrictLost"),
    a4StrictDrawn: sum(perPgn, "a4StrictDrawn"), a4Family: sum(perPgn, "a4Family"),
    a6EpEarlier: sum(perPgn, "a6EpEarlier"),
    repoKeyBelowThreeAtCutechessThreefold: keyMismatch.length, epThirdBeforeRepoThirdOutsideA2: epEarlierOutsideA2.length,
  },
  keyMismatch, epEarlierOutsideA2, a2Games, a4Games, handCheck: { shortestD, firstR },
};
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), "scan.json"), `${JSON.stringify(out, (_, v) => (typeof v === "bigint" ? v.toString(16) : v))}\n`);

const T = out.totals;
console.log("ABC-226 records scan (repository key = ADR-0020 d2; ep-normalised key reported separately)\n");
console.log("pgn | kind | read | parsed | unparsed | 3-fold | before root | inside | A3 strict | A3 family | A4 strict (lost/drawn) | A4 family | A6 ep earlier");
for (const p of perPgn) console.log(`${p.pgn} | ${p.kind} | ${p.gamesRead} | ${p.gamesParsed} | ${p.unparsed} | ${p.threefold} | ${p.threefoldBeforeRoot} | ${p.threefoldInsideRoot} | ${p.a3Strict} | ${p.a3Family} | ${p.a4Strict} (${p.a4StrictLost}/${p.a4StrictDrawn}) | ${p.a4Family} | ${p.a6EpEarlier}`);
console.log(`\nTOTALS ${JSON.stringify(T)}`);
console.log(`\nA5 strict (engine named skytalix): all = A3 ${T.a3Strict} + A4 ${T.a4Strict} = ${T.a3Strict + T.a4Strict}; R alone = A3 ${T.a3StrictR} + A4 ${T.a4StrictR} = ${T.a3StrictR + T.a4StrictR}`);
console.log(`A5 family (D base counted too): all = A3 ${T.a3Family} + A4 ${T.a4Family} = ${T.a3Family + T.a4Family}`);
console.log(`\nunparsed: ${JSON.stringify(unparsedList)}`);
console.log(`\nR repetition games:`);
for (const a of a2Games.filter(isR)) console.log(`  ${a.id} plies=${a.plies} completer=${a.completer} occ=${JSON.stringify(a.occurrencesRepoKey)} root=${a.strictRoot} ${a.firstOccurrence} skyLast=${JSON.stringify(a.skytalixLastEval)} sfSame=${JSON.stringify(a.stockfishSameMove)} A3=${a.a3Strict} epEarlier=${a.a6EpEarlier}`);
console.log(`\nA3 strict games (D and R):`);
for (const a of a2Games.filter((x) => x.a3Strict)) console.log(`  ${a.id} plies=${a.plies} completer=${a.completer} skyLast=${JSON.stringify(a.skytalixLastEval)} sfSame=${JSON.stringify(a.stockfishSameMove)}`);
console.log(`\nA4 games (family; strict flagged):`);
for (const a of a4Games) console.log(`  ${a.id} strict=${a.strict} result=${JSON.stringify(a.resultFor)} term=${a.termination} hits=${JSON.stringify(a.hits)}`);
console.log(`\nrepo key < 3 at a cutechess threefold: ${JSON.stringify(keyMismatch)}`);
console.log(`ep-normalised 3rd occurrence before the repo key's, outside A2: ${JSON.stringify(epEarlierOutsideA2)}`);
console.log(`\nhand-check: shortest D repetition ${JSON.stringify(shortestD)}; first R non-repetition ${JSON.stringify(firstR)}`);
