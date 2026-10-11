---
id: ABC-148
title: "The binder-count comment and the `ABC-113` page call four `[:=]`-free forms the open remainder, but `tsc` already closes two of them"
status: backlog
column: Backlog
size: XS
priority: P3
epic: EPIC-006
feature: —
---

# ABC-148 — narrow two remainder lists to the forms that really pass both `tsc` and the lane: ZERO assertions changed, ZERO production lines

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-fold-qe114-2026-10-11`, Workflow 07),
> from `QE-114-c` part 1 (MEDIUM, owner BA/PM; QE `…168698b8`, readings `…94a87a28`). **The over-broad list
> was BA/PM's own wording**, in `ABC-114` `A2`. That criterion is corrected on its page. This ticket corrects
> the two places that met it as written. **This hop ran nothing.**

## Problem

*User*: the next reader of `ABC-043` `A1`'s binder-count row in `src/cli.test.ts`, deciding what the row still
misses.

*Pain*: the comment's "WHAT THIS COUNT CANNOT SEE" paragraph says *"The open remainder is the `[:=]`-free
binder forms: `for…of`, `for…in`, `catch (history)`, and a contextually-typed callback parameter."* The
`ABC-113` page's correction under line 64 gives the same four forms as binders the regex "does not see".
That is true of the regex, except for a bare `history =>`, but it never says which forms the typecheck
closes. QE measured (`…94a87a28`, § A2):

| form | `tsc` | the file at the tip |
|---|---|---|
| `for (const history of [spare])` (`D4`) | 0 | 67 / 67 green: **open** |
| `(history) =>`, a parenthesised contextually-typed parameter | 0 | 67 / 67 green: **open** |
| bare `history =>` | 0 | **red** on the count row: the regex counts the `=` of `=>` |
| `for (const history in { spare })` | **2** | closed by the typecheck |
| `catch (history)` | **2** | closed by the typecheck |

So two of the comment's four "open" forms are closed by the typecheck, and "a contextually-typed callback
parameter" is open only when parenthesised. The comment's sentence is false for two forms. It undersells
the guard, and a reader acting on it would build an assertion for two forms that are already closed. The
page note is imprecise rather than false: it should say which of its forms the typecheck closes.

*Value*: the comment says exactly what is open. That is the standard `ABC-114` set for this block.

## Scope

- **Comment prose only, in `src/cli.test.ts`**, in that one paragraph.
- **The correction note under line 64 of `plans/tickets/ABC-113-two-instrument-residuals-in-epic-006s-own-test-files.md`**
  (`:67–70` at `117c1c8e`), corrected in place with the struck words kept. **Line 64's own narrowing ("the
  annotated-rebind spelling of `D3`") is correct and stays.**
- Each corrected sentence is **earned by a re-measurement at the repair hop**, never copied from QE's note.

## Out of scope

- **Closing `D4` or `(history) =>`.** That is a new assertion and its own ticket (`ABC-114` § Out of scope).
- Every other sentence in the block, which `ABC-114`'s second QE validated.
- `ABC-114`'s page and status. It stays delivered.
- Any file under `src/` that is not `src/cli.test.ts`; any line in it that is not `//`.

## Acceptance (Given/When/Then)

- **`A1` (re-measured, five forms).** **Given** each of the five forms in the table planted at the branch tip,
  one at a time, **when** `tsc --noEmit` and `npx vitest run src/cli.test.ts` run, **then** the `tsc` exit
  code and the file's result (failed / passed, and the failing row) are recorded for each. Every build is
  reverted, and `git status --porcelain` is empty after each.
- **`A2` (the comment says what `A1` showed).** **Then** the paragraph names as open **exactly the forms that
  were `tsc` 0 and green in `A1`**. It names the forms `tsc` rejected as closed by the typecheck, and it quotes
  the regex `/\bhistory\s*[:=]/g` as the reason the open forms are unseen. If `A1` disagrees with QE's table,
  `A1` wins and the disagreement is written in the delivery note.
- **`A3` (the `ABC-113` page).** **Then** the correction note under line 64 gives the same list as `A2`, with
  the struck words kept and the correction dated. Line 64 is byte-unchanged.
- **`A4` (the fence, from git).** **Then** `git diff --name-only <base> -- src/` lists exactly
  `src/cli.test.ts`; every added or removed line under `src/` matches `^[-+]\s*//`; the `it(` and `expect(`
  counts in the file are unchanged; `npm test` file and test counts equal the base, with 0 skips.
- **`A5` (author ≠ validator, as `ABC-114` `A7`).** **Then** the delivery note names the author, and the QE
  verdict comes from a different agent that re-plants all five forms itself. A verdict that quotes the
  delivery note's numbers FAILS this criterion.

## Dependencies

- **None blocking.** `ABC-114` is merged.
- **Fold rule:** if any ticket rewrites this paragraph first (for example one that closes `D4`), it carries
  this correction, and `ABC-148` is DROPPED as folded.
- **Shared file:** `src/cli.test.ts` is also edited by `ABC-143` (the `A10` literal) and `ABC-144` (the `A7`
  pin, its own `describe`). Disjoint regions; whichever lands second rebases.

## Security / NFR triggers

- **`N8-LANE`:** comment-only, so the count is the pin: 0 files, 0 tests, 0 spawns.
- **Security: not triggered.** A comment and a page.

## Test notes

- Plant each form inside an async IIFE at the `runTurnLoop(` call, as QE did, so only the binder differs.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`.
- UAT: 0 production lines, so the waiver is expected, measured at the exit.

## Size and priority

**`XS`.** One paragraph and one page note, five planted builds.

**`P3`.** One sentence, and it errs in the safe direction: it calls two closed forms open, so it undersells the
guard. Every assertion under it is sound, and no hop has acted on it. Contrast `ABC-114` (`P2`): four sentences
found by three QE hops, two of them overselling. **`P2` PROMOTION TRIGGER:** any hop plans or cuts work to close
`for…in` or `catch (history)`.

## Definition of Ready

BA/PM, 2026-10-11. **Result: 10 of 10.** Recommended placement: `Ready`.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** QE's five-form table; two forms called open are closed by `tsc` |
| 2 | scope and out-of-scope clear | **✅** one paragraph, one page note; `D4`'s close fenced off |
| 3 | INVEST-shaped | **✅** independent; a fold rule if another ticket gets there first |
| 4 | acceptance testable and measurable | **✅** `tsc` exit codes, per-form results, a comment-only diff predicate |
| 5 | dependencies known | **✅** none blocking; shared file named |
| 6 | security/NFR triggers with a measurable target | **✅** count pin 0 / 0 / 0 |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, with a `P2` trigger |
| 10 | no major unresolved blocker | **✅** |

Column moves are the Orchestrator's.
