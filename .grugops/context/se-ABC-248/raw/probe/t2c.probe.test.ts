// se-ABC-248 scratch probe (NOT committed into src/): QE-208-a per-reading and QE-208-b per-root reads.
import { writeFileSync } from "node:fs";
import { it, vi } from "vitest";
import { chooseMove } from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { KING, PAWN, type Position, isBlack, pieceType, EMPTY, isOnBoard } from "./position.ts";
import { search } from "./search.ts";
import { zobristKey } from "./zobrist.ts";

const instrument = vi.hoisted(() => ({ open: 0 }));
vi.mock("./apply.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./apply.ts")>();
  return {
    ...actual,
    makeNullMove: (position: Position) => { instrument.open++; return actual.makeNullMove(position); },
    unmakeNullMove: (position: Position, undo: Parameters<typeof actual.unmakeNullMove>[1]) => {
      instrument.open--; actual.unmakeNullMove(position, undo);
    },
  };
});
const probes = vi.hoisted(() => ({ watch: null as ((key: bigint) => void) | null }));
vi.mock("./transposition.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./transposition.ts")>();
  return { ...actual, probeTable: (key: bigint) => { probes.watch?.(key); return actual.probeTable(key); } };
});

const ROOTS: Record<string, string> = {
  startpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-4": "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "position-5": "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};

it("probe", () => {
  const out: Record<string, unknown> = {};
  const MODE = process.env.SE248_MODE ?? "all";
  if (MODE === "all" || MODE === "a") {
    const per = [];
    const fen = ROOTS["position-6"] as string;
    for (let at = 3; at <= 40; at++) {
      const position = parseFen(fen);
      const before = structuredClone(position);
      instrument.open = 0;
      let readings = 0;
      let inside = false;
      const now = (): number => {
        readings++;
        if (readings === at && instrument.open > 0) inside = true;
        return readings >= at ? 1_000_000_000 : 0;
      };
      let nodes = -1, mutated = "", depth = -1;
      try {
        const choice = chooseMove(position, { budgetMs: 1_000, now });
        if (choice === null) mutated = "null";
        else { nodes = choice.nodes; depth = choice.depth; }
      } catch (e) { mutated = `threw ${String(e).slice(0, 60)}`; }
      if (!mutated && JSON.stringify(position) !== JSON.stringify(before)) mutated = position.blackToMove !== before.blackToMove ? "side" : "other";
      per.push({ at, inside, nodes, depth, mutated, readingsTotal: readings });
    }
    out.a = per;
  }
  if (MODE === "all" || MODE === "b") {
    const roots: Record<string, unknown> = {};
    for (const [name, fen] of Object.entries(ROOTS)) {
      const p0 = parseFen(fen);
      const np = [0, 0];
      for (let sq = 0; sq < 128; sq++) {
        if (!isOnBoard(sq)) continue;
        const piece = p0.board[sq] as number;
        if (piece === EMPTY) continue;
        const t = pieceType(piece);
        if (t !== PAWN && t !== KING) np[isBlack(piece) ? 1 : 0]++;
      }
      const watch = (position: Position, run: () => { nodes: number } | null) => {
        let underNull = 0; let stale = 0; let probesN = 0;
        probes.watch = (key) => { probesN++; if (instrument.open > 0) underNull++; if (key !== zobristKey(position)) stale++; };
        let nodes = -1;
        try { nodes = run()?.nodes ?? -1; } finally { probes.watch = null; }
        return { nodes, underNull, stale, probes: probesN };
      };
      const s = parseFen(fen);
      const rs = watch(s, () => search(s, 6));
      const c = parseFen(fen);
      const rc = watch(c, () => chooseMove(c, { budgetMs: 1_000, now: () => 0, maxDepth: 6 }));
      roots[name] = { nonPawn: np, search6: rs, choose6: rc };
    }
    out.b = roots;
  }
  writeFileSync(process.env.SE248_OUT as string, JSON.stringify(out, null, 1));
}, 600_000);
