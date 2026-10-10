---
id: 20261010T162452Z-qe-e2e-decision-abc139-verdict-pass-a1b2e159
kind: decision
by: qe-e2e
at: 2026-10-10T16:24:52Z
verified_by:
confidence: high
refs:
  - ABC-139
  - ABC-035
  - QE-129-a
  - QE-129-b
  - QE-139-a
  - QE-139-b
  - QE-139-c
  - src/command-input.test.ts
  - src/turn-loop.ts
  - 20261010T162452Z-qe-e2e-observation-abc139-readings-q4-mutants-gates-5460fd41
  - 20261010T162452Z-qe-e2e-observation-abc139-gap-register-01750927
  - 20261010T161842Z-software-engineer-decision-abc139-cadence-comment-quotes-docblock-form-with-arithmetic-5b2e91c4
  - 20261010T161842Z-software-engineer-observation-abc139-gates-a1-a4-comment-only-proof-8d4a07e3
supersedes:
---

# `ABC-139` QE: **PASS**. `A1`–`A4` are MET on QE's own readings; the comment's "= 4", its `eof` clause and its "three in all" are each confirmed against the code by a mutant; no QE edit; three INFO gaps

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).

- **Scope.** Subtask `qe-ABC-139`, Workflow 04 review exit. Branch `grugops/ABC-139-cadence-comment`: tip `daa5184a`,
  code `0d22d9d6`, base `e7641dea`. The cut sha `b98fb419` and `e7641dea` carry the same `src/command-input.test.ts`
  and `src/turn-loop.ts`. The authoritative scope and risks are the ticket's `## Scope` / `## Out of scope`.
- **Method.** QE used its own worktree and its own Q4 harness (`../probe/qe139-q4.mjs`), with controls fitted to this
  file. It used transient `src/turn-loop.ts` mutants (`../probe/qe139-cadence-mutants.sh`), each restored from HEAD,
  with the tree verified clean. The SE's `q4-abc139.mjs` and `qe-ABC-132`'s `exit132.mjs` were re-run for comparison.
  Neither was refused, and both reproduce the SE's `RUN.txt`. Raw output: `../probe/RUN.txt`.

## Verdict per criterion

| | verdict | evidence, in one line |
|---|---|---|
| `A1` | **MET** | `grep -cF '1 + one per non-advancing outcome' src/command-input.test.ts`: `b98fb419` 1, `e7641dea` 1 → `0d22d9d6` **0**, `daa5184a` **0** |
| `A2` | **MET** | Block `:412–416` (all `//`) sits directly above `:417` `expect(run.renders).toBe(4);` in "renders exactly once per prompt cycle, plus the loop's own first frame". It holds `RE-EMITTING` ×1 and the formula verbatim as at `src/turn-loop.ts:279`. The cite is kept: `src/turn-loop.ts`, `runTurnLoop`'s docblock, "The render cadence". The arithmetic is 1 + 0 + 0 + 3 = **4**, and `eof` re-emits nothing |
| `A3` | **MET** | `git diff --name-only e7641dea..0d22d9d6 -- src` = `src/command-input.test.ts` only (+5/−3), and the same to `daa5184a`. On QE's harness: 8 changed lines, 0 not comment-only (measure (a), two-sided AST); `removeComments` print IDENTICAL (b); leaf tokens IDENTICAL (c); Q4 **HOLDS** |
| `A4` | **MET** | At `daa5184a`: lint 0 (100 files), typecheck 0, build 0, `npm test` 0 with 52 files / **1,608** passed (= base); JSON skip count **0**; integrity `No findings.`; `lane-inventory.js` 52/52 `No findings.`, exit 0 |

## Judgement of the new wording against the code

- **"= 4" is exactly right and complete.**
  - The docblock's formula has four terms, and the comment instantiates all four. The `1` is the frame rendered
    before the first act. `RICH_FEN` is in progress with white to move and the human is white, so 0 plies are played
    (the engine seam throws if reached) and there are 0 take-backs.
  - `board` resolves to `{ kind: "command", messages: [] }` (`src/command-input.ts:119,269`). That takes the
    `continue` back to `rendering` (`src/turn-loop.ts:392–395`), so ×3 = 3.
- **The `eof` sentence is right.** `runLines` returns `{ kind: "eof" }` when the script runs out
  (`src/command-input.test.ts:369`). The loop writes `INPUT_ENDED_NOTICE` and returns (`src/turn-loop.ts:346–349`),
  which is transition 10 to `exiting`, with no render call. Mutant M1 (EOF calls the render seam once) reds the row
  with `expected 5 to be 4`. That is `ABC-139`'s own problem statement, measured.
- **"one more frame per `board`, three in all" is right.** Mutant M2 (a message-less `command` makes one extra
  render-seam call) reds the row with `expected 7 to be 4`, which is +1 per `board`, +3 in all. The base's "a fourth, a
  fifth and a sixth" read as frame ordinals 4–6, beside a count whose extra frames are 5–7. The SE's reword corrects
  that, stays inside the ticket's block, and is stated in `…5b2e91c4` §4. QE accepts it (`QE-139-b`).
- **No QE comment-only fix was made.** No sentence in the block is wrong.

## Comment-only measures (owner Q4, both, never one alone)

- **Real diff:** (a) HOLDS, (b) IDENTICAL, so Q4 HOLDS. Corroboration (c), tokens, is IDENTICAL.
- **POS controls on this file** (reword an in-block line; insert a `/* */` line; insert a `//` line): all three HOLD.
- **NEG controls:** `toBe(4)`→`toBe(5)`, `// x` inside the `it()` title string, and a type-only `number | undefined`
  all FAIL on (a) and (b).
- **`/* … */` commenting OUT `:417`:** (a) HOLDS and (b) is DIFFERENT, so Q4 FAILS. Measure (a) alone is blind here.
- **BOUNDARY, a trailing `// QE` on `:417`:** (a) FAILS and (b) is IDENTICAL, so Q4 FAILS. Measure (b) alone would
  accept it. See `QE-139-c`.

## Board

The `In Review` exit is QE's verdict. The board move belongs to the Orchestrator (`plans/board.md` is fenced from this
hop). UAT is waived: 0 production lines, measured. Not merged, not pushed.
