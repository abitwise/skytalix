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

const widestOf = (rows: readonly string[]): number =>
  rows.reduce((widest, row) => Math.max(widest, row.length), 0);

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

  it("A2 — states CHECK on a plain check, on a mate, and never on a quiet board", () => {
    // The plain-check FEN is the one that kills a build reading the indicator from
    // `status.reason === "checkmate"`: four legal replies, game in progress, and still CHECK.
    expect(textOf(gameFrom("4k3/8/8/8/8/8/8/4R1K1 b - - 0 1", []))).toContain("CHECK");
    expect(textOf(gameFrom(START_FEN, []))).not.toContain("CHECK");
    // A mated board still says CHECK — this panel reports check, not game over.
    const mate = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3";
    expect(textOf(gameFrom(mate, []))).toContain("CHECK");
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
  });

  it("A6 — the material balance, as a table of exact integers", () => {
    const cases: ReadonlyArray<[fen: string, expected: string]> = [
      ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "material: 0"],
      ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1", "material: -9"],
      // The promotion case: white one pawn short and one queen up. A board diff against the
      // standard starting complement gets it wrong; a 64-square scan gets it right.
      ["rnbqkbnr/pppppppp/8/8/7Q/8/PPPPPPP1/RNBQKBNR w KQkq - 0 1", "material: +8"],
    ];

    for (const [fen, expected] of cases) {
      expect(textOf(gameFrom(fen, [])), fen).toContain(expected);
    }
  });

  it("A7 — the thinking cell is reserved, so the panel's geometry does not breathe", () => {
    const history = gameFrom(START_FEN, ["e2e4"]);
    const status = statusOf(history);

    const busy = renderStatusPanel(history, status, true);
    const idle = renderStatusPanel(history, status, false);

    expect(busy.join("\n")).toContain("thinking...");
    expect(idle.join("\n")).not.toContain("thinking...");
    // The width clause is what makes "blank but reserved" mean something: the panel's widest row
    // is the frame's `W` (`src/frame.ts:179`), so a cell that shrinks when idle makes the whole
    // frame breathe.
    expect(idle).toHaveLength(busy.length);
    expect(widestOf(idle)).toBe(widestOf(busy));
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

  it("A9 — the claim belongs to the side to move, on the engine's plies too", () => {
    const black = gameFrom("6k1/5ppp/8/b7/8/8/5PPP/4R1K1 b - - 100 60", []);
    expect(textOf(black)).toContain("Black may claim: fifty-move rule");
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
