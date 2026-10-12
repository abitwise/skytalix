const root = process.argv[2];
const { parseFen } = await import(`${root}/src/fen.ts`);
const { zobristKey } = await import(`${root}/src/zobrist.ts`);
const { readFileSync } = await import("node:fs");
const b = JSON.parse(readFileSync(`${root}/data/opening-book/book.json`, "utf8"));
const fens = {
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  after_e4: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
  ruy: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
};
for (const [k, f] of Object.entries(fens)) {
  const key = zobristKey(parseFen(f)).toString(16).padStart(16, "0");
  console.log(k, key, JSON.stringify(b.positions[key] ?? null));
}
