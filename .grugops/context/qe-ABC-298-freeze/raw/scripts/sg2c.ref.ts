/**
 * qe-ABC-298-freeze: SG2 (c)'s hand cases (raw/sg2-cases.json "sg2c"), read on MAIN, to show each case is reached
 * and not vacuous before any build exists. Scratch only: copied into a `git archive` of main as
 * src/qe298-sg2c.ref.test.ts and run there with one worker. It is not a src/ row; the build writes its own rows.
 *
 * The table holds the seed: after every clearTable the seed is stored in the node's slot at depth 0 (tableCutoff
 * cuts only at the exact depth, so it never cuts on it), and every storeEntry for the node's key writes the seed's
 * bits in place of its move. A makeMove spy counts any make of the seed on the node. Precondition rows read, on
 * main, that the node's probe hit, its tableCutoff at remaining 1 or 2 returned null, and entryMove read that slot.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { chooseMove } from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { search } from "./search.ts";
import { zobristKey } from "./zobrist.ts";

type Seed = { from: number; to: number; promotion: number };
const s = vi.hoisted(() => ({
  seed: null as Seed | null,
  nodeKey: 0n,
  key: null as null | ((p: unknown) => bigint),
  lastSlot: -1,
  cutDepth: -1,
  readDepths: [] as number[],
  entryReads: [] as number[],
  made: 0,
}));

vi.mock("./transposition.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./transposition.ts")>();
  const seedMove = (): Move => ({ from: s.seed!.from, to: s.seed!.to, promotion: s.seed!.promotion, piece: 0, captured: 0, flags: 0 });
  return {
    ...actual,
    clearTable: () => {
      actual.clearTable();
      if (s.seed) actual.storeEntry(s.nodeKey, 0, actual.BOUND_LOWER, 0, 0, seedMove());
    },
    storeEntry: (...a: Parameters<typeof actual.storeEntry>) => {
      const [key, depth, bound, score, ply, move] = a;
      actual.storeEntry(key, depth, bound, score, ply, s.seed && key === s.nodeKey ? seedMove() : move);
    },
    probeTable: (key: bigint) => {
      const slot = actual.probeTable(key);
      s.lastSlot = s.seed && key === s.nodeKey ? slot : -1;
      s.cutDepth = -1;
      return slot;
    },
    tableCutoff: (...a: Parameters<typeof actual.tableCutoff>) => {
      const r = actual.tableCutoff(...a);
      if (s.lastSlot !== -1 && a[0] === s.lastSlot && r === null) {
        s.cutDepth = a[1];
        s.readDepths.push(a[1]);
      }
      return r;
    },
    entryMove: (slot: number, moves: readonly Move[]) => {
      if (s.lastSlot !== -1 && slot === s.lastSlot && s.cutDepth !== -1) s.entryReads.push(s.cutDepth);
      return actual.entryMove(slot, moves);
    },
  };
});
vi.mock("./apply.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./apply.ts")>();
  return {
    ...actual,
    makeMove: (...a: Parameters<typeof actual.makeMove>) => {
      const [position, move] = a;
      const sd = s.seed;
      if (sd && move.from === sd.from && move.to === sd.to && move.promotion === sd.promotion && s.key!(position) === s.nodeKey) s.made++;
      return actual.makeMove(...a);
    },
  };
});

const CASES = JSON.parse(readFileSync(process.env.SG2_CASES ?? "", "utf8")).sg2c;
const six = (m: Move) => [m.from, m.to, m.piece, m.captured, m.flags, m.promotion].join(",");
const CALLS: Record<string, { run: (fen: string) => { move: Move | null; score: number; nodes: number; p: ReturnType<typeof parseFen> }; want: number[] }> = {
  S1: { run: (f) => { const p = parseFen(f); const r = search(p, 2); return { ...r, p }; }, want: [1] },
  S2: { run: (f) => { const p = parseFen(f); const r = search(p, 3); return { ...r, p }; }, want: [2] },
  S3: { run: (f) => { const p = parseFen(f); const r = chooseMove(p, { budgetMs: 1e9, now: () => 0, maxDepth: 2 })!; return { ...r, p }; }, want: [1] },
  S4: { run: (f) => { const p = parseFen(f); const r = chooseMove(p, { budgetMs: 1e9, now: () => 0, maxDepth: 3 })!; return { ...r, p }; }, want: [1, 2] },
};

describe("qe-ABC-298-freeze SG2 (c) on main: the seeded node is reached and its seed is never made", () => {
  s.key = zobristKey as (p: unknown) => bigint;
  for (const seed of CASES.seeds) {
    for (const [id, call] of Object.entries(CALLS)) {
      it(`${seed.id} ${id}`, () => {
        s.seed = { from: seed.from, to: seed.to, promotion: seed.promotion };
        s.nodeKey = zobristKey(parseFen(CASES.node.fen));
        s.readDepths = [];
        s.entryReads = [];
        s.made = 0;
        const fen0 = CASES.root;
        const key0 = zobristKey(parseFen(fen0));
        const r = call.run(fen0);
        s.seed = null;
        const legal = legalMoves(parseFen(fen0)).map(six);
        console.log(
          `QE298-SG2C ${JSON.stringify({ seed: seed.id, call: id, readDepths: [...new Set(s.readDepths)].sort(), entryReads: [...new Set(s.entryReads)].sort(), made: s.made, move: r.move ? six(r.move) : null, score: r.score, nodes: r.nodes })}`,
        );
        for (const d of call.want) expect(s.entryReads).toContain(d);
        expect(s.made).toBe(0);
        expect(r.move).not.toBeNull();
        expect(legal).toContain(six(r.move as Move));
        expect(toFen(r.p)).toBe(fen0);
        expect(zobristKey(r.p)).toBe(key0);
      });
    }
  }
});
