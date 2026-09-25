import { parseFen } from "../../../../src/fen.ts";
import { search } from "../../../../src/search.ts";

const A3_FEN = "rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPP1P/RNBQKBNR w KQkq d6 0 2";
for (const d of [1, 2, 3]) {
  const r = search(parseFen(A3_FEN), d);
  console.log(`depth ${d}: nodes=${r.nodes} move=${r.move ? r.move.from + "-" + r.move.to : null}`);
}
