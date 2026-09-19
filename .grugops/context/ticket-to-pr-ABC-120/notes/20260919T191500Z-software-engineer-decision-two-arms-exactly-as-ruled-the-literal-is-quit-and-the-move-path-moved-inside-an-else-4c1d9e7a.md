---
id: 20260919T191500Z-software-engineer-decision-two-arms-exactly-as-ruled-the-literal-is-quit-and-the-move-path-moved-inside-an-else-4c1d9e7a
kind: decision
by: software-engineer
at: 2026-09-19T19:15:00Z
verified_by:
confidence: high
refs:
  - ABC-120
  - ADR-0021
  - ABC-046
  - ABC-102
  - src/turn-loop.ts
  - src/turn-loop.test.ts
supersedes:
---

# `ABC-120` — the implementation decisions: the arms as `ADR-0021` clauses 2–5 rule them, nothing added

**Not a finding.** `human_admission` is `off` on this install and no `finding` is admissible
(`AGENTS.md`); this is the Software Engineer's own record of what was decided while building, so
QE reads the shape before the diff.

## 1. The shape is the ADR's, line for line

- `PromptOutcome` gains `{ readonly kind: "quit" }` and `{ readonly kind: "take-back"; readonly
  plies: number; readonly messages: readonly string[] }` — the ADR's own two lines. Nine members.
- `export const QUIT_NOTICE = "quit"` — the literal the ticket ruled (`## Scope` 1). Checked
  against `A2`'s four constraints in the row itself: not `INPUT_ENDED_NOTICE`, one line, and none of
  the ten `TerminalReason` words nor `win`/`draw`/`resign`/`checkmate`/`stalemate`.
- **Transition 17** sits directly after the `eof` branch and mirrors it: `sink.write(`${QUIT_NOTICE}\n`)`,
  `return { result: null, reason: null, exitCode: 0 }`. No frame, no new `LoopOutcome` field.
- **Transition 18** sits directly before the `!== "move"` branch: `takeBack(history, outcome.plies)`,
  `messages = outcome.messages`, then it FALLS THROUGH to the one `status = gameStatusOf(history)`
  transition 14 already uses. The move path (the `!== "move"` early-continue, the `wasGenerated`
  guard and `playMove`) moved inside an `else`. **No `plies` guard, no `status` re-derive of its
  own, no `continue`** — the `continue` is exactly the `A6` mutant.

## 2. Why the `else` and not a second derive line

The ADR's clause 4 says "the one derive line transition 14 already uses". A `take-back` branch that
did `status = gameStatusOf(history); continue;` would be two fewer re-indented lines and one MORE
derive site — and a second derive site is the thing `A3`'s "ONE supplier" and `ABC-021` `A8`'s
ledger exist to keep from multiplying. The re-indent costs lines on `A9`'s count (18 of 30) and
nothing else.

## 3. The three docblocks, and the count they now state

- Arm census (`PromptOutcome`): **SEVEN** non-advancing — `rejected`, `ambiguous`, `command`,
  `claim`, `eof`, `quit`, `take-back` — **FIVE** emit a frame (`eof` and `quit` do not). The list is
  spelled out so the number can be checked against the union by eye. `game-over` is not counted,
  following the ADR's own count (clause 5: "seven … five") and the original docblock's convention,
  which never counted the terminating arms as "non-advancing outcomes". Named here so QE does not
  have to re-derive why 7 and not 8.
- `LoopOutcome.reason`: "`null` on end-of-input and on quit". `LoopOutcome`'s body is unchanged.
- `runTurnLoop`: "eighteen transitions"; cadence `1 + plies + take-backs + re-emitting non-mutating
  outcomes`; "SEVEN … only five"; and the sentence "A NON-MUTATING OUTCOME IS NOT RE-EVALUATED"
  replaces "non-advancing". `grep -c "sixteen transitions"` = 0, `grep -c "only on end-of-input"`
  = 0, `grep -ci "non-mutating"` = 3 in the file (`A10`).
- One comment outside the three — transition 14's — gained "(and 18 → 2)" and "ONE per take-back",
  because it was the sentence that would otherwise have been false ("none at all on a non-advancing
  outcome").

## 4. The test seam: three tokens, not grammar

`scriptedSeams` maps `quit` → `{ kind: "quit" }`, `new` → `{ kind: "take-back", plies:
history.moves.length, messages: [] }`, `undo` → `{ kind: "take-back", plies: 2, messages: ["took
back 2"] }`. `src/command-input.ts` is NOT imported into the file (`## Test notes`); the real words,
`quit`'s confirmation and `undo`'s boundary refusal are `ABC-046`'s and `ABC-102`'s.

## 5. `A7`'s nine-member assertion is a `Record<PromptOutcome["kind"], true>`

A tenth arm is a missing property (type error); a deleted arm is an excess property (type error);
the runtime count reads 9. `exitCode`'s literal type is pinned by `[LoopOutcome["exitCode"]]
extends [0] ? true : false = true` — `[number] extends [0]` is false, so a widening is a `tsc` error.

## 6. What was NOT done, on purpose

No file under `src/` beyond the two. `COMMAND_TABLE`, `src/line-input.*`, `src/cli.ts`,
`src/result-screen.ts`, `src/history.ts`: byte-identical. `src/turn-loop.nfr.test.ts`:
byte-identical (clause 10). The `TABLE` block and rows 14/17/18: byte-identical — the six hunks in
the test file sit at the import, the dynamic import, the seam, `A3b`'s title, and the appended
block. `A3b`'s title narrowed one word (`non-advancing` → `non-mutating`); no number moved.
