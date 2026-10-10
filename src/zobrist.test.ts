import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFenGrammarOnly as parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { FLAG_CASTLE, FLAG_EN_PASSANT, FLAG_PROMOTION, generateMoves, type Move } from "./moves.ts";
import { NO_SQUARE, PAWN, type Position, parseSquareName, pieceType } from "./position.ts";
import { zobristKey, zobristKeyAfterMove } from "./zobrist.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** The key of `position` as if it carried no en-passant square. Restores the field it borrows. */
function keyWithoutEpSquare(position: Position): bigint {
  const epSquare = position.epSquare;
  position.epSquare = NO_SQUARE;
  const key = zobristKey(position);
  position.epSquare = epSquare;
  return key;
}

describe("zobristKey", () => {
  it("is deterministic — the same position hashes to the same key", () => {
    expect(zobristKey(parseFen(START_FEN))).toBe(zobristKey(parseFen(START_FEN)));
  });

  it("ignores the move counters, which do not affect repetition", () => {
    const a = parseFen(START_FEN);
    const b = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 7 20");
    expect(zobristKey(a)).toBe(zobristKey(b));
  });

  it("depends on the side to move", () => {
    const white = zobristKey(parseFen(START_FEN));
    const black = zobristKey(parseFen(START_FEN.replace(" w ", " b ")));
    expect(white).not.toBe(black);
  });

  it("depends on castling rights", () => {
    const all = zobristKey(parseFen("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1"));
    const some = zobristKey(parseFen("r3k2r/8/8/8/8/8/8/R3K2R w Kkq - 0 1"));
    expect(all).not.toBe(some);
  });

  it("depends on en-passant availability", () => {
    const withEp = zobristKey(parseFen("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1"));
    const withoutEp = zobristKey(parseFen("4k3/8/8/3pP3/8/8/8/4K3 w - - 0 1"));
    expect(withEp).not.toBe(withoutEp);
  });

  it("separates an ep square no capture can use — ABC-075 A3, the ep-set-no-capture class", () => {
    // One ply after 1.e4. No black pawn on d4 or f4, so nothing can take en passant. ABC-011
    // collapsed this pair (FIDE 9.2.3); ADR-0020 Decision 1 reverses it — "the en-passant
    // component enters the key if and only if `position.epSquare !== NO_SQUARE`" — so the pair
    // hashes differently again, the owner's deliberate trade (2026-09-19, "relax to ep square set").
    const withEp = zobristKey(
      parseFen("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"),
    );
    const withoutEp = zobristKey(
      parseFen("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"),
    );
    expect(withEp).not.toBe(withoutEp);
  });

  it("still separates the pair where the ep capture is real — the ABC-011 regression guard", () => {
    // Same position with a black pawn on d4, so d4xe3 is a genuine capture and the two
    // positions genuinely differ. The fix must collapse the pair above without collapsing this one.
    const withEp = zobristKey(
      parseFen("rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"),
    );
    const withoutEp = zobristKey(
      parseFen("rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"),
    );
    expect(withEp).not.toBe(withoutEp);
  });

  it("separates an ep square whose only capture is illegal — ABC-075 A3, second case of the class", () => {
    // c5xd6 is pseudo-legal but leaves the a5 king bare to the h5 rook along rank 5, so it is
    // not one of FIDE 9.2.3's "possible moves" and ADR-0005 collapsed the pair. ADR-0020
    // Decision 1 keys on the field, not the capture: "the `hasLegalEnPassant(position)` conjunct
    // is removed from the hash's definition", so a board-only reading — which leaves these
    // different — is now the ruled one.
    const withEp = zobristKey(parseFen("7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1"));
    const withoutEp = zobristKey(parseFen("7k/8/8/K1Pp3r/8/8/8/8 w - - 0 1"));
    expect(withEp).not.toBe(withoutEp);
  });

  it("restores the key exactly after a move is made and unmade", () => {
    const position = parseFen(START_FEN);
    const before = zobristKey(position);
    const move = generateMoves(position).find(
      (candidate) =>
        candidate.from === parseSquareName("e2") && candidate.to === parseSquareName("e4"),
    );
    if (move === undefined) throw new Error("expected e2-e4");

    const undo = makeMove(position, move);
    expect(zobristKey(position)).not.toBe(before); // the position genuinely changed
    unmakeMove(position, move, undo);
    expect(zobristKey(position)).toBe(before); // and comes all the way back
  });
});

// ---------------------------------------------------------------------------
// ABC-011 property test, re-pointed at ABC-075 — the guard that generalizes past the
// hand-picked FENs. Under ADR-0005 the oracle was `legalMoves(...).some(FLAG_EN_PASSANT)`;
// under ADR-0020 Decision 1 the component "enters the key if and only if
// `position.epSquare !== NO_SQUARE`", so the oracle is the field itself, checked at EVERY
// node of the walk rather than only at double pushes (where the field is always set and the
// collapse half of the count would be empty by construction).
// ---------------------------------------------------------------------------

/** The six perft positions, mirroring the table in src/perft.test.ts — a local copy, as legal.test.ts keeps. */
const PERFT_POSITIONS: ReadonlyArray<readonly [name: string, fen: string]> = [
  ["startpos", START_FEN],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];

/** Two ranks in 0x88 — the signed distance apply.ts uses to recognise a double push. */
const DOUBLE_PUSH = 32;

const isDoublePush = (move: Move): boolean =>
  pieceType(move.piece) === PAWN && Math.abs(move.to - move.from) === DOUBLE_PUSH;

/**
 * Plays every legal line `plies` deep from `position` and, at every node, compares the key of
 * the resulting position against the key of that same position with its `epSquare` cleared.
 * They must be equal exactly when the position carries no ep square (ADR-0020 Decision 1).
 * Returns how many nodes it checked and how many carried an ep square (every double push, and
 * only those), so the caller can assert that BOTH halves of the property were exercised.
 */
function checkEpComponent(position: Position, plies: number): { checked: number; ep: number } {
  let checked = 0;
  let ep = 0;

  for (const move of legalMoves(position)) {
    const undo = makeMove(position, move);

    const carried = position.epSquare !== NO_SQUARE;
    expect(carried, `${toFen(position)} — double push: ${isDoublePush(move)}`).toBe(
      isDoublePush(move),
    );
    const collapsed = zobristKey(position) === keyWithoutEpSquare(position);
    // Built eagerly: toFen over a few thousand nodes is cheaper than the walk around it.
    expect(collapsed, `${toFen(position)} — ep square carried: ${carried}`).toBe(!carried);
    checked++;
    if (carried) ep++;

    if (plies > 1) {
      const deeper = checkEpComponent(position, plies - 1);
      checked += deeper.checked;
      ep += deeper.ep;
    }

    unmakeMove(position, move, undo);
  }

  return { checked, ep };
}

describe("ABC-075 property — the ep component tracks the ep FIELD, not availability (ADR-0020)", () => {
  it("holds at every node within 2 plies of every perft position", () => {
    let checked = 0;
    let carried = 0;

    for (const [, fen] of PERFT_POSITIONS) {
      const walked = checkEpComponent(parseFen(fen), 2);
      checked += walked.checked;
      carried += walked.ep;
    }

    // Neither half of the property may go unexercised. The walk must have seen nodes at all,
    // at least one that carries an ep square (the component-present case) and at least one
    // that does not (the collapse case) — a vacuous walk would otherwise pass green. Under
    // ADR-0005 this counted 557 double pushes, 52 answered by a legal capture and 505 not; the
    // 557 now all sit in `carried`, and the collapse half is every other node.
    expect(checked).toBeGreaterThan(0);
    expect(carried).toBeGreaterThan(0);
    expect(checked - carried).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// ABC-011 QE additions. Two holes the mutation campaign at the In Review gate found in
// the suite above, both closed here; the production code was already correct in both.
// ---------------------------------------------------------------------------

/** Everything zobristKey may read and must not change. */
function positionSnapshot(position: Position): string {
  return [
    position.board.join(","),
    position.blackToMove,
    position.castling,
    position.epSquare,
    position.halfmoveClock,
    position.fullmoveNumber,
  ].join("|");
}

describe("ABC-011 QE — the ep component still distinguishes what FIDE distinguishes", () => {
  it("separates two positions that differ ONLY in which file the ep target stands on", () => {
    // Same placement, same side to move, same castling rights; b6 vs d6 as the ep target, and
    // a legal ep capture answers each. FIDE 9.2.3 calls these different positions, so the keys
    // must differ. Nothing else in the suite pins the FILE: mutating the XOR to a constant
    // EP_FILE[0] leaves every other test green (on this branch AND on the pre-ABC-011 tree),
    // and the collapsed key would then declare a repetition that never happened — a FALSE
    // draw, the opposite of ABC-011's own "the error direction is the safe one".
    const bFile = zobristKey(parseFen("4k3/8/8/1pPpP3/8/8/8/4K3 w - b6 0 1"));
    const dFile = zobristKey(parseFen("4k3/8/8/1pPpP3/8/8/8/4K3 w - d6 0 1"));
    expect(bFile).not.toBe(dFile);
  });

  it("keeps the key different when the SECOND candidate capturer is the legal one", () => {
    // The key-level half of legal.test.ts's QE edge probe: c5xd6 is pinned, e5xd6 is not, so
    // an ep capture IS available and the two positions genuinely differ.
    const withEp = zobristKey(parseFen("2r4k/8/8/2PpP3/8/8/8/2K5 w - d6 0 1"));
    const withoutEp = zobristKey(parseFen("2r4k/8/8/2PpP3/8/8/8/2K5 w - - 0 1"));
    expect(withEp).not.toBe(withoutEp);
  });
});

describe("ABC-011 QE — zobristKey returns the position exactly as it found it", () => {
  it("is byte-pure at every node of a 2-ply walk from all six perft positions", () => {
    // Since ABC-011 the key plays a move and takes it back, so "transiently mutates" is only
    // safe if the restore is exact at EVERY node, not on the four hand-picked FENs the
    // predicate's own purity test uses. Asserted over the whole reachable population, and
    // over the full position state rather than through toFen, which cannot see the counters.
    const impure: string[] = [];
    let nodes = 0;
    let withEpComponent = 0;

    const walk = (position: Position, plies: number): void => {
      for (const move of legalMoves(position)) {
        const undo = makeMove(position, move);

        const before = positionSnapshot(position);
        const key = zobristKey(position);
        if (positionSnapshot(position) !== before) impure.push(toFen(position));
        nodes++;
        // An ep component was XORed in, so hasLegalEnPassant returned true and the make/unmake
        // path inside the key actually ran on this node — that is the path purity is about.
        if (key !== keyWithoutEpSquare(position)) withEpComponent++;

        if (plies > 1) walk(position, plies - 1);
        unmakeMove(position, move, undo);
      }
    };

    for (const [, fen] of PERFT_POSITIONS) walk(parseFen(fen), 2);

    expect(impure).toEqual([]);
    expect(nodes).toBeGreaterThan(0);
    expect(withEpComponent).toBeGreaterThan(0); // the mutating path was genuinely exercised
  });
});

// ---------------------------------------------------------------------------
// ABC-011 second pass, re-pointed at ABC-075 — the key-level half on the class where the board
// contradicts the ep square. Under ADR-0005 the predicate answered `false` there, so the ep
// component was omitted; under ADR-0020 Decision 1 "the `hasLegalEnPassant(position)` conjunct
// is removed from the hash's definition" and the component enters "if and only if
// `position.epSquare !== NO_SQUARE`" — `parseFen` keeps a contradicted ep square (ADR-0005
// rejected upstream normalisation on FEN round-trip grounds and ADR-0020 leaves that in place),
// so these positions now hash DIFFERENTLY from their no-ep twins. The purity half is unchanged
// and is now a regression guard against anyone re-introducing a probe move.
// NOTE: ADR-0020's Consequences listed these blocks as "stay green"; the key half does not, by
// Decision 1's own words, and was re-pointed at the ABC-075 hop rather than deleted.
// ---------------------------------------------------------------------------

/** The same table src/legal.test.ts drives the predicate with — the boards that contradict their own ep square. */
const CONTRADICTORY_EP: [label: string, fen: string][] = [
  ["no pawn to capture at all", "4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1"],
  ["a WHITE pawn where the captured black one should be", "4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1"],
  ["an ep square on the wrong rank for the side to move", "4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1"],
  ["a white pawn standing ON the ep target", "4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1"],
  ["the ep target occupied by an enemy knight", "4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1"],
  ["the same, mirrored", "4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1"],
];

describe("ABC-075 — zobristKey where the board contradicts the ep square (ADR-0020)", () => {
  it.each(CONTRADICTORY_EP)(
    "carries the ep component and returns the position intact (%s)",
    (_label, fen) => {
      const position = parseFen(fen);
      // Taken on a FRESH copy, so a corrupting key cannot poison its own reference value.
      const reference = keyWithoutEpSquare(parseFen(fen));
      const before = positionSnapshot(position);

      expect(zobristKey(position), fen).not.toBe(reference);
      expect(positionSnapshot(position), fen).toBe(before);
    },
  );
});

// ---------------------------------------------------------------------------
// ABC-011 QE second pass, re-pointed at ABC-075 — the key-level half of "the guards name a
// PIECE, not a side". The reasoning and the two surviving relaxed guards are written out beside
// the twin block in src/legal.test.ts and still hold for the predicate; the KEY no longer
// consults the predicate (ADR-0020 Decision 1), so on these four boards the ep component is
// present by the field alone. Same re-point as the block above; the purity half is unchanged.
// ---------------------------------------------------------------------------

/** The same four boards src/legal.test.ts drives the predicate with — contradicted by a piece that IS there. */
const EP_CONTRADICTED_BY_THE_WRONG_PIECE: [label: string, fen: string][] = [
  ["an enemy KNIGHT, not a pawn, on the ep capture square", "4k3/8/8/3nP3/8/8/8/4K3 w - d6 0 1"],
  ["an enemy ROOK, not a pawn, on the ep capture square", "k7/8/8/8/3pR3/8/8/4K3 b - e3 0 1"],
  ["the mover's OWN knight standing on the ep target", "4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1"],
  ["the same, mirrored", "7k/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1"],
];

describe("ABC-075 — zobristKey where the wrong piece contradicts the ep square (ADR-0020)", () => {
  it.each(EP_CONTRADICTED_BY_THE_WRONG_PIECE)(
    "carries the ep component and returns the position intact (%s)",
    (_label, fen) => {
      const position = parseFen(fen);
      const reference = keyWithoutEpSquare(parseFen(fen));
      const before = positionSnapshot(position);

      expect(zobristKey(position), fen).not.toBe(reference);
      expect(positionSnapshot(position), fen).toBe(before);
    },
  );
});

// ---------------------------------------------------------------------------
// ABC-075 — the incremental key against the full-scan oracle (ADR-0020 Decision 3).
// `zobristKeyAfterMove(keys[ply], after, move, undo)` must equal `zobristKey(after)` at EVERY
// node (A1, 0 mismatches), and after every unmake the oracle must read `keys[ply]` again (A2,
// 0 drift). The walk feeds each node's INCREMENTAL key to its children, exactly as the search's
// per-ply array will (ABC-081), so an error anywhere compounds into the subtree below it rather
// than being masked by a fresh full scan. Depth 2 over the six perft positions and the hand-
// picked classes runs in the default lane; the criteria's depth 4 runs under `ZOBRIST_DEEP=1`
// (kiwipete alone is 4.1 M nodes at depth 4, far beyond N8-LANE's 650 ms). Unset, the deep case
// is not defined at all — absent, never skipped — the same shape as `PERFT_DEEP`.
// ---------------------------------------------------------------------------

const RUN_DEEP = process.env.ZOBRIST_DEEP === "1";

/** What the oracle walk saw: enough to prove it was not vacuous on any delta component. */
interface OracleTally {
  nodes: number;
  mismatches: string[];
  drift: string[];
  epCaptures: number;
  castles: number;
  promotions: number;
  captures: number;
  epSet: number;
  castlingChanged: number;
}

function emptyTally(): OracleTally {
  return {
    nodes: 0,
    mismatches: [],
    drift: [],
    epCaptures: 0,
    castles: 0,
    promotions: 0,
    captures: 0,
    epSet: 0,
    castlingChanged: 0,
  };
}

/** The first few offenders are enough to debug with; an unbounded list would swamp the report. */
const MAX_REPORTED = 10;

function walkOracle(
  position: Position,
  keyBefore: bigint,
  plies: number,
  tally: OracleTally,
): void {
  for (const move of legalMoves(position)) {
    const undo = makeMove(position, move);

    const key = zobristKeyAfterMove(keyBefore, position, move, undo);
    tally.nodes++;
    if (key !== zobristKey(position) && tally.mismatches.length < MAX_REPORTED) {
      tally.mismatches.push(toFen(position));
    }
    if ((move.flags & FLAG_EN_PASSANT) !== 0) tally.epCaptures++;
    if ((move.flags & FLAG_CASTLE) !== 0) tally.castles++;
    if ((move.flags & FLAG_PROMOTION) !== 0) tally.promotions++;
    if (undo.captured !== 0) tally.captures++;
    if (position.epSquare !== NO_SQUARE) tally.epSet++;
    if (undo.castling !== position.castling) tally.castlingChanged++;

    if (plies > 1) walkOracle(position, key, plies - 1, tally);

    unmakeMove(position, move, undo);
    if (zobristKey(position) !== keyBefore && tally.drift.length < MAX_REPORTED) {
      tally.drift.push(toFen(position));
    }
  }
}

function walkAll(fens: readonly string[], plies: number): OracleTally {
  const tally = emptyTally();
  for (const fen of fens) {
    const position = parseFen(fen);
    walkOracle(position, zobristKey(position), plies, tally);
  }
  return tally;
}

/**
 * A3 — the two en-passant classes, drawn from ADR-0005's own examples (the pairs above), and
 * A4 — castling RIGHTS, not availability (ADR-0006). Each is the position BEFORE the walk, so
 * the delta is exercised on the ep file going OUT (every non-double-push from an ep-set node),
 * going IN (every double push), and on the FLAG_EN_PASSANT capture itself where one is legal.
 */
const HAND_PICKED: ReadonlyArray<readonly [label: string, fen: string]> = [
  // A3, class 1: ep square set, NO legal capture — the ABC-011 defect pair and the pinned pair.
  [
    "ep set, no capture at all (1.e4)",
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
  ],
  ["ep set, only capture illegal (pinned along rank 5)", "7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1"],
  // A3, class 2: ep square set AND a legal capture exists.
  ["ep set, capture legal (d4xe3)", "rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"],
  ["ep set, second capturer legal (e5xd6)", "2r4k/8/8/2PpP3/8/8/8/2K5 w - d6 0 1"],
  ["ep set, both capturers legal, b-file", "4k3/8/8/1pPpP3/8/8/8/4K3 w - b6 0 1"],
  // A4: white's kingside castle is BLOCKED by the f1 bishop but the right survives — and after
  // the bishop steps aside the castle becomes available with the rights untouched.
  ["castling right survives a blocked rook", "r3k2r/8/8/8/8/8/8/R3KB1R w KQkq - 0 1"],
];

describe("ABC-075 — zobristKeyAfterMove equals the full-scan oracle at every node", () => {
  it("A1/A2 — 0 mismatches and 0 drift within 2 plies of every perft position", () => {
    const tally = walkAll(
      PERFT_POSITIONS.map(([, fen]) => fen),
      2,
    );

    expect(tally.mismatches).toEqual([]);
    expect(tally.drift).toEqual([]);
    expect(tally.nodes).toBeGreaterThan(0);
    // Every component of the delta was exercised at least once, or the walk proves nothing
    // about it: the ep capture square, the rook's leg, the promoted piece, an ordinary capture,
    // the ep file going in, and a castling flag going out.
    expect(tally.epCaptures).toBeGreaterThan(0);
    expect(tally.castles).toBeGreaterThan(0);
    expect(tally.promotions).toBeGreaterThan(0);
    expect(tally.captures).toBeGreaterThan(0);
    expect(tally.epSet).toBeGreaterThan(0);
    expect(tally.castlingChanged).toBeGreaterThan(0);
  });

  it.each(HAND_PICKED)("A3/A4 — 0 mismatches and 0 drift within 2 plies of: %s", (_label, fen) => {
    const tally = walkAll([fen], 2);
    expect(tally.mismatches).toEqual([]);
    expect(tally.drift).toEqual([]);
    expect(tally.nodes).toBeGreaterThan(0);
  });

  it("A3 — the ep-capture delta itself was exercised on the class where the capture is legal", () => {
    const tally = walkAll(
      HAND_PICKED.filter(([label]) => label.startsWith("ep set, capture")).map(([, fen]) => fen),
      1,
    );
    expect(tally.epCaptures).toBeGreaterThan(0);
    expect(tally.mismatches).toEqual([]);
  });

  it("A4 — hashes castling RIGHTS, not availability (ADR-0006), and the delta agrees", () => {
    const blocked = parseFen("r3k2r/8/8/8/8/8/8/R3KB1R w KQkq - 0 1");
    const blockedNoRight = parseFen("r3k2r/8/8/8/8/8/8/R3KB1R w Qkq - 0 1");
    // Same placement, the kingside castle is unavailable in both; only the RIGHT differs.
    expect(zobristKey(blocked)).not.toBe(zobristKey(blockedNoRight));

    // Stepping the bishop aside makes the castle available and changes no right, so the delta
    // touches no castling component and the incremental key still matches the oracle.
    const move = generateMoves(blocked).find(
      (candidate) =>
        candidate.from === parseSquareName("f1") && candidate.to === parseSquareName("e2"),
    );
    if (move === undefined) throw new Error("expected f1-e2");
    const before = zobristKey(blocked);
    const undo = makeMove(blocked, move);
    expect(undo.castling).toBe(blocked.castling);
    expect(zobristKeyAfterMove(before, blocked, move, undo)).toBe(zobristKey(blocked));
  });

  if (RUN_DEEP) {
    it("A1/A2 at the criteria's depth — 0 mismatches, 0 drift within 4 plies of every perft position [deep, ZOBRIST_DEEP=1]", () => {
      const tally = walkAll(
        PERFT_POSITIONS.map(([, fen]) => fen),
        4,
      );
      expect(tally.mismatches).toEqual([]);
      expect(tally.drift).toEqual([]);
      expect(tally.nodes).toBeGreaterThan(0);
      expect(tally.epCaptures).toBeGreaterThan(0);
      expect(tally.castles).toBeGreaterThan(0);
      expect(tally.promotions).toBeGreaterThan(0);
      // Written out once so the report can quote the walk's size, as ADR-0020 asked.
      console.log(
        `ZOBRIST_DEEP walk: ${JSON.stringify({ ...tally, mismatches: tally.mismatches.length, drift: tally.drift.length })}`,
      );
    }, 600_000);
  }
});
