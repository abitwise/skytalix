/**
 * `ABC-032` — the acceptance table for `parseSan`, transcribed from the ticket.
 *
 * ONE NEW FILE, which the ticket's `## Lane cost` prices at ≈ 160 ms CPU / ≈ 1.2% of `NFR-008`'s
 * 13 s clause and leaves to the engineer. It is taken because `A1` runs the whole perft corpus
 * through both directions and that blast radius does not belong inside `san.test.ts`'s hand-typed
 * table — the two files fail for different reasons and should be readable apart.
 *
 * REFERENCE IDENTITY IS THE ASSERTION THROUGHOUT — `toBe`, never `toEqual` (`ADR-0004` (2b)). Deep
 * equality passes a fabricated `Move` and therefore cannot see a (2b) violation at all, which is
 * the whole property `A1` exists to falsify.
 *
 * `src/san.nfr.test.ts`, `src/san.qualifier.hardening.test.ts` and `src/san.suffix.hardening.test.ts`
 * are untouched by this ticket (`A6`), and nothing here re-asserts a row of theirs.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import type { Position } from "./position.ts";
import { parseSan, toSan } from "./san.ts";

/** The six perft positions, transcribed from `src/perft.test.ts`. `A1` names them; do not invent a corpus. */
const PERFT_CORPUS: ReadonlyArray<readonly [name: string, fen: string, depthOneCount: number]> = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 20],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 48],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", 14],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", 6],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", 44],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10", 46],
];

/** `A2`'s position, verbatim from the ticket: the Italian after 4 moves, castling still available. */
const A2_FEN = "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4";

/**
 * `A4`'s FEN AS PRINTED ON THE TICKET. It is defective and the criterion cannot be met with it:
 * the kings stand on e1 and e2, ADJACENT, which is not a legal chess position — White is "in check"
 * from the black king and the only legal move is `Kxe2`. There is no promotion to select and no
 * ambiguity to collect. The same defect was found and pinned at `ABC-031` (`src/coordinate-move.test.ts`),
 * which is why it is pinned here the same way rather than argued: this file does not edit the ticket.
 */
const A4_FEN_AS_WRITTEN = "8/4P3/8/8/8/8/4k3/4K3 w - - 0 1";

/**
 * The same position with the black king moved off the white king's neighbourhood (e2 -> e3) and
 * nothing else changed — the minimal correction that makes `A4`'s stated behaviour observable, and
 * the identical one `ABC-031` used for its own promotion criterion.
 */
const A4_FEN_CORRECTED = "8/4P3/8/8/8/4k3/8/4K3 w - - 0 1";

/** Two knights on b1 and f3, both reaching d2: separated by FILE — `Nbd2` / `Nfd2`. */
const FILE_QUALIFIED_FEN = "4k3/8/8/8/8/5N2/8/1N2K3 w - - 0 1";
/** Two knights on b1 and b3, both reaching d2: separated by RANK — `N1d2` / `N3d2`. */
const RANK_QUALIFIED_FEN = "4k3/8/8/8/8/1N6/8/1N2K3 w - - 0 1";

/** A rook on h1 with the black king on e8: `Re1` gives check on the e-file, and its SAN carries `+`. */
const CHECKING_FEN = "4k3/8/8/8/8/8/8/K6R w - - 0 1";

/** The knight moves reaching d2 — the kings in both A3 positions can also reach it, and do not count. */
const KNIGHT_TO_D2 = /^N.*d2$/;

function open(fen: string): readonly [Position, Move[]] {
  const position = parseFen(fen);
  return [position, legalMoves(position)];
}

describe("A1 — the round-trip property over the whole perft corpus", () => {
  for (const [name, fen, depthOneCount] of PERFT_CORPUS) {
    it(`${name}: every legal move survives toSan -> parseSan by reference`, () => {
      const [position, legal] = open(fen);
      expect(legal.length).toBe(depthOneCount);

      for (const move of legal) {
        const written = toSan(position, move, legal);
        const parsed = parseSan(position, written, legal);
        // The message names the string, so a failure reads as a SAN bug rather than an index.
        expect(parsed.outcome, written).toBe("move");
        // Reference identity — `ADR-0004` (2b). `toEqual` here would pass a fabricated Move.
        expect(parsed.outcome === "move" && parsed.move, written).toBe(move);
      }
    });
  }

  it("covers 178 moves across the six positions, with zero exceptions", () => {
    let round = 0;
    for (const [, fen] of PERFT_CORPUS) {
      const [position, legal] = open(fen);
      for (const move of legal) {
        const parsed = parseSan(position, toSan(position, move, legal), legal);
        if (parsed.outcome === "move" && parsed.move === move) round += 1;
      }
    }
    // 20 + 48 + 14 + 6 + 44 + 46 — the perft table's own depth-1 counts, summed.
    expect(round).toBe(178);
  });
});

describe("A2 — three outcomes, closed, on the ticket's exact strings", () => {
  it("resolves each of the eight strings into exactly one arm and never throws", () => {
    const [position, legal] = open(A2_FEN);
    const arms = new Map<string, string>();

    for (const text of ["Nf3", "Ng5", "O-O", "0-0", "Bxf7+", "Bxf7", "Qh5#", "Nbd2"]) {
      const parsed = parseSan(position, text, legal);
      arms.set(text, parsed.outcome);
      if (parsed.outcome === "move") {
        // Every returned Move is an ELEMENT of the list handed in — `ADR-0004` (2b), by reference.
        expect(legal.includes(parsed.move), text).toBe(true);
      }
    }

    expect(Object.fromEntries(arms)).toEqual({
      // The knight already stands on f3 — well-formed SAN naming no legal move.
      Nf3: "rejected",
      Ng5: "move",
      "O-O": "move",
      "0-0": "move",
      "Bxf7+": "move",
      Bxf7: "move",
      // The d1 queen's path to h5 runs through her own knight on f3.
      "Qh5#": "rejected",
      // d2 is occupied by White's own pawn.
      Nbd2: "rejected",
    });
  });

  it("reads `0-0` as the same castle move as `O-O`, by reference", () => {
    const [position, legal] = open(A2_FEN);
    const written = parseSan(position, "O-O", legal);
    const zeroes = parseSan(position, "0-0", legal);
    expect(
      written.outcome === "move" && zeroes.outcome === "move" && written.move === zeroes.move,
    ).toBe(true);
  });

  it("reads a checking move with and without its suffix as the same move, by reference", () => {
    const [position, legal] = open(A2_FEN);
    const decorated = parseSan(position, "Bxf7+", legal);
    const bare = parseSan(position, "Bxf7", legal);
    expect(
      decorated.outcome === "move" && bare.outcome === "move" && decorated.move === bare.move,
    ).toBe(true);
  });
});

describe("A3 — disambiguation, both directions of the rule", () => {
  it("file-qualified: `Nbd2` and `Nfd2` name their own knight; bare `Nd2` is ambiguous with exactly 2", () => {
    const [position, legal] = open(FILE_QUALIFIED_FEN);
    const toD2 = legal.filter((move) => KNIGHT_TO_D2.test(toSan(position, move, legal)));
    // The oracle is `toSan`'s own table — the strings are not hand-derived from the parser.
    expect(toD2.map((move) => toSan(position, move, legal)).sort()).toEqual(["Nbd2", "Nfd2"]);

    for (const move of toD2) {
      const parsed = parseSan(position, toSan(position, move, legal), legal);
      expect(parsed.outcome === "move" && parsed.move).toBe(move);
    }

    const bare = parseSan(position, "Nd2", legal);
    expect(bare.outcome).toBe("ambiguous");
    if (bare.outcome !== "ambiguous") return;
    expect(bare.candidates.length).toBe(2);
    for (const candidate of bare.candidates) expect(legal.includes(candidate as Move)).toBe(true);
  });

  it("rank-qualified: `N1d2` and `N3d2` name their own knight; bare `Nd2` is ambiguous with exactly 2", () => {
    const [position, legal] = open(RANK_QUALIFIED_FEN);
    const toD2 = legal.filter((move) => KNIGHT_TO_D2.test(toSan(position, move, legal)));
    expect(toD2.map((move) => toSan(position, move, legal)).sort()).toEqual(["N1d2", "N3d2"]);

    for (const move of toD2) {
      const parsed = parseSan(position, toSan(position, move, legal), legal);
      expect(parsed.outcome === "move" && parsed.move).toBe(move);
    }

    const bare = parseSan(position, "Nd2", legal);
    expect(bare.outcome).toBe("ambiguous");
    if (bare.outcome !== "ambiguous") return;
    expect(bare.candidates.length).toBe(2);
    for (const candidate of bare.candidates) expect(legal.includes(candidate as Move)).toBe(true);
  });
});

describe("A4 — promotion and suffix tolerance", () => {
  it("PINS the ticket's printed FEN as defective: kings adjacent, `Kxe2` the only legal move", () => {
    const [position, legal] = open(A4_FEN_AS_WRITTEN);
    expect(legal.map((move) => toSan(position, move, legal))).toEqual(["Kxe2"]);
    // Not a parser fault: there is no promotion in this position to select.
    expect(parseSan(position, "e8=Q", legal)).toEqual({
      outcome: "rejected",
      reason: "no-such-move",
    });
  });

  it("`e8=Q` is the queen promotion by reference; bare `e8` is ambiguous with exactly 4", () => {
    const [position, legal] = open(A4_FEN_CORRECTED);
    const promotions = legal.filter((move) => toSan(position, move, legal).startsWith("e8"));
    expect(promotions.map((move) => toSan(position, move, legal))).toEqual([
      "e8=Q+",
      "e8=R+",
      "e8=B",
      "e8=N",
    ]);

    const queen = parseSan(position, "e8=Q", legal);
    expect(queen.outcome === "move" && queen.move).toBe(promotions[0]);

    const bare = parseSan(position, "e8", legal);
    expect(bare.outcome).toBe("ambiguous");
    if (bare.outcome !== "ambiguous") return;
    expect(bare.candidates.length).toBe(4);
    for (const candidate of bare.candidates) expect(legal.includes(candidate as Move)).toBe(true);
  });

  it("the suffix is decoration on input: `+`, absent and `#` all resolve to the same move", () => {
    const [position, legal] = open(CHECKING_FEN);
    const checking = legal.find((move) => toSan(position, move, legal) === "Re1+");
    expect(checking).toBeDefined();

    for (const text of ["Re1+", "Re1", "Re1#"]) {
      const parsed = parseSan(position, text, legal);
      expect(parsed.outcome === "move" && parsed.move, text).toBe(checking);
    }
  });
});

describe("A5 — totality: it never throws, and the two reject codes never collapse", () => {
  /** Declared `string`; a loop hands over whatever it read, so the guard is the criterion. */
  const HOSTILE: readonly unknown[] = [null, undefined, 42, {}, [], "", "x".repeat(10_000), "Zx9"];

  it("returns `rejected` and throws nothing on every hostile input", () => {
    const [position, legal] = open(CHECKING_FEN);
    for (const text of HOSTILE) {
      const label =
        typeof text === "string" ? `${text.slice(0, 12)} (len ${text.length})` : String(text);
      expect(() => parseSan(position, text as string, legal), label).not.toThrow();
      expect(parseSan(position, text as string, legal).outcome, label).toBe("rejected");
    }
  });

  it("distinguishes `unreadable` from `no-such-move` — the two codes are both reachable", () => {
    const [position, legal] = open(CHECKING_FEN);
    // Not SAN this module can read at all.
    expect(parseSan(position, "Zx9", legal)).toEqual({ outcome: "rejected", reason: "unreadable" });
    // Well-formed SAN naming no legal move here: there is no queen on the board.
    expect(parseSan(position, "Qh5#", legal)).toEqual({
      outcome: "rejected",
      reason: "no-such-move",
    });
  });

  it("throws nothing when `legal` is omitted and the list is generated internally", () => {
    const position = parseFen(A2_FEN);
    expect(() => parseSan(position, "Ng5")).not.toThrow();
    expect(parseSan(position, "Ng5").outcome).toBe("move");
  });
});

describe("A7 — one grammar table, asserted structurally", () => {
  const SOURCE = readFileSync(new URL("./san.ts", import.meta.url), "utf8");

  /** A second private table passes every behaviour row above; only this assertion can see it. */
  const occurrences = (literal: string): number => SOURCE.split(`"${literal}"`).length - 1;

  it("each piece letter is a string literal exactly once in the module", () => {
    for (const letter of ["N", "B", "R", "Q", "K"]) {
      expect(occurrences(letter), letter).toBe(1);
    }
  });

  it("each castle string is a string literal exactly once in the module", () => {
    expect(occurrences("O-O")).toBe(1);
    expect(occurrences("O-O-O")).toBe(1);
  });

  it("both directions read the one table: `PIECE_LETTERS` is used on each side of the module", () => {
    const [rendering, parsing] = SOURCE.split("export function parseSan");
    expect(rendering).toBeDefined();
    expect(parsing).toBeDefined();
    // The render direction (`body`) and the parse direction (`pieceLetterOf` / the letter class)
    // both consult the single `PIECE_LETTERS` declaration; neither owns a copy.
    expect((rendering as string).includes("PIECE_LETTERS[")).toBe(true);
    expect(SOURCE.includes("const PIECE_LETTER_CLASS = Object.values(PIECE_LETTERS)")).toBe(true);
    expect((parsing as string).includes("PIECE_LETTERS[")).toBe(true);
  });

  it("the promotion letters are the same table: both directions look them up in `PIECE_LETTERS`", () => {
    // `toSan` writes `=${PIECE_LETTERS[move.promotion]}`; `parseSan` compares the input's letter
    // against that same lookup. There is no promotion-specific letter map in this module — the
    // coordinate grammar keeps its own `PROMOTION_TYPES` inside its own module, by design.
    expect(SOURCE.split("PIECE_LETTERS[move.promotion]").length - 1).toBe(2);
    const [rendering, parsing] = SOURCE.split("export function parseSan");
    expect((rendering as string).includes("PIECE_LETTERS[move.promotion]")).toBe(true);
    expect((parsing as string).includes("PIECE_LETTERS[move.promotion]")).toBe(true);
  });
});

/**
 * `ABC-032` QE hop, 2026-08-17 — the rows added because a MUTATION of `src/san.ts` did NOT turn the
 * suite red. Each row below names the surviving mutant it exists to kill; every one of them was run
 * against `src/san.ts`, confirmed green before the row and red after it, and the module reverted.
 * No production line is changed by this hop — these are assertions, not fixes.
 */
describe("QE — mutants that survived the delivered suite", () => {
  /** `src/san.ts` with comments stripped: a second table hides in code, not in prose. */
  const CODE = readFileSync(new URL("./san.ts", import.meta.url), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");

  it("A7 gap: no hand-spelled piece-letter CHARACTER CLASS anywhere in the module", () => {
    // Surviving mutant: `PIECE_MOVE` rebuilt as the literal `/^([NBRQK])…/`. That is a second
    // spelling of the one table, and `A7`'s string-literal counter cannot see it because a regex
    // literal is not a string literal — the shape this module's own style would reach for first.
    expect(CODE.match(/\[\^?[NBRQK]{2,}\]/g)).toBeNull();
    // The class the two input regexes are built from stays DERIVED from the one declaration.
    expect(CODE.includes('const PIECE_LETTER_CLASS = Object.values(PIECE_LETTERS).join("")')).toBe(
      true,
    );
  });

  it("A7 gap: the castle strings are spelled on exactly one line of code", () => {
    // Surviving mutant: the parse side matching `/^O-O(-O)?$/` instead of asking a castle
    // candidate for its own `toSan` output — a second castle table, again invisible to a
    // string-literal count. One line of code may spell `O-O`, and it is `body`'s.
    const spelt = CODE.split("\n").filter((line) => line.includes("O-O"));
    expect(spelt.length).toBe(1);
    expect(spelt[0]).toContain("KINGSIDE_FILE");
  });

  it("the capture marker must AGREE with the move on the piece path", () => {
    // Surviving mutant: dropping `(move.captured !== EMPTY) === (capture === "x")`. `A1` cannot see
    // it — the round-trip only proves `toSan`'s own output reads back, never that a string `toSan`
    // would NEVER emit is refused. `A2` asserts `Bxf7` and `Bxf7+`; neither negative was asserted.
    const [position, legal] = open(A2_FEN);
    // f7 is a capture, so the bare form names no legal move.
    expect(parseSan(position, "Bf7", legal)).toEqual({
      outcome: "rejected",
      reason: "no-such-move",
    });
    // g5 is empty, so the capture form names no legal move either.
    expect(parseSan(position, "Nxg5", legal)).toEqual({
      outcome: "rejected",
      reason: "no-such-move",
    });
  });

  it("a pawn's capture form must AGREE with the move, in both directions", () => {
    // Surviving mutant: dropping `(move.captured !== EMPTY) === (originFile !== undefined)`, which
    // makes the bare `d5` resolve to the CAPTURE `exd5` — a move the player did not type.
    const [position, legal] = open("4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1");
    expect(legal.map((move) => toSan(position, move, legal))).toContain("exd5");
    expect(parseSan(position, "d5", legal)).toEqual({
      outcome: "rejected",
      reason: "no-such-move",
    });
    // And the mirror: the capture form must not resolve to the quiet push.
    expect(parseSan(position, "exe5", legal)).toEqual({
      outcome: "rejected",
      reason: "no-such-move",
    });
  });

  it("surrounding whitespace is trimmed — the tolerance the ticket's closed list does not name", () => {
    // Surviving mutant: removing `text.trim()`. The trim was added deliberately, for seam
    // consistency with the merged `parseCoordinateMove` (`src/coordinate-move.ts`), which
    // `ABC-033` dispatches the same line of user input to. Unasserted, it can be removed by the
    // next edit and the two readers at one seam would silently disagree about a trailing space.
    const [position, legal] = open(A2_FEN);
    const bare = parseSan(position, "Ng5", legal);
    for (const text of ["  Ng5", "Ng5  ", "\tNg5\n", " Ng5 "]) {
      const padded = parseSan(position, text, legal);
      expect(
        padded.outcome === "move" && bare.outcome === "move" && padded.move === bare.move,
        text,
      ).toBe(true);
    }
    // Interior whitespace is NOT tolerated — the widening is trim, not "ignore spaces".
    expect(parseSan(position, "N g5", legal).outcome).toBe("rejected");
  });

  /**
   * RULED SPECIFICATION. These rows were once pinned as characterization while the tolerances they
   * measured were still unruled; BA/PM ruled on 2026-08-18 (task
   * `refinement-abc032-tolerances-2026-08-18`) and ACCEPTED all three. The redundant qualifier and
   * the mixed castle spellings are now entries **4** and **5** of `ABC-032` § Scope's CLOSED
   * decoration-tolerance list, and `e8=K`'s code is accepted as delivered with the
   * re-classification placed on `ABC-034` `A8`.
   *
   * Every ACCEPT was granted **bounded**, and the bound is the point of the block: `Ne4g5` refused
   * and `o-o` refused are the BOUNDARY of the accepted tolerance, not incidental observations. An
   * unbounded tolerance is a widening nobody can stop from creeping, so deleting or relaxing either
   * assertion below removes the limit the ruling was granted under — it does not tidy a note. These
   * rows are what `ABC-033` and `ABC-034` read to learn what the input grammar accepts.
   */
  describe("accepted input tolerances (`ABC-032` § Scope entries 4 and 5), each held at its bound", () => {
    it("accepts a REDUNDANT qualifier that `toSan` would never emit — `ABC-032` § Scope entry 4", () => {
      const [position, legal] = open(A2_FEN);
      const bare = parseSan(position, "Ng5", legal);
      expect(bare.outcome).toBe("move");
      for (const text of ["Nfg5", "N3g5", "Nf3g5"]) {
        const over = parseSan(position, text, legal);
        // Still an ELEMENT of `legal` (`ADR-0004` (2b) holds). That these strings SHOULD be read
        // is settled: a redundant qualifier cannot change which move is named, so it admits only
        // strings that are unambiguous and correct.
        expect(
          over.outcome === "move" && bare.outcome === "move" && over.move === bare.move,
          text,
        ).toBe(true);
      }
      // THE BOUND entry 4 was granted under, and it is specification: a CONTRADICTORY origin is
      // still refused, so the tolerance is redundancy and never a free-for-all — no string can
      // resolve to a move the player did not name. Do not remove this row; it is the limit.
      expect(parseSan(position, "Ne4g5", legal).outcome).toBe("rejected");
    });

    it("accepts MIXED castle spellings (`O-0`, `0-O`) — `ABC-032` § Scope entry 5", () => {
      const [position, legal] = open(A2_FEN);
      const written = parseSan(position, "O-O", legal);
      for (const text of ["0-0", "O-0", "0-O"]) {
        const mixed = parseSan(position, text, legal);
        expect(
          mixed.outcome === "move" && written.outcome === "move" && mixed.move === written.move,
          text,
        ).toBe(true);
      }
      // THE BOUND entry 5 was granted under, and it is specification: case is still meaning in SAN
      // (`bxc4` / `Bxc4` can both be legal), so the lower-case spelling is not read here. The
      // asymmetry is deliberate — case-folded retry is `ABC-033`'s, not this ticket's, because a
      // fold can produce two candidates. Do not remove this row; it is the limit.
      expect(parseSan(position, "o-o", legal).outcome).toBe("rejected");
    });

    it("codes an IMPOSSIBLE promotion `e8=K` as `no-such-move`, not `unreadable` — placed on `ABC-034` `A8`", () => {
      // Promotion to a king is not well-formed SAN, so the floor's own words put it on the
      // `unreadable` side. It lands on the other side because the promotion letter class is
      // derived from the one table — the price of `A7`'s no-second-table shape, and the same
      // root cause as the castle case the delivery note discloses. `A5` is still met: the two
      // codes are independently reachable and never collapse. RULED 2026-08-18 (task
      // `refinement-abc032-tolerances-2026-08-18`): ACCEPTED AS DELIVERED for `ABC-032`, with the
      // re-classification and its player-facing wording placed on `ABC-034` `A8`, which owns both
      // ill-formed-SAN cases together and may not add an eighth reason code. Fixing it here would
      // need a private promotion-letter table — the second table `ADR-0004` clause 2 and `A7`
      // exist to prevent. This row is the record of the code as ruled, not a defect awaiting one.
      const [position, legal] = open(A4_FEN_CORRECTED);
      expect(parseSan(position, "e8=K", legal)).toEqual({
        outcome: "rejected",
        reason: "no-such-move",
      });
      // A letter that is in no table at all is `unreadable`, so the two codes stay distinct here.
      expect(parseSan(position, "e8=P", legal)).toEqual({
        outcome: "rejected",
        reason: "unreadable",
      });
    });
  });
});
