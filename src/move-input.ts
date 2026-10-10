/**
 * ABC-033 — one line of input, two grammars, three outcomes.
 *
 * `EPIC-003` promises both formats always accepted with NO MODE SWITCH: the player never declares
 * whether they are typing `e2e4` or `e4`. `ABC-031` and `ABC-032` each answer *"is this string a
 * move, in MY grammar?"*; this module is the one that answers *"is this LINE a move at all?"* and
 * turns either answer into the `PromptOutcome` the merged loop consumes
 * (`src/turn-loop.ts` `PromptOutcome`).
 *
 * THIS MODULE ASKS; IT DOES NOT PARSE. There is no grammar here, no token table, no piece letter,
 * no square arithmetic and no chess logic — every one of those lives in `src/coordinate-move.ts`
 * and `src/san.ts`, and the only thing this file owns is the ORDER of the asking and the merge of
 * the answers.
 *
 * THE RULING IT IMPLEMENTS — BA/PM 2026-08-12, `ABC-033` `## The ruling this ticket implements`.
 * `EPIC-003` asks for case-insensitive input, for both formats always accepted, AND for a
 * multi-match to be listed rather than guessed. In SAN case is MEANING — `bxc4` is a pawn capture,
 * `Bxc4` a bishop capture, and both can be legal in one position — so those three cannot all hold
 * for a case-folding parser. The resolution:
 *
 *   1. try the line EXACTLY AS TYPED — coordinate reader first, then `parseSan`;
 *   2. only if BOTH reject, retry CASE-FOLDED;
 *   3. and if the fold names more than one legal move, the outcome is `ambiguous` — NEVER a pick.
 *
 * The fold is a RETRY and not the first thing tried, which is the whole of `A3`'s third row: in a
 * position where only the pawn capture is legal, `bxc4` resolves on the exact attempt and the fold
 * is never reached. A build that folds first passes every other row of `A3` and fails that one.
 *
 * NEVER GUESS BETWEEN TWO LEGAL MOVES. Named out of scope on the ticket rather than merely absent,
 * because picking one is the cheap implementation and it LOOKS helpful: the player who types `BXC4`
 * in a position where both captures are legal is asked which one, instead of being handed a bishop
 * and told nothing.
 *
 * THE LINE IS HANDED OVER UNMODIFIED. Both resolvers already trim (`ABC-032`'s five-entry tolerance
 * ruling, 2026-08-18, inherited here and not re-decided), so this module does not trim a third time
 * and does not normalise: one line, as typed, to both readers. The case-folded variants below are
 * the ONE transformation this module applies, and only on the retry.
 *
 * ONE DERIVE PER PROMPT — `A5`. `legalMoves` is called EXACTLY ONCE on the PROMPT POSITION per
 * submitted line and the one array is handed to every attempt through the optional `legal`
 * parameter both resolvers take, and to `toSan` when the candidate list is rendered. Four attempts
 * x one generation each is the easy wrong implementation and it is invisible to every content
 * assertion, so it is asserted by spy.
 *
 * WHAT `A5` DOES NOT SAY, because it was once read as saying it: rendering an ambiguity is NOT
 * free. `toSan` derives the legal moves of the position AFTER a checking candidate to decide its
 * `+`/`#` suffix (`src/san.ts:105`), so the honest cost of a prompt is `1 + O(candidates)` derives
 * — six queens on `d4` cost six of those, measured by QE. Those are OTHER positions, which is why
 * `A5`'s one-derive-per-prompt still holds as written; anyone quoting "one derive per prompt" as a
 * cost bound for `NFR-003` or `N8-LANE` is quoting a number that does not hold for ambiguities.
 *
 * MOVE IDENTITY is inherited, not re-established: every `Move` returned here is an ELEMENT of that
 * one array, because both resolvers `filter` it and this module only ever selects from it.
 *
 * WORDING IS NOT HERE. A rejection's reason and its sentence are `src/rejection.ts`'s (`ABC-034`):
 * this module hands it the texts it tried — the line and the variants — and places the one message
 * it gets back. The ambiguity messages ARE this module's, and they are the candidates in SAN
 * (`EPIC-003` acceptance #2), one item per candidate: the frame's message region takes a LIST and
 * places each item whole or not at all (`src/frame.ts` `FrameParts`).
 */

import { type CoordinateParseResult, parseCoordinateMove } from "./coordinate-move.ts";
import type { GameHistory } from "./history.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import type { Position } from "./position.ts";
import { classifyRejection, rejectionMessage } from "./rejection.ts";
import { parseSan, type SanParseResult, toSan } from "./san.ts";
import type { PromptOutcome } from "./turn-loop.ts";

/**
 * The three arms this module can produce, out of `PromptOutcome`'s seven. `command` is `ABC-035`'s,
 * `eof` is `ABC-036`'s, and `claim` / `game-over` are the loop's own — narrowing here means a caller
 * binding this into the `InputSeam` never has to handle an arm this function cannot return.
 */
export type MoveInputOutcome = Extract<
  PromptOutcome,
  { readonly kind: "move" | "rejected" | "ambiguous" }
>;

/**
 * The resolver seam, injected so `A5`'s call count can be SPIED without a hoisted module mock —
 * which is what keeps this ticket at one test file and ~160 ms of lane cost (`ABC-033` `## Lane
 * cost`). It is a test seam and nothing else: production callers pass nothing and get the three
 * real functions below.
 */
export interface MoveInputDeps {
  readonly legalMoves: (position: Position) => readonly Move[];
  readonly parseCoordinateMove: (
    position: Position,
    text: string,
    legal?: readonly Move[],
  ) => CoordinateParseResult;
  readonly parseSan: (position: Position, text: string, legal?: readonly Move[]) => SanParseResult;
  /**
   * `toSan` is on the seam for ONE reason: `A5`'s derive count is otherwise unobservable through
   * it. `toSan(position, move, legal)` falls back to `legal ?? legalMoves(position)`
   * (`src/san.ts:78`), so a build that drops the third argument derives the prompt position once
   * per candidate — three real derives for a two-candidate ambiguity — while a spy watching
   * `deps.legalMoves` alone still reports 1. QE mutant M11 did exactly that and reded 0 tests
   * (`G3`, `quality-gate-ABC-033-qe-2026-08-18`). Spying the ARGUMENT is what makes the sharing
   * assertable; the count alone never could.
   */
  readonly toSan: (position: Position, move: Move, legal?: readonly Move[]) => string;
}

const PRODUCTION_DEPS: MoveInputDeps = { legalMoves, parseCoordinateMove, parseSan, toSan };

/**
 * The case-folded RETRY's variants, applied to the whole line and nowhere else.
 *
 * Four, and each one exists for a case the epic names. `bxc4` reads the pawn capture; `Bxc4` the
 * bishop capture — SAN's piece letter is the first character, so capitalising it is one operation
 * and not a token table; `O-O` is reached from `o-o`, which `parseSan` refuses deliberately (case is
 * meaning) and the 2026-08-18 tolerance ruling did NOT widen.
 *
 * THE FOURTH EXISTS BECAUSE THE FIRST THREE SHARE ONE ASSUMPTION — that the case-significant
 * character of a line is at index 0. That holds for every piece-move SAN, which is why `NF3` is
 * understood via variant 2. It is false at the OTHER end: `e8=Q` needs a lowercase head and an
 * uppercase tail, which no whole-line transform above can produce, so a caps-lock player typing
 * `E8=Q` was told `unreadable` while `e8=Q` resolved — the single family where case folding did not
 * reach, found by QE at `quality-gate-ABC-033-qe-2026-08-18` (`G2`). Variant 4 lowercases the line
 * and uppercases its LAST character. It is the mirror of variant 2 and knows exactly as little:
 * nothing of `=`, nothing of promotion, nothing of which letters name a piece. For every line
 * ending in a digit — which is most of them — it produces the same string as variant 1 and costs
 * nothing, because a variant that reproduces an already-tried text adds no move to the union.
 *
 * A variant is a STRING HANDED BACK TO THE SAME TWO READERS, never a second grammar: whatever a
 * variant resolves to is the resolvers' answer, and the union of those answers is what decides
 * between `move` and `ambiguous`. Variant 4 changes NOTHING about that: it widens what is asked,
 * never what is accepted, and a line it makes readable is still `ambiguous` if it names two moves.
 */
const CASE_VARIANTS: readonly ((line: string) => string)[] = [
  (line) => line.toLowerCase(),
  (line) => line.slice(0, 1).toUpperCase() + line.slice(1).toLowerCase(),
  (line) => line.toUpperCase(),
  (line) => line.slice(0, -1).toLowerCase() + line.slice(-1).toUpperCase(),
];

/**
 * Resolve one submitted line against the position `history` is at.
 *
 * A PURE FUNCTION OVER A STRING. It reads the line from nowhere (`ABC-036` owns that), it applies
 * nothing to the history, and it advances no ply — on every one of the three outcomes,
 * `toFen(history.position)` is byte-identical afterwards and `history.moves` is untouched.
 *
 * `line` is handed to both readers UNMODIFIED. `deps` is the test seam documented above.
 */
export function resolveMoveInput(
  history: GameHistory,
  line: string,
  deps: MoveInputDeps = PRODUCTION_DEPS,
): MoveInputOutcome {
  const position = history.position;
  const legal = deps.legalMoves(position);

  // 1. Exactly as typed: coordinate first — then `parseSan`. Coordinate-first is a real precedence
  //    and not a formality: a `B`-initial line can be read by both, and `attemptsOn` below says
  //    which reader wins and why.
  for (const attempt of attemptsOn(position, line, legal, deps)) {
    if (attempt.outcome === "move") return { kind: "move", move: attempt.move };
    if (attempt.outcome === "ambiguous")
      return ambiguous(position, attempt.candidates, legal, deps);
  }

  // 2. Both rejected, so retry case-folded — and take the UNION over the variants, because two
  //    variants naming two different legal moves is exactly the multi-match the ruling routes to
  //    `ambiguous` rather than resolving by preferring one variant over another.
  const folded = new Set<Move>();
  for (const variant of CASE_VARIANTS) {
    const text = variant(line);
    if (text === line) continue; // already tried, exactly as typed
    for (const attempt of attemptsOn(position, text, legal, deps)) {
      if (attempt.outcome === "move") folded.add(attempt.move);
      else if (attempt.outcome === "ambiguous")
        for (const move of attempt.candidates) folded.add(move);
    }
  }

  // Ordered by the one legal array so the candidate list does not depend on which variant found
  // which move.
  const candidates = legal.filter((move) => folded.has(move));
  if (candidates.length === 1) return { kind: "move", move: candidates[0] as Move };
  if (candidates.length > 1) return ambiguous(position, candidates, legal, deps);

  // 3. Nothing named a legal move. The classifier explains why, over every text tried above and in
  //    that order — the line first, then the variants — against the one legal array in hand.
  const tried = [...new Set([line, ...CASE_VARIANTS.map((variant) => variant(line))])];
  return {
    kind: "rejected",
    messages: [rejectionMessage(classifyRejection(position, tried, legal))],
  };
}

/**
 * The two attempts over one text, in the fixed order coordinate-then-SAN. Both get the same `legal`.
 *
 * BOTH RESOLVERS ARE CALLED, ALWAYS — this returns an array, not a lazy sequence, so the order here
 * is a PRECEDENCE over two answers already in hand, not a short-circuit that spares the second
 * reader. And the precedence is REAL, not a formality: the two grammars are NOT disjoint. A line
 * can make both readers claim a move, and they can claim DIFFERENT moves. On
 * `4k3/8/8/8/8/8/1P1B4/4K3 w - - 0 1` the input `B2b4` is read by `parseCoordinateMove` as the
 * pawn's `b4` and by `parseSan` as the rank-qualified bishop `Bb4`; the order below is what decides
 * it, and swapping these two lines changes the move the player gets.
 *
 * The cause is one letter of the alphabet. `parseCoordinateMove` lowercases before matching, and of
 * the piece letters `N B R Q K` exactly one — `b` — is also a file letter, so every string shaped
 * `B<rank><file><rank>` is in both grammars at once. This is pre-existing, it resolves on the
 * exact-as-typed path, and it is not created by the case-folded retry below.
 *
 * COORDINATE-FIRST IS THE RIGHT WAY ROUND, which is why the order is this one: a player who types
 * `B2b4` is a coordinate typist whose shift slipped on `b2b4`, and the pawn is the move they meant.
 * Do not swap these two lines.
 *
 * An earlier version of this comment asserted the opposite — that the grammars were disjoint on
 * every string either accepts, so no line could make both claim a move and no line could tell the
 * two orderings apart by its outcome. That was FALSE in both halves, and `B2b4` falsifies both
 * (QE, `quality-gate-ABC-033-delta-2026-08-18`). QE's M12 — swapping these two lines — reded
 * nothing at the original gate because no test then used such a line; `src/move-input.test.ts` now
 * pins `B2b4` through the real readers and M12 reds on it.
 *
 * It is NOT made lazy. Laziness would buy one skipped parse of a four-character string on the
 * winning path, and the precedence is already observable without it — on a real line like `B2b4`,
 * and through `MoveInputDeps` with two stub resolvers that both claim the same text.
 */
function attemptsOn(
  position: Position,
  text: string,
  legal: readonly Move[],
  deps: MoveInputDeps,
): readonly (CoordinateParseResult | SanParseResult)[] {
  return [deps.parseCoordinateMove(position, text, legal), deps.parseSan(position, text, legal)];
}

/** The candidates in SAN, one message per candidate — `EPIC-003` acceptance #2. Nothing is applied. */
function ambiguous(
  position: Position,
  candidates: readonly Move[],
  legal: readonly Move[],
  deps: MoveInputDeps,
): MoveInputOutcome {
  return {
    kind: "ambiguous",
    messages: candidates.map((move) => deps.toSan(position, move, legal)),
  };
}
