/**
 * ABC-016's acceptance criteria, one test each, plus the snapshot matrix the ticket's
 * `## Test notes` calls for.
 *
 * THE CELL STRINGS ARE PINNED AND THE LAYOUT IS NOT. Every assertion below is a substring
 * assertion over the panel's joined rows, exactly as the ticket words it, so which cell packs into
 * which of the three rows stays the engineer's (epic acceptance `4a`). Where a cell's text is a
 * PREFIX of another cell's text the negative is what does the work — `A3` is that place, because
 * `1...` contains `1.`.
 *
 * TWO CONSTRUCTION RULES, both of them load-bearing rather than stylistic:
 *
 *   - **The fixtures never import `src/history.ts`.** A `GameHistory` is a plain
 *     `{ initialFen, moves, position }`, so `gameFrom` builds one from the CORE's own primitives —
 *     `parseFen` + `legalMoves` + `makeMove` — the same independent-oracle move `src/history.test.ts`
 *     makes. The type arrives through `import type`, which is erased. This keeps the structural fact
 *     the ticket's `## Security / NFR triggers` hands to the Security/NFR gate — that nothing pulls
 *     the repetition derive into a frame — true of the test file as well as of the panel.
 *   - **The status is an INPUT and is derived HERE, never by the panel.** `statusOf` does what
 *     `ABC-019`'s loop does once per ply — replay, count keys, call `gameStatus` — so the four claim
 *     cases assert the panel against the claims the rules core actually produces rather than against
 *     a literal this file made up. If a ticket FEN stops producing its stated claim, these go red.
 *
 * The call counts of `A13` are in `src/status-panel.nfr.test.ts`: a `vi.mock` factory is hoisted to
 * file scope and would re-route the module graph for every test here to buy those assertions.
 * No wall-clock assertion appears anywhere in this suite — `A14`'s microseconds live in the ticket
 * and in `plans/nfr-catalog.md` with their machine (`src/zobrist.nfr.test.ts:112`'s standing rule).
 */
import { describe, expect, it } from "vitest";
import { makeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { type GameStatus, gameStatus } from "./gameend.ts";
import type { GameHistory } from "./history.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { type Position, parseSquareName } from "./position.ts";
import { renderStatusPanel, STATUS_ROWS } from "./status-panel.ts";
import { zobristKey } from "./zobrist.ts";

/** Every test file in this suite declares its own copy (AGENTS.md rules 5 and 9). */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** `ABC-020` `A1`'s position: an ordinary board whose only motion is a repeatable shuffle. */
const SHUFFLE_FEN = "6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 0 1";

/** Kh1 Bb6 Kg1 Ba5, twice — eight plies that return the position to its third occurrence. */
const SHUFFLE = ["g1h1", "a5b6", "h1g1", "b6a5", "g1h1", "a5b6", "h1g1", "b6a5"] as const;

/**
 * `1.e4 e5 2.Qh5 g6 3.Qxe5+` — this ticket's ONLY capture and its only check reached BY PLAY.
 * Played rather than loaded on purpose (`## Test notes`, D19): loading the resulting FEN gives the
 * same board with an EMPTY move list, which exercises neither the replay nor `last: Qxe5+`.
 */
const PLAYED_CHECK = ["e2e4", "e7e5", "d1h5", "g7g6", "h5e5"] as const;

/**
 * In check AND a fifty-move claim available, in the SAME render (`A2`, D23). It is `A8` row 2's
 * fifty-move position with the king put in check by the same rook, so it is reachable rather than
 * contrived — but it has to be CONSTRUCTED: QE's 400 seeded 80-ply games produced 2,138 in-check
 * renders and ZERO claimable draws, so no corpus finds this pair.
 */
const CHECK_AND_CLAIM_FEN = "4k3/8/8/8/8/8/8/4R1K1 b - - 100 60";

/**
 * White knights on c2 and e2, BOTH able to capture on d4, so SAN must name the file the knight came
 * from (`A5`, D25). The one case whose last move needs a disambiguator: a build that hands `toSan`
 * an empty legal list renders `Nxd4` here and is correct on every other move this ticket names.
 */
const DISAMBIGUATOR_FEN = "4k3/8/8/8/3p4/8/2N1N3/4K3 w - - 0 1";

/**
 * The engine-thinking text, this file's own copy (AGENTS.md rules 5 and 9). `A7` blanks it to a run
 * of spaces of the SAME LENGTH, which is what the panel reserves when the engine is idle.
 */
const THINKING = "thinking...";

/**
 * A `GameHistory` played from `initialFen` through the named coordinate plies (`"g1f3"`), built
 * from the rules core alone. Throws on an illegal ply, so a fixture can never silently become a
 * shorter game than the criterion it stands under.
 */
function gameFrom(initialFen: string, plies: readonly string[]): GameHistory {
  const position = parseFen(initialFen);
  const moves: Move[] = [];

  for (const ply of plies) {
    const from = parseSquareName(ply.slice(0, 2));
    const to = parseSquareName(ply.slice(2, 4));
    const move = legalMoves(position).find(
      (candidate) => candidate.from === from && candidate.to === to,
    );
    if (move === undefined) throw new Error(`no legal move ${ply}`);
    moves.push(move);
    makeMove(position, move);
  }

  return { initialFen, moves, position };
}

/**
 * The `GameStatus` the loop would hand the panel: the live position's status WITH this game's
 * repetition counts. The counts are replayed from the anchor with the core's own Zobrist keys —
 * `history.ts`'s `repetitionCounts` computes the same thing and is deliberately not used, so this
 * file adds no importer to that module.
 */
function statusOf(history: GameHistory): GameStatus {
  const replay = parseFen(history.initialFen);
  const counts = new Map<bigint, number>();
  const count = (position: Position): void => {
    const key = zobristKey(position);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  };

  count(replay);
  for (const move of history.moves) {
    makeMove(replay, move);
    count(replay);
  }

  return gameStatus(history.position, counts);
}

const panelOf = (history: GameHistory, thinking = false): string[] =>
  renderStatusPanel(history, statusOf(history), thinking);

const textOf = (history: GameHistory, thinking = false): string =>
  panelOf(history, thinking).join("\n");

/**
 * Every case the criteria name, in one list. `A10`, `A11` and `A12` are each written over "every
 * case above", and a list is the only way to make that phrase mean what it says instead of meaning
 * "the two cases the engineer happened to reuse".
 */
const CASES: ReadonlyArray<{ name: string; history: GameHistory; thinking: boolean }> = [
  { name: "start position", history: gameFrom(START_FEN, []), thinking: false },
  { name: "start position, thinking", history: gameFrom(START_FEN, []), thinking: true },
  { name: "after 1.e4", history: gameFrom(START_FEN, ["e2e4"]), thinking: false },
  { name: "after 1.e4 e5", history: gameFrom(START_FEN, ["e2e4", "e7e5"]), thinking: false },
  { name: "after 1.Nf3", history: gameFrom(START_FEN, ["g1f3"]), thinking: true },
  { name: "in check", history: gameFrom("4k3/8/8/8/8/8/8/4R1K1 b - - 0 1", []), thinking: false },
  {
    name: "checkmated",
    history: gameFrom("rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3", []),
    thinking: false,
  },
  {
    name: "played check 3.Qxe5+",
    history: gameFrom(START_FEN, PLAYED_CHECK),
    thinking: false,
  },
  {
    name: "loaded FEN at move 27",
    history: gameFrom("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 27", []),
    thinking: false,
  },
  {
    name: "material -9",
    history: gameFrom("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1", []),
    thinking: false,
  },
  {
    name: "material +8",
    history: gameFrom("rnbqkbnr/pppppppp/8/8/7Q/8/PPPPPPP1/RNBQKBNR w KQkq - 0 1", []),
    thinking: false,
  },
  { name: "threefold claimable", history: gameFrom(SHUFFLE_FEN, SHUFFLE), thinking: false },
  {
    name: "fifty-move claimable",
    history: gameFrom("6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 60", []),
    thinking: false,
  },
  {
    name: "both claimable",
    history: gameFrom("6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 92 60", SHUFFLE),
    thinking: true,
  },
  {
    name: "black may claim",
    history: gameFrom("6k1/5ppp/8/b7/8/8/5PPP/4R1K1 b - - 100 60", []),
    thinking: false,
  },
  // [ADDED — D23] Check crossed with a claimable draw. It belongs in `CASES` so `A7`, `A10`, `A11`
  // and `A12` sweep it and it gets a snapshot.
  {
    name: "in check and fifty-move claimable",
    history: gameFrom(CHECK_AND_CLAIM_FEN, []),
    thinking: false,
  },
  // [ADDED — D25] The last move that needs a SAN disambiguator, for the same four sweeps.
  {
    name: "disambiguated last move",
    history: gameFrom(DISAMBIGUATOR_FEN, ["e2d4"]),
    thinking: false,
  },
];

describe("ABC-016 acceptance", () => {
  it("A1 — names the side to move, both ways, and never both", () => {
    const white = textOf(gameFrom(START_FEN, []));
    expect(white).toContain("White to move");
    expect(white).not.toContain("Black to move");

    const black = textOf(gameFrom(START_FEN, ["e2e4"]));
    expect(black).toContain("Black to move");
    expect(black).not.toContain("White to move");
  });

  it("A2 — states CHECK on a plain check, on a mate, on a check reached by play, and never on a quiet board", () => {
    // The plain-check FEN is the one that kills a build reading the indicator from
    // `status.reason === "checkmate"`: four legal replies, game in progress, and still CHECK.
    expect(textOf(gameFrom("4k3/8/8/8/8/8/8/4R1K1 b - - 0 1", []))).toContain("CHECK");
    expect(textOf(gameFrom(START_FEN, []))).not.toContain("CHECK");
    // A mated board still says CHECK — this panel reports check, not game over.
    const mate = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3";
    expect(textOf(gameFrom(mate, []))).toContain("CHECK");

    // [ADDED — D19b] The check reached BY PLAY, and the only capture on this ticket. Every other
    // in-check case above has an EMPTY move list and every other played case is quiet, so a panel
    // reading the indicator (item 2) or the balance (item 5) out of item 4's REPLAY position — the
    // `Position` it is already holding in order to name the last move — passed every criterion
    // before this case existed. Here the replay is
    // `rnbqkbnr/pppp1p1p/6p1/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 3`: WHITE to move and NOT in
    // check, with the pawn still on e5. The live board is Black to move, in check, a pawn down.
    // Five cells in ONE render, because the discriminator is that they agree with each other.
    const played = textOf(gameFrom(START_FEN, PLAYED_CHECK));
    expect(played).toContain("CHECK");
    expect(played).toContain("Black to move");
    expect(played).toContain("3...");
    expect(played).toContain("last: Qxe5+");
    expect(played).toContain("material: +1");

    // [ADDED — D23] CHECK crossed with a claimable draw, in ONE render. Until this case the two
    // were never crossed anywhere on the ticket, and a build that suppresses `CHECK` whenever a
    // draw is claimable passed every criterion AND every snapshot. Both cells together is the
    // assertion; either one alone is already covered above and in `A8`.
    const checkAndClaim = gameFrom(CHECK_AND_CLAIM_FEN, []);
    const rows = panelOf(checkAndClaim);
    const text = rows.join("\n");
    expect(text).toContain("CHECK");
    expect(text).toContain("Black may claim: fifty-move rule");
    expect(rows).toHaveLength(STATUS_ROWS);
  });

  it("A3 — renders the move number the side to move is about to play, both ways", () => {
    const start = textOf(gameFrom(START_FEN, []));
    expect(start).toContain("1.");
    // Load-bearing: `1...` CONTAINS `1.`, so without this a panel that always renders `N...`
    // satisfies the positive half on every white case.
    expect(start).not.toContain("1...");

    expect(textOf(gameFrom(START_FEN, ["e2e4"]))).toContain("1...");

    const afterE5 = textOf(gameFrom(START_FEN, ["e2e4", "e7e5"]));
    expect(afterE5).toContain("2.");
    expect(afterE5).not.toContain("1.");
  });

  it("A4 — takes the move number from the position, not from the history length", () => {
    const loaded = gameFrom("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 27", []);
    expect(loaded.moves).toHaveLength(0);

    const text = textOf(loaded);
    expect(text).toContain("27.");
    expect(text).not.toContain("1.");
  });

  it("A5 — renders the last move in SAN without corrupting the live board", () => {
    const history = gameFrom(START_FEN, ["g1f3"]);
    // Taken BEFORE the first render: a snapshot taken between two renders is byte-identical
    // across a panel that corrupts the board on every one of them.
    const before = toFen(history.position);

    expect(textOf(history)).toContain("last: Nf3");
    expect(toFen(history.position)).toBe(before);

    const empty = gameFrom(START_FEN, []);
    const rows = panelOf(empty);
    expect(rows.join("\n")).not.toMatch(/last:\s*\S/);
    expect(rows).toHaveLength(STATUS_ROWS);

    // [ADDED — D25] The last move that NEEDS a disambiguator. Knights on c2 and e2 both capture on
    // d4, so SAN must name the file. This is the panel's CALL SHAPE and not `toSan`'s body, which
    // is `ABC-013`'s: a build handing `toSan` an empty legal list disables every disambiguator
    // silently and diverged on 218 of 400 games while passing all three nets. The negative is what
    // does the work — `last: Nexd4` does not contain `last: Nxd4`.
    const disambiguated = textOf(gameFrom(DISAMBIGUATOR_FEN, ["e2d4"]));
    expect(disambiguated).toContain("last: Nexd4");
    expect(disambiguated).not.toContain("last: Nxd4");
  });

  it("A6 — the material balance, as a table of exact integers", () => {
    const cases: ReadonlyArray<[fen: string, expected: string]> = [
      ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "material: 0"],
      ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1", "material: -9"],
      // The promotion case: white one pawn short and one queen up. A board diff against the
      // standard starting complement gets it wrong; a 64-square scan gets it right.
      ["rnbqkbnr/pppppppp/8/8/7Q/8/PPPPPPP1/RNBQKBNR w KQkq - 0 1", "material: +8"],
      // [ADDED — D21] The three rows above vary PAWNS and QUEENS alone, so `KNIGHT`, `BISHOP` and
      // `ROOK` were invisible to every criterion and every snapshot — a `KNIGHT = 4` build diverged
      // on 325 of 400 games and passed all three nets. Each row below removes exactly ONE black
      // piece from the starting complement and reads that piece's value on its own.
      //
      // THREE ROWS AND NOT THE SINGLE JOINT FEN that was available: a position down `R+N+B` reads
      // `+11` and each of `KNIGHT=4`, `BISHOP=4`, `ROOK=6` reads `+12` there, so one row does kill
      // each named build — but a COMPENSATING `KNIGHT=4, BISHOP=2` reads `4+2+5 = +11` and survives
      // it. These kill it on the first row, and each says WHICH integer is wrong when it goes red.
      ["r1bqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "material: +3"],
      ["rn1qkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "material: +3"],
      // `KQk` and not `KQkq`: removing the a8 rook removes Black's queenside right, and `parseFen`
      // accepts the position only when the castling field agrees with the board.
      ["1nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQk - 0 1", "material: +5"],
    ];

    for (const [fen, expected] of cases) {
      expect(textOf(gameFrom(fen, [])), fen).toContain(expected);
    }
  });

  it("A7 — thinking changes the thinking cell and NOTHING else, on every case", () => {
    const history = gameFrom(START_FEN, ["e2e4"]);
    const status = statusOf(history);

    expect(renderStatusPanel(history, status, true).join("\n")).toContain(THINKING);
    expect(renderStatusPanel(history, status, false).join("\n")).not.toContain(THINKING);

    // [REPLACED — D20] The struck clause compared the panel's WIDEST row between the two states.
    // It could not fail on the build `D7` added it to catch: at its own fixture the widest row is
    // 21 and the thinking cell's row is 11, so dropping the reserved cell ENTIRELY still read
    // 21 === 21. It caught a shrinking cell only when that cell happened to sit on the widest row,
    // which is not a property any criterion states.
    //
    // This is the replacement, and it is stronger in the direction that was actually open:
    // `thinking` was an INPUT that no criterion crossed with any CONTENT, because the three
    // criteria that sweep `CASES` assert purity, row count and ASCII and NONE asserts content. So
    // the flag could gate any cell. Blanking `thinking...` to spaces of the same length must leave
    // a panel byte-identical to the idle one, on EVERY case in both states — which kills all five
    // wrong builds on that axis (`CHECK`, the claim cell, the side-to-move cell and the reserved
    // cell each dropped while thinking, and a non-ASCII check cell while thinking) where a single
    // `thinking: true` entry in `CASES` kills one. It subsumes the row count and the per-row width
    // by byte-identity, so neither is asserted separately.
    //
    // It names no row index, no width across different positions and no frame-level term: it
    // compares two renders of the SAME position and history. `ADR-0010` clause 5 refuses a
    // constant-width criterion and this is not one — the panel's width is free to vary between
    // positions, which under clause 1 it does by design.
    const blank = " ".repeat(THINKING.length);

    for (const { name, history: caseHistory } of CASES) {
      const caseStatus = statusOf(caseHistory);
      const busy = renderStatusPanel(caseHistory, caseStatus, true);
      const idle = renderStatusPanel(caseHistory, caseStatus, false);

      expect(
        busy.map((row) => row.replaceAll(THINKING, blank)),
        name,
      ).toEqual(idle);
    }
  });

  it("A8 — the claim cell names the rules that hold and no others", () => {
    const cases: ReadonlyArray<{
      name: string;
      history: GameHistory;
      contains: string;
      absent: string | null;
    }> = [
      {
        name: "threefold only",
        history: gameFrom(SHUFFLE_FEN, SHUFFLE),
        contains: "White may claim: threefold repetition",
        absent: "fifty-move",
      },
      {
        name: "fifty-move only",
        history: gameFrom("6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 60", []),
        contains: "White may claim: fifty-move rule",
        absent: "threefold",
      },
      {
        name: "both",
        history: gameFrom("6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 92 60", SHUFFLE),
        contains: "White may claim: threefold repetition, fifty-move rule",
        absent: null,
      },
      {
        name: "neither",
        history: gameFrom(START_FEN, []),
        contains: "",
        absent: "may claim",
      },
    ];

    for (const testCase of cases) {
      const rows = panelOf(testCase.history);
      const text = rows.join("\n");
      if (testCase.contains !== "") expect(text, testCase.name).toContain(testCase.contains);
      if (testCase.absent !== null) expect(text, testCase.name).not.toContain(testCase.absent);
      // The row count is identical in all four cases — a claim never grows the panel.
      expect(rows, testCase.name).toHaveLength(STATUS_ROWS);
    }
  });

  it("A9 — the claim is READ from status.claimable.by and is never inferred from the board", () => {
    const black = gameFrom("6k1/5ppp/8/b7/8/8/5PPP/4R1K1 b - - 100 60", []);
    expect(textOf(black)).toContain("Black may claim: fifty-move rule");

    // [ADDED — D24] The one input shape that separates READING from INFERRING. Every status the
    // rules core produces derives `by` from the same `position.blackToMove` an inferring panel
    // would read (`src/gameend.ts:170`), so against a produced status the two builds are
    // DEFINITIONALLY identical — an inferring build diverged 0 times in 400 games. Only a status
    // whose claimant DISAGREES with the position can tell them apart.
    //
    // THIS STATUS IS CONSTRUCTED AND IS NOT PRODUCIBLE BY MERGED `gameStatusOf` TODAY, and it is
    // stated here rather than left for a reader to discover, so nobody mistakes it for a reachable
    // game state (this ticket's `D13` honesty, applied a second time). It is the right criterion
    // anyway: `by` is a required field of the public `DrawClaims` interface, `status` is a
    // PARAMETER this panel does not derive, and `ABC-021` adds a second producer of claims.
    const white = gameFrom("6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 60", []);
    expect(white.position.blackToMove).toBe(false);

    const forged: GameStatus = {
      result: "in-progress",
      reason: null,
      claimable: { by: "black", draws: ["fifty-move"] },
    };

    const text = renderStatusPanel(white, forged, false).join("\n");
    expect(text).toContain("Black may claim: fifty-move rule");
    expect(text).not.toContain("White may claim");
  });

  it("A10 — rendering twice is byte-identical and changes nothing the caller owns", () => {
    for (const { name, history, thinking } of CASES) {
      const status = statusOf(history);
      const fenBefore = toFen(history.position);
      const plies = history.moves.length;

      const first = renderStatusPanel(history, status, thinking);
      const second = renderStatusPanel(history, status, thinking);

      expect(second, name).toEqual(first);
      expect(toFen(history.position), name).toBe(fenBefore);
      // The move-list clause: item 4's replay is the one place a panel could reach for `takeBack`,
      // which would mutate the caller's history and pass every content assertion.
      expect(history.moves.length, name).toBe(plies);
    }
  });

  it("A11 — the row count is STATUS_ROWS, it is 3, and it is the module's own export", () => {
    expect(STATUS_ROWS).toBe(3);

    for (const { name, history, thinking } of CASES) {
      expect(panelOf(history, thinking), name).toHaveLength(STATUS_ROWS);
    }
  });

  it("A12 — the panel's own rows are ASCII, unconditionally", () => {
    for (const { name, history, thinking } of CASES) {
      // Counted on the panel's RETURNED rows and never through `assembleFrame`, which strips these
      // code points in ASCII mode and would be green on a panel that emits them. Counted through
      // the spread so a surrogate pair is one code point, never two units.
      const above = [...panelOf(history, thinking)].join("\n");
      const offenders = [...above].filter(
        (character) => (character.codePointAt(0) as number) > 0x7f,
      );
      expect(offenders, name).toHaveLength(0);
    }
  });
});

// The snapshot matrix the ticket's `## Test notes` asks for, in `ABC-014`'s shape, so the frame can
// later be snapshot as a whole. Every criterion above is pinned by an explicit assertion rather
// than by a generated snapshot; these record the layout so an unintended change to it is visible.
describe("ABC-016 panel snapshots", () => {
  for (const { name, history, thinking } of CASES) {
    it(`matches its snapshot — ${name}`, () => {
      expect(panelOf(history, thinking).join("\n")).toMatchSnapshot();
    });
  }
});
