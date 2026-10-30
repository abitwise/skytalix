// qe-ABC-241: for every repetition-ended game in a smoke PGN, replay it on head's modules and say whether the repeated
// board's occurrences differ between the hash list and the repetition-key list (i.e. whether ABC-241's normalisation
// touched that repetition), and list every game position where the two lists differ inside a reversible window.
// usage: node repcheck.mjs <headTree> <pgn>
const [tree, pgnPath] = process.argv.slice(2);
const { readFileSync } = await import("node:fs");
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { legalMoves } = await import(`${tree}/src/legal.ts`);
const { toSan } = await import(`${tree}/src/san.ts`);
const { newGame, playMove, keyHistory, repetitionKeyHistory } = await import(`${tree}/src/history.ts`);
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const games = readFileSync(pgnPath, "utf8").split(/\n(?=\[Event )/).filter((g) => g.includes("[Result"));
const tag = (g, t) => new RegExp(`^\\[${t} "(.*)"\\]$`, "m").exec(g)?.[1];
let gi = 0, windowsTouched = 0;
for (const g of games) {
  gi++;
  const fen = tag(g, "FEN") ?? START;
  const body = g.replace(/^\[.*\]$/gm, "").replace(/\{[^}]*\}/g, " ");
  const sans = body.split(/\s+/).filter((t) => t && !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t));
  const h = newGame(fen);
  for (const s of sans) {
    const legal = legalMoves(h.position);
    const m = legal.find((x) => toSan(h.position, x, legal).replace(/[+#]/g, "") === s.replace(/[+#!?]/g, ""));
    if (!m) throw new Error(`game ${gi}: ${s} not found`);
    playMove(h, m);
  }
  const raw = keyHistory(h), rep = repetitionKeyHistory(h);
  const diffs = raw.map((k, i) => (k !== rep[i] ? i : -1)).filter((i) => i >= 0);
  // A differing index matters only if its repetition key recurs later in the game.
  const recurring = diffs.filter((i) => rep.slice(i + 1).includes(rep[i]));
  windowsTouched += recurring.length;
  const term = /\{([^}]*)\}\s*(1-0|0-1|1\/2-1\/2)\s*$/.exec(g.replace(/^\[.*\]$/gm, "").trim())?.[1] ?? "";
  const isRep = /3-fold/.test(term);
  const last = rep.at(-1);
  const occ = rep.map((k, i) => (k === last ? i : -1)).filter((i) => i >= 0);
  const occRaw = raw.map((k, i) => (k === raw.at(-1) ? i : -1)).filter((i) => i >= 0);
  console.log(
    `game ${gi} round ${tag(g, "Round")} ${tag(g, "White")}-${tag(g, "Black")} ${tag(g, "Result")} plies ${sans.length}: ep-normalised positions ${diffs.length}, of which recur later ${recurring.length}${isRep ? ` | REPETITION: final board at plies ${occ.join(",")} (repetition keys) vs ${occRaw.join(",")} (hash keys)` : ""}`,
  );
}
console.log(`games ${gi}; normalised positions that recur later: ${windowsTouched}`);
