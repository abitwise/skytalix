// SCRATCH PROBE (arch-ABC-270), batch A on the UNPATCHED main copy: k3probe.ts's `nodes` mode without a form (I1).
import { chooseMove } from "./src/engine.ts";
import { parseFen } from "./src/fen.ts";
import { squareName } from "./src/position.ts";
import { search } from "./src/search.ts";
const FEN: Record<string, string> = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const rec = process.env.REC ?? "choose";
for (const name of (process.env.POS ?? "kiwipete,position-6").split(",")) {
  for (const d of (process.env.DS ?? "7,8").split(",").map(Number)) {
    const r: any = rec === "search" ? search(parseFen(FEN[name] as string), d) : chooseMove(parseFen(FEN[name] as string), { budgetMs: 1e9, now: () => 0, maxDepth: d });
    console.log(JSON.stringify({ form: "MAIN", rec, name, d, nodes: r.nodes, score: r.score, move: mv(r.move) }));
  }
}
