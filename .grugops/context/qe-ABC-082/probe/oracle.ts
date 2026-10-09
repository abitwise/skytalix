// QE probe (qe-ABC-082): row 7's in-file re-pin rule, re-run by QE. searchWithoutPruning(p, 3)
// (the unpruned oracle) against searchWithoutPvsOrReductions and search() at depth 3.
// Usage: node oracle.ts <tree> [position-6|kiwipete ...]
import { pathToFileURL } from "node:url";
const tree = process.argv[2];
const names = process.argv.slice(3);
const load = (f: string) => import(pathToFileURL(`${tree}/src/${f}`).href);
const S = await load("search.ts");
const { parseFen } = await load("fen.ts");
const { squareName } = await load("position.ts");
const FEN: Record<string, string> = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const lab = (m: { from: number; to: number }) => `${squareName(m.from)}${squareName(m.to)}`;
for (const name of names) {
  const row: Record<string, unknown> = { name };
  for (const door of ["search", "searchWithoutPvsOrReductions", "searchWithoutPruning"]) {
    const t0 = performance.now();
    const r = S[door](parseFen(FEN[name] as string), 3);
    row[door] = { score: r.score, move: lab(r.move), nodes: r.nodes, s: +((performance.now() - t0) / 1000).toFixed(1) };
  }
  console.log(JSON.stringify(row));
}
