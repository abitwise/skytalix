// Out-of-tree vitest harness: the ruling's options timed UNDER THE RUNNER, one case per `it`.
// ORACLE_CASES="pair:off:kiwipete:3,a7:off:3,src:position-4:3,..." — records one JSON line each.
import { appendFileSync } from "node:fs";
import { loadavg } from "node:os";
import { it } from "vitest";
import { parseFen } from "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-af43b0d4b90d3dbd1/src/fen.ts";
import { search, searchWithoutPruning } from "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-af43b0d4b90d3dbd1/src/search.ts";
import { root, variant } from "./oracle-lib.ts";

const OUT = new URL("./vt-results.jsonl", import.meta.url).pathname;
const CORPUS: Record<string, string> = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-3": "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const ms = (t: number) => Math.round(performance.now() - t);

for (const spec of (process.env.ORACLE_CASES ?? "").split(",").filter(Boolean)) {
  it(spec, () => {
    const [mode, a, b, c] = spec.split(":");
    const l0 = loadavg()[0].toFixed(2);
    let rec: Record<string, unknown>;
    if (mode === "pair") {
      const v = variant(a as string);
      const pos = parseFen(CORPUS[b as string]);
      let t = performance.now();
      const p = root(pos, Number(c), { prune: true, ...v });
      const tp = ms(t);
      t = performance.now();
      const u = root(pos, Number(c), { prune: false, ...v });
      const tu = ms(t);
      rec = { spec, prunedNodes: p.nodes, unprunedNodes: u.nodes, score: p.score, A1: Object.is(p.score, u.score), A2ratio: +(p.nodes / u.nodes).toFixed(4), prunedMs: tp, unprunedMs: tu, wallMs: tp + tu };
    } else if (mode === "src") {
      // src/'s own exports, exactly as searchPair() calls them — the control against the copy.
      const pos = parseFen(CORPUS[a as string]);
      let t = performance.now();
      const p = search(pos, Number(b));
      const tp = ms(t);
      t = performance.now();
      const u = searchWithoutPruning(pos, Number(b));
      const tu = ms(t);
      rec = { spec, prunedNodes: p.nodes, unprunedNodes: u.nodes, A1: Object.is(p.score, u.score), prunedMs: tp, unprunedMs: tu, wallMs: tp + tu };
    } else {
      // a7:<variant>:<unpruned depth> — A7's deep case as written: shipped search at 3 + unpruned.
      const v = variant(a as string);
      const per: Record<string, number> = {};
      const t0 = performance.now();
      for (const [name, fen] of Object.entries(CORPUS)) {
        const pos = parseFen(fen);
        const t = performance.now();
        search(pos, 3);
        root(pos, Number(b), { prune: false, ...v });
        per[name] = ms(t);
      }
      rec = { spec, perRootMs: per, wallMs: ms(t0) };
    }
    appendFileSync(OUT, `${JSON.stringify({ ...rec, load0: l0, load1: loadavg()[0].toFixed(2) })}\n`);
  }, 900_000);
}
