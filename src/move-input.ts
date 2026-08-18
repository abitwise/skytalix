/**
 * ABC-033 — one line of input, two grammars, three outcomes.
 *
 * `EPIC-003` promises both formats always accepted with NO MODE SWITCH: the player never declares
 * whether they are typing `e2e4` or `e4`. `ABC-031` and `ABC-032` each answer *"is this string a
 * move, in MY grammar?"*; this module is the one that answers *"is this LINE a move at all?"* and
 * turns either answer into the `PromptOutcome` the merged loop consumes (`src/turn-loop.ts:125`).
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
 * ONE DERIVE PER PROMPT — `A5`. `legalMoves` is called EXACTLY ONCE per submitted line and the one
 * array is handed to every attempt through the optional `legal` parameter both resolvers take, and
 * to `toSan` when the candidate list is rendered. Four attempts x one generation each is the easy
 * wrong implementation and it is invisible to every content assertion, so it is asserted by spy.
 *
 * MOVE IDENTITY is inherited, not re-established: every `Move` returned here is an ELEMENT of that
 * one array, because both resolvers `filter` it and this module only ever selects from it.
 *
 * WORDING IS NOT HERE. A rejection carries `ABC-031`/`ABC-032`'s machine-readable REASON CODE, never
 * display copy — `ABC-034` owns the prose. The ambiguity messages ARE this module's, and they are
 * the candidates in SAN (`EPIC-003` acceptance #2), one item per candidate: the frame's message
 * region takes a LIST and places each item whole or not at all (`src/frame.ts` `FrameParts`).
 */

import { type CoordinateParseResult, parseCoordinateMove } from "./coordinate-move.ts";
import type { GameHistory } from "./history.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import type { Position } from "./position.ts";
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
}

const PRODUCTION_DEPS: MoveInputDeps = { legalMoves, parseCoordinateMove, parseSan };

/**
 * The case-folded RETRY's variants, applied to the whole line and nowhere else.
 *
 * Three, and each one exists for a case the epic names. `bxc4` reads the pawn capture; `Bxc4` the
 * bishop capture — SAN's piece letter is the first character, so capitalising it is one operation
 * and not a token table; `O-O` is reached from `o-o`, which `parseSan` refuses deliberately (case is
 * meaning) and the 2026-08-18 tolerance ruling did NOT widen.
 *
 * A variant is a STRING HANDED BACK TO THE SAME TWO READERS, never a second grammar: whatever a
 * variant resolves to is the resolvers' answer, and the union of those answers is what decides
 * between `move` and `ambiguous`.
 */
const CASE_VARIANTS: readonly ((line: string) => string)[] = [
  (line) => line.toLowerCase(),
  (line) => line.slice(0, 1).toUpperCase() + line.slice(1).toLowerCase(),
  (line) => line.toUpperCase(),
];

/** `no-such-move` outranks `unreadable`: the more specific of the codes any attempt produced. */
type RejectReason = "unreadable" | "no-such-move";

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
  const reasons: RejectReason[] = [];

  // 1. Exactly as typed: coordinate first — it is the smaller grammar and four characters of
  //    `[a-h][1-8]` cannot match a SAN string by accident — then `parseSan`.
  for (const attempt of attemptsOn(position, line, legal, deps)) {
    if (attempt.outcome === "move") return { kind: "move", move: attempt.move };
    if (attempt.outcome === "ambiguous") return ambiguous(position, attempt.candidates, legal);
    reasons.push(attempt.reason);
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
      else reasons.push(attempt.reason);
    }
  }

  // Ordered by the one legal array so the candidate list does not depend on which variant found
  // which move.
  const candidates = legal.filter((move) => folded.has(move));
  if (candidates.length === 1) return { kind: "move", move: candidates[0] as Move };
  if (candidates.length > 1) return ambiguous(position, candidates, legal);

  return {
    kind: "rejected",
    messages: [reasons.includes("no-such-move") ? "no-such-move" : "unreadable"],
  };
}

/** The fixed order of attempt, over one text: coordinate, then SAN. Both get the same `legal`. */
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
): MoveInputOutcome {
  return {
    kind: "ambiguous",
    messages: candidates.map((move) => toSan(position, move, legal)),
  };
}
