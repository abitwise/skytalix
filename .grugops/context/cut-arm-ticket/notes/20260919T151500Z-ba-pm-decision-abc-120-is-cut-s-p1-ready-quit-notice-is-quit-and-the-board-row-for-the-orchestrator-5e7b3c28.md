---
id: 20260919T151500Z-ba-pm-decision-abc-120-is-cut-s-p1-ready-quit-notice-is-quit-and-the-board-row-for-the-orchestrator-5e7b3c28
kind: decision
by: ba-pm
at: 2026-09-19T15:15:00Z
verified_by:
confidence: high
refs:
  - ABC-120
  - ABC-046
  - ABC-102
  - ABC-112
  - ABC-045
  - ADR-0021
  - EPIC-006
  - plans/tickets/ABC-120-the-turn-loop-gains-quit-and-take-back-arms.md
  - plans/board.md
supersedes:
---

# CUT: `ABC-120`, `S` / `P1`, DoR 10/10, column `Ready` — and the three product calls made on the page

**NOT A STAMP.** A hand-authored `decision`; `human_admission` is `off`. The page is the authority for
scope and criteria (`## Scope`, `## Risks` cited as authoritative per the role); this note is the
hand-off and the board row.

## The ticket, in three sentences

`src/turn-loop.ts` gains `{ kind: "quit" }` (transition 17 → `exiting`, one `QUIT_NOTICE` line, no
frame, `{ null, null, 0 }`) and `{ kind: "take-back"; plies; messages }` (transition 18 →
`evaluating-terminal` via `takeBack` then the one derive at `:390`), plus three docblock re-wordings;
`src/turn-loop.test.ts` gains the rows `ADR-0021` clause 9 names because the arms alone red nothing.
Nothing else under `src/` changes, and `ABC-046` / `ABC-102` now land after a named id.

## Three calls that were mine to make, made rather than deferred

1. **`QUIT_NOTICE = "quit"`.** `ADR-0021` clause 3 left the literal to the arm ticket under four
   constraints (names quitting; ≠ `INPUT_ENDED_NOTICE`; one line; none of the ten `TerminalReason`
   words nor `win`/`draw`/`resign`/`checkmate`/`stalemate`). The shortest string that meets all four
   is the command the player typed. `A2` asserts the constraints mechanically against
   `EVERY_TERMINAL_REASON` so a re-wording cannot drift into a forbidden word. **Reversible by one
   literal**: `ABC-046` `A3` asserts inequality against the exported constants, never a substring.
2. **`src/turn-loop.nfr.test.ts` stays byte-identical.** `ADR-0021` clause 10 lists it under "must
   NOT change" and says its sentence "narrows" — I read the narrowing as living in
   `src/turn-loop.ts`'s docblock and `A3b`'s title (in-scope file), not in a file the subtask fenced.
   The nfr row drives `rejected` only, so its sentence is true of what it exercises. If QE reads it as
   a false sentence under `ABC-114`'s pattern, that is a one-word re-title on a later hop, not this
   ticket's scope creep.
3. **Column `Ready`, not `Backlog`.** The role owns the `Backlog → Ready` exit and the DoR is 10/10
   with no ⚠️: the ruling landed, the dependencies are orderings on named ids, the in-development
   overlap was checked. `Ready` is 2/8. The paste is the Orchestrator's.

## Size and priority, the short form (the page carries the argument)

`S`: re-opens a mutation-tested module, +16 measured / ≤ 30 bounded production lines, three docblocks
against a count, ~8 rows, a test-seam extension, one watched-RED mutant round. Not `XS` (`ABC-045`
has no mutant round), not `M` (no ruling, no file, no harness shape). `P1`: first link in the chain
that ends `ABC-112` (`P1`, `help` advertises `quit`) and gates `ABC-102` (`P1`). Not `P0`: Ctrl-D exits
cleanly today. Triggers on the page.

## THE BOARD ROW — paste under `## Ready (WIP 2/8)` → 3/8; `plans/board.md` NOT opened here

```
- [ABC-120] The turn loop gains a `quit` arm and a `take-back` arm — transitions 17 and 18, the arm ticket `ADR-0021` clause 8 says lands FIRST  (BA/PM, **S, P1**, epic: EPIC-006, since: 2026-09-19, **DoR 10/10 — PULLABLE TODAY, NO BLOCKING DEPENDENCY, NO ⚠️: the ruling this work waited on since 2026-08-13 landed as `ADR-0021` on the owner's verbatim word *"5. b, resign should be separate"*.**) Cut from `ADR-0021` clauses 8–9. **Scope: `src/turn-loop.ts` (+~16 production lines, bounded ≤ 30 by `A9`) and `src/turn-loop.test.ts` rows ONLY — `PromptOutcome` gains `{ kind: "quit" }` and `{ kind: "take-back"; plies; messages }`, `export const QUIT_NOTICE = "quit"`, transitions 17 (`awaiting-human` → `exiting`, one notice, NO frame, `{ null, null, 0 }`) and 18 (`awaiting-human` → `evaluating-terminal`, `takeBack` then the ONE derive); states stay 8, transitions 16 → 18; three docblocks re-worded (`A10`).** The arms alone red ZERO existing tests (measured out-of-tree at the ruling), so the ten criteria ARE the guard: the no-re-evaluation mutant is WATCHED RED on the take-back rows and green on `quit` (`A6`); `A14`'s ten, `exitCode: 0`'s type, the 18 scripted rows and their frame counts, `INPUT_ENDED_NOTICE`, `src/turn-loop.nfr.test.ts` and every other `src/` file byte-identical (`A7`/`A8`). **`N8-LANE` ≤ 650 ms in the measured-then-clause-state form, 0 new files — and `NFR-008`'s 60 ms CPU headroom at `2c96dbd` is named as the BINDING number, re-measured at the delivery base.** **THE ID IS 120, NOT 118: `ABC-118`/`ABC-119` live on the unmerged `grugops/cut-050-exclude-and-g06` (`81add97`).** Unblocks `ABC-046` and `ABC-102` (both now ORDERED after this id, one line each on their pages); `ABC-045` independent (disjoint files); `ABC-112` cancels when `ABC-046` is pulled. Retires `60-progress.md` § Known UNCUT work row 5. Notes: `.grugops/context/cut-arm-ticket/notes/`.
```

**Two rows the Orchestrator may annotate in place (not done here, not board edits I own):** `ABC-046`
and `ABC-102`'s Backlog rows still say *"the arm ticket (uncut) must land first"* — it is cut, and
its id is `ABC-120`. Their pages already carry the line.

## What this ruling does NOT do

Opens no file under `src/`; opens neither `plans/board.md`, `AGENTS.md` nor `plans/nfr-catalog.md`;
re-opens no clause of `ADR-0021`; does not decide `ABC-046`'s confirmation item or `ABC-102`'s refusal
wording; merges nothing; deploys nothing; signs nothing.
