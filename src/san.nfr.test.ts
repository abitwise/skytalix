/**
 * `ABC-013`'s `N1` bar, as a permanent STRUCTURAL guard — the call counts the ratio rests on.
 *
 * `N1` is *"the mean `toSan(position, move, legal)` at `P60` is <= 1/5 of the mean
 * `toSan(position, move)` over the same 42 moves"*, and the ticket calls it the primary bar because
 * it is a ratio and therefore machine-independent. What MAKES it a ratio is a call count:
 * `ADR-0004` measured SAN at ~97% `legalMoves` and ~3% string work, so the optional parameter buys
 * exactly the generations it saves, and nothing else.
 *
 * THE MICROSECONDS ARE NOT ASSERTED HERE, and that is this project's standing rule rather than a
 * shortcut: `gameend.nfr.test.ts` states it (*"These are CALL-COUNT bars only. Wall-clock cost is
 * not asserted anywhere in this suite — it is machine-dependent, and it is measured with its
 * machine"*) and `glyph-mode.nfr.test.ts` repeats it. `N2`/`N3`/`N4` are wall-clock bars on named
 * hardware and belong to the Security/NFR gate's out-of-tree measurement at `P60`, which is what
 * `A21` asks for. This file is the guard underneath that measurement, not a substitute for it.
 *
 * A MEASUREMENT IS NOT A GUARD — `plans/nfr-catalog.md` records that lesson twice, both times after
 * a behaviour-equivalent mutation left the whole suite green. The same hole is open here: every one
 * of the 52 rows in `san.test.ts` is blind to how often `toSan` generates. A build that ignored the
 * supplied `legal` list and regenerated, or one that ran the mate test on every move instead of
 * only on a checking one, returns byte-identical strings for all of them. These assertions are the
 * only ones that would notice.
 *
 * It lives in its own file for the reason `gameend.nfr.test.ts` gives: a `vi.mock` factory is
 * hoisted to file scope, so putting it in `san.test.ts` would re-route the module graph for the
 * whole acceptance table to buy four assertions.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseFen } from "./fen.ts";
import type { Move } from "./moves.ts";
import { type Position, parseSquareName } from "./position.ts";

vi.mock("./legal.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./legal.ts")>();
  return { ...actual, legalMoves: vi.fn(actual.legalMoves) };
});

const { legalMoves } = await import("./legal.ts");
const { toSan } = await import("./san.ts");

/** The benchmark position `ABC-013` pins as a literal FEN: 42 legal moves, 3 of which give check. */
const P60 = "1rb4r/3k4/p1ppNn2/1p1np1Q1/1q1P1B1P/PRP2p2/3KP1BR/6N1 w - - 2 31";

const position: Position = parseFen(P60);
const legal: readonly Move[] = legalMoves(position);

/** The move `from`-`to` out of `P60`'s legal list — the same selector the acceptance table uses. */
function moveFor(from: string, to: string): Move {
  const fromSquare = parseSquareName(from);
  const toSquare = parseSquareName(to);
  const move = legal.find(
    (candidate) => candidate.from === fromSquare && candidate.to === toSquare,
  );
  if (move === undefined) throw new Error(`${from}-${to} is not legal at P60`);
  return move;
}

/** A quiet pawn push: no rival list is needed at all, because pawns carry no disambiguator. */
const PAWN_MOVE = moveFor("e2", "e3");
/** A quiet piece move: needs the rival list, and nothing else. */
const PIECE_MOVE = moveFor("g1", "h3");
/** A CHECKING piece move: additionally pays the mate test, which is a second full generation. */
const CHECKING_MOVE = moveFor("g5", "g7");

describe("N1 — toSan generates the legal moves only when it has to (call counts, spied)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("generates NOT AT ALL when the caller supplies the list and the move is not a check", () => {
    // This is the whole of what the optional parameter buys, and it is what makes N1 a ratio
    // rather than a machine-dependent number.
    toSan(position, PAWN_MOVE, legal);
    expect(legalMoves, "pawn move, list supplied").toHaveBeenCalledTimes(0);

    vi.clearAllMocks();
    toSan(position, PIECE_MOVE, legal);
    expect(legalMoves, "piece move, list supplied").toHaveBeenCalledTimes(0);
  });

  it("generates NOT AT ALL for an unassisted quiet PAWN move — a pawn has no rivals to weigh", () => {
    // The asymmetry the ticket records at 0.133 µs against 5.16 µs, asserted structurally: the
    // disambiguator is never reached on the pawn branch, so the list is never built.
    toSan(position, PAWN_MOVE);
    expect(legalMoves, "pawn move, no list").toHaveBeenCalledTimes(0);
  });

  it("generates EXACTLY ONCE for an unassisted quiet piece move", () => {
    toSan(position, PIECE_MOVE);
    expect(legalMoves, "piece move, no list").toHaveBeenCalledTimes(1);
  });

  it("pays EXACTLY ONE extra generation for the mate test, and only on a checking move", () => {
    // ADR-0004: "mate is additionally legalMoves(after).length === 0". That second generation is
    // unavoidable and is why N2/N3/N4 have to name their move population — but it must be paid
    // once, on the position AFTER the move, and only when the move actually gives check.
    toSan(position, CHECKING_MOVE, legal);
    expect(legalMoves, "checking move, list supplied").toHaveBeenCalledTimes(1);

    vi.clearAllMocks();
    toSan(position, CHECKING_MOVE);
    expect(legalMoves, "checking move, no list").toHaveBeenCalledTimes(2);
  });

  it("still returns the right strings while spied, so the counts above cannot pass vacuously", () => {
    // A `toSan` that had stopped doing anything would satisfy every count above and prove nothing.
    expect(toSan(position, PAWN_MOVE, legal)).toBe("e3");
    expect(toSan(position, PIECE_MOVE, legal)).toBe("Nh3");
    expect(toSan(position, CHECKING_MOVE, legal)).toBe("Qg7+");
  });
});
