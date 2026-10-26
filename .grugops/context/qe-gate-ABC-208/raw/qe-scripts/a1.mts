// QE qe-gate-ABC-208, A1 out of tree: head's doors vs base's shipped search and base's own doors.
// Usage: node a1.mts <baseTreeRoot> <headTreeRoot> [sweep|roots|all]
const [baseRoot, headRoot, part = "all"] = process.argv.slice(2);

async function load(root: string) {
  const m = (p: string) => import(`${root}/src/${p}`);
  return {
    s: await m("search.ts"),
    e: await m("engine.ts"),
    fen: await m("fen.ts"),
    apply: await m("apply.ts"),
    legal: await m("legal.ts"),
    gameend: await m("gameend.ts"),
    pos: await m("position.ts"),
  };
}
const B = await load(baseRoot as string);
const H = await load(headRoot as string);

const label = (T: typeof H, mv: any) =>
  mv ? `${T.pos.squareName(mv.from)}${T.pos.squareName(mv.to)}${mv.promotion ?? ""}` : "none";

function tickingClock(step: number) {
  let t = 0;
  return () => {
    const r = t;
    t += step;
    return r;
  };
}

// ---- corpora, as src/engine.test.ts builds them (head's move generator; base's is identical) ----
const PERFT = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
] as const;
const ENDG = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],
  ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"],
  ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
] as const;

function expandFrom(name: string, root: any, plies: number) {
  const out: { name: string; fen: string }[] = [];
  const walk = (pn: string, p: any, left: number) => {
    if (left === 0) return;
    for (const mv of H.legal.legalMoves(p)) {
      const u = H.apply.makeMove(p, mv);
      const cn = `${pn}/${label(H, mv)}`;
      out.push({ name: cn, fen: H.fen.toFen(p) });
      walk(cn, p, left - 1);
      H.apply.unmakeMove(p, mv, u);
    }
  };
  walk(name, root, plies);
  return out;
}
const inProgress = (fen: string) => H.gameend.gameStatus(H.fen.parseFen(fen)).result === "in-progress";
const endgamesWithChildren = () =>
  ENDG.flatMap(([name, fen]) => [
    { name, fen },
    ...expandFrom(name, H.fen.parseFen(fen), 1).filter((c) => inProgress(c.fen)),
  ]);
function broadCorpus() {
  const roots = PERFT.flatMap(([name, fen]) => [{ name, fen }, ...expandFrom(name, H.fen.parseFen(fen), 1)]);
  const p3 = PERFT[2];
  const gc = expandFrom(p3[0], H.fen.parseFen(p3[1]), 2)
    .filter(({ name }) => name.includes("/", name.indexOf("/") + 1))
    .filter((_, i) => i % 5 === 0)
    .slice(0, 25);
  return [...roots, ...gc].filter((c) => inProgress(c.fen));
}

const OLD_SEARCH_DOORS = [
  "searchWithoutPruning",
  "searchWithoutQuiescence",
  "searchWithoutPruningOrQuiescence",
  "searchWithoutOrdering",
  "searchWithoutKillers",
  "searchWithoutTable",
  "searchWithoutReductions",
  "searchWithoutPvsOrReductions",
];
const UNPRUNED = new Set(["searchWithoutPruning", "searchWithoutPruningOrQuiescence"]);
const UNPRUNED_MAX_DEPTH = 3;
const capped: Record<string, number> = {};
const OLD_ENGINE_DOORS = ["chooseMoveWithoutReductions", "chooseMoveWithoutPvsOrReductions"];

const tally = { cells: 0, equal: 0, byPair: {} as Record<string, [number, number]>, mismatches: [] as string[] };
const bite = { search: [0, 0], engine: [0, 0], lines: [] as string[] };
function cell(pair: string, where: string, b: any, h: any, T: "s" | "e") {
  const bl = label(B, b?.move), hl = label(H, h?.move);
  const eq = bl === hl && b?.score === h?.score && b?.nodes === h?.nodes && (T === "s" || b?.depth === h?.depth);
  tally.cells++;
  tally.byPair[pair] ??= [0, 0];
  (tally.byPair[pair] as [number, number])[1]++;
  if (eq) {
    tally.equal++;
    (tally.byPair[pair] as [number, number])[0]++;
  } else
    tally.mismatches.push(
      `${pair} ${where}: base ${bl}/${b?.score}/${b?.nodes}/d${b?.depth} head ${hl}/${h?.score}/${h?.nodes}/d${h?.depth}`,
    );
}
function biteCell(kind: "search" | "engine", where: string, b: any, h: any) {
  const same = label(B, b?.move) === label(H, h?.move) && b?.score === h?.score && b?.nodes === h?.nodes;
  bite[kind][1]++;
  if (!same) bite[kind][0]++;
  bite.lines.push(`${kind} ${where}: ${same ? "SAME" : "DIFF"} base ${b?.nodes} head ${h?.nodes} score ${b?.score}/${h?.score}`);
}

const searchCells = (fen: string, d: number, where: string) => {
  cell("search():searchWithoutNullMove", where, B.s.search(B.fen.parseFen(fen), d), H.s.searchWithoutNullMove(H.fen.parseFen(fen), d), "s");
  for (const door of OLD_SEARCH_DOORS) {
    // The two unpruned doors are brute force (prune off: alpha never rises, windows stay infinite,
    // so no null-window node exists in them). Capped at depth 3 for cost; counted when skipped.
    if (UNPRUNED.has(door) && d > UNPRUNED_MAX_DEPTH) { capped[door] = (capped[door] ?? 0) + 1; continue; }
    cell(`${door}:${door}`, where, B.s[door](B.fen.parseFen(fen), d), H.s[door](H.fen.parseFen(fen), d), "s");
  }
  biteCell("search", where, B.s.search(B.fen.parseFen(fen), d), H.s.search(H.fen.parseFen(fen), d));
};

if (part === "sweep" || part === "all") {
  // ABC-078 A3's identity sweep: endgames + children at budgets 3 and 5; the broad corpus at 5.
  const E = endgamesWithChildren();
  const BC = broadCorpus();
  console.log(`corpus sizes: endgames+children ${E.length}, broad ${BC.length}`);
  const runs: [string, { name: string; fen: string }[], number[]][] = [
    ["endgames", E, [3, 5]],
    ["broad", BC, [5]],
  ];
  const depthsSeen: Record<string, number> = {};
  for (const [set, corpus, budgets] of runs) {
    let n = 0;
    for (const { name, fen } of corpus) {
      if (++n % 25 === 0) console.log(`  ${set} ${n}/${corpus.length} cells so far ${tally.cells}`);
      for (const budgetMs of budgets) {
        const where = `${set}:${name}@${budgetMs}ms`;
        const opt = () => ({ budgetMs, now: tickingClock(1) });
        const bShip = B.e.chooseMove(B.fen.parseFen(fen), opt());
        cell("chooseMove:chooseMoveWithoutNullMove", where, bShip, H.e.chooseMoveWithoutNullMove(H.fen.parseFen(fen), opt()), "e");
        let dSweep = 0;
        for (const door of OLD_ENGINE_DOORS) {
          const b = B.e[door](B.fen.parseFen(fen), opt());
          if (door === "chooseMoveWithoutReductions") dSweep = b.depth;
          cell(`${door}:${door}`, where, b, H.e[door](H.fen.parseFen(fen), opt()), "e");
        }
        biteCell("engine", where, bShip, H.e.chooseMove(H.fen.parseFen(fen), opt()));
        for (const d of [...new Set([dSweep, bShip.depth])]) {
          depthsSeen[`${set}@${budgetMs}:d${d}`] = (depthsSeen[`${set}@${budgetMs}:d${d}`] ?? 0) + 1;
          searchCells(fen, d, `${where}:d${d}`);
        }
      }
    }
  }
  console.log("depths read:", JSON.stringify(depthsSeen));
}

if (part === "roots" || part === "all") {
  // The design probe's extension: the six roots, search doors d1-4, engine doors at maxDepth 3/5/6.
  for (const [name, fen] of PERFT) {
    for (const d of [1, 2, 3, 4]) searchCells(fen, d, `roots:${name}:d${d}`);
    for (const maxDepth of [3, 5, 6]) {
      const opt = () => ({ budgetMs: 1_000, now: () => 0, maxDepth });
      const where = `roots:${name}:maxDepth${maxDepth}`;
      const bShip = B.e.chooseMove(B.fen.parseFen(fen), opt());
      cell("chooseMove:chooseMoveWithoutNullMove", where, bShip, H.e.chooseMoveWithoutNullMove(H.fen.parseFen(fen), opt()), "e");
      for (const door of OLD_ENGINE_DOORS)
        cell(`${door}:${door}`, where, B.e[door](B.fen.parseFen(fen), opt()), H.e[door](H.fen.parseFen(fen), opt()), "e");
      biteCell("engine", where, bShip, H.e.chooseMove(H.fen.parseFen(fen), opt()));
    }
    console.log(`roots ${name} done`);
  }
}

console.log(`A1 (${part}): ${tally.equal}/${tally.cells} cells equal in move, score and nodes (engine: and depth)`);
for (const [k, [e, n]] of Object.entries(tally.byPair)) console.log(`  ${k}: ${e}/${n}`);
console.log(`mismatches: ${tally.mismatches.length}`);
console.log(`unpruned-door cells skipped above depth ${UNPRUNED_MAX_DEPTH}: ${JSON.stringify(capped)}`);
for (const m of tally.mismatches.slice(0, 50)) console.log("  " + m);
console.log(`bite (head shipped differs from base shipped): search ${bite.search[0]}/${bite.search[1]}, engine ${bite.engine[0]}/${bite.engine[1]}`);
for (const l of bite.lines.filter((l) => l.includes("roots:"))) console.log("  " + l);
