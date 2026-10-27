// Replays plans/uat/EPIC-006-game-1.pgn with the tree's own san/apply and prints the FEN before White's moves 4, 8, 10, 13, 17.
const [tree, pgnPath] = process.argv.slice(2);
const { readFileSync } = await import("node:fs");
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const { parseSan } = await import(`${tree}/src/san.ts`);
const { makeMove } = await import(`${tree}/src/apply.ts`);
const text = readFileSync(pgnPath, "utf8").replace(/^\[.*\]$/gm, "");
const toks = text.split(/\s+/).filter((t) => t && !/^\d+\.$/.test(t) && !/^(1-0|0-1|1\/2-1\/2)$/.test(t));
const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
const want = new Set([4, 8, 10, 13, 17]);
toks.forEach((san, i) => {
  const moveNo = Math.floor(i / 2) + 1;
  if (i % 2 === 0 && want.has(moveNo)) console.log(JSON.stringify({ before: `${moveNo}.${san}`, fen: toFen(p) }));
  const r = parseSan(p, san);
  if (r.outcome !== "move") throw new Error(`ply ${i} ${san}: ${r.outcome}`);
  makeMove(p, r.move);
});
