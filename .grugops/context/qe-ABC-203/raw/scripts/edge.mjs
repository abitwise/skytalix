const [W, out] = process.argv.slice(2);
const { formatPgn } = await import(`${W}/src/pgn.ts`);
const { newGame, playMove } = await import(`${W}/src/history.ts`);
const { parseSan } = await import(`${W}/src/san.ts`);
const { writeFileSync } = await import("node:fs");
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const game = (words) => { const h = newGame(START); for (const w of words) { const p = parseSan(h.position, w); if (p.outcome !== "move") throw new Error(w); playMove(h, p.move); } return h; };
const g = { startedAt: new Date(2026, 9, 23, 14, 5, 9), difficulty: 2, humanColour: "white" };
const rep = game(["Nf3", "Nf6", "Ng1", "Ng8", "Nf3", "Nf6", "Ng1", "Ng8"]);
const cases = {
  zeroPlyResign: [{ result: "black-wins", reason: "resignation", exitCode: 0 }, game([])],
  faultTwoLineComment: [{ result: null, reason: "engine-failure", exitCode: 0 }, game(["e4", "e5", "Nf3"])],
  threefoldClaim: [{ result: "draw", reason: "threefold-repetition", exitCode: 0 }, rep],
};
for (const [name, [o, h]] of Object.entries(cases)) writeFileSync(`${out}/${name}.pgn`, formatPgn(o, h, g));
