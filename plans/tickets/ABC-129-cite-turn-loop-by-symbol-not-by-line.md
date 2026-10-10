---
id: ABC-129
title: Fourteen of fifteen `turn-loop.ts:<line>` cites point at the wrong lines — cite by symbol, and fix the "seven tokens" comment
status: backlog
column: Backlog
size: XS
priority: P3
epic: —
feature: —
---

# ABC-129 — replace every line-number cite into `src/turn-loop.ts` with the symbol it means

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `cut-followups-2026-10-10`) from
> QE's `ABC-051` gap **QE-051-c** (`…e9262a1c`) and the Engineer's flag (`…0db3513e`), both under
> `.grugops/context/{qe-ABC-051,ticket-to-pr-ABC-051-r2}/notes/` on `grugops/ABC-051-r2` until it
> merges. **QE `ABC-036` G1 is folded in as `A3`** (`.grugops/context/qe-ABC-036/notes/…8c334653`,
> on `grugops/ABC-036-moves-command`). Pre-existing. No ticket made a correct cite wrong. Routing
> note: `.grugops/context/cut-followups-2026-10-10/notes/`.
>
> **ORDERED AFTER `ABC-036` AND `ABC-051` MERGE.** `ABC-036` edits `src/command-input.ts` and
> `src/command-input.test.ts`, which carry 4 of the cites. `ABC-051` edits `src/turn-loop.ts`,
> the file every cite points into.

## Problem

*User*: anyone who follows a comment's cite into `src/turn-loop.ts`, which is how this codebase
narrates its reasoning.

*Pain*: other `src/` files cite `src/turn-loop.ts` by line 15 times. **14 point at the wrong
lines.** BA/PM measured this at `85d0139` with
`git grep -nE 'turn-loop\.ts:[0-9]' -- src`, and the same 15 hits appear on the `ABC-036`,
`ABC-051` and `ABC-127` tips. QE counted 14 cites (13 stale) and excluded `src/turn-loop.test.ts`.
The 15th is `src/turn-loop.test.ts:1633`, and it is stale too. Only `src/line-input.ts:5`
(`:135`, `PromptOutcome`) is right, and it moves on the next insertion above `:135`. A line cite
rots on any edit to the cited file, so re-numbering would only reset the clock.

Separately, `src/command-input.ts:91` (at `ABC-036`'s tip `06b03dc`) says *"the seven tokens do
NOT share one arm. Three are `command`"*. `COMMAND_TABLE` has **eight** tokens, and **four** are
`command` (`help`, `board`, `quit`, `moves`). This is QE `ABC-036` G1, the same defect class: a
comment that the code moved under.

*Value*: each cite lands on what it names, and it keeps landing there when `src/turn-loop.ts`
changes.

## Scope

Replace each cite with the symbol or labelled anchor it means. Line numbers below are at
`ABC-051`'s tip `a9ed126`. The anchor is the contract and the line number is not.

| # | site | cites | means | anchor |
|---|---|---|---|---|
| 1 | `src/cli.test.ts:588` | `:191` | `wasGenerated` (`:212`) | `wasGenerated` |
| 2 | `src/cli.test.ts:744` | `:191-200` | `wasGenerated` | `wasGenerated` |
| 3 | `src/cli.ts:30` | `:293-309` | the `A9b` repair arm (`:329`) | `runTurnLoop`'s `` `A9b` `` arm |
| 4 | `src/cli.ts:181` | `:312` | `INPUT_ENDED_NOTICE` (`:189`) | `INPUT_ENDED_NOTICE` |
| 5 | `src/command-input.test.ts:412` | `:246` | render-cadence paragraph (`:279`) | `runTurnLoop`'s docblock, "The render cadence" |
| 6 | `src/command-input.test.ts:540` | `:269` | "Transition 1 → 2" (`:303`) | `runTurnLoop`'s "Transition 1 → 2" |
| 7 | `src/command-input.ts:58` | `:319-341` | transition 16's branch (`:361`) | `runTurnLoop`'s "TRANSITION 16" branch |
| 8 | `src/command-input.ts:59` | `:234` | `claimShortfall` (`:255`) | `claimShortfall` |
| 9 | `src/engine.ts:507` | `:138` | `EngineSeam` (`:150`) | `EngineSeam` |
| 10 | `src/line-input.ts:5` | `:135` | `PromptOutcome` (`:135`, right today) | `PromptOutcome` |
| 11 | `src/line-input.ts:21` | `:291-309` | the `A9b` repair arm | as #3 |
| 12 | `src/line-input.ts:49` | `:176` | `INPUT_ENDED_NOTICE` | `INPUT_ENDED_NOTICE` |
| 13 | `src/move-input.ts:7` | `:125` | `PromptOutcome` | `PromptOutcome` |
| 14 | `src/result-screen.ts:12` | `:312` | `INPUT_ENDED_NOTICE` | `INPUT_ENDED_NOTICE` |
| 15 | `src/turn-loop.test.ts:1633` | `:114-116` | `PromptOutcome`'s `game-over` paragraph (`:124`) | `PromptOutcome`'s docblock, "OWNS ONLY THAT THE TRANSITION EXISTS" |

On `ABC-036`'s tip, #7/#8 sit at `:59`/`:60` and #6 at `:533`. Re-read the table at the
`Ready for Dev` exit (process rule 1).

- **`A3`'s comment:** in `CommandSpec`'s docblock, make the token count and the `command`-arm count
  match `COMMAND_TABLE`.

## Out of scope

- **Line cites into any other file.** At `85d0139`, 97 lines under `src/` carry a `<file>.ts:<n>`
  cite, and 15 of them are this ticket's. The cited files include `frame.ts` (17), `history.ts`
  (11), `san.ts` (8) and `gameend.ts` (8). How many of the other 82 are stale is
  `UNKNOWN - verify`. They were not measured and are not homed here.
- **A guard against new line cites** (a lint rule or a grep row). It is negotiable, and it is left
  out. One 15-cite cleanup does not yet show that the pattern returns faster than a re-run of
  `A1`'s grep would find it.
- **Any wording change beyond the cite token,** apart from `A3`'s count. Re-wrapping a comment line
  to keep its width is allowed.
- **`src/turn-loop.ts` itself.** It holds no line cite to itself.

## Acceptance (Given/When/Then)

- **`A1` (no line cite into the loop).** **Given** the tip, **when**
  `git grep -nE 'turn-loop\.ts:[0-9]' -- src` runs, **then** it prints **0 lines**. It printed 15 on
  the base. The PR note shows both.
- **`A2` (every anchor resolves).** **Then** for each of the 15 sites, the PR note lists the anchor
  written and `grep -cF '<anchor>' src/turn-loop.ts` at the tip. Each count is **≥ 1**. A quoted
  phrase (#5, #6, #7, #15) must match **exactly 1** line. The anchor names what the table's "means"
  column names.
- **`A3` (G1).** **Then** `grep -c 'the seven tokens' src/command-input.ts` prints **0**. The
  `CommandSpec` docblock's token count equals `COMMAND_TABLE.length`, and its `command` count equals
  the number of rows with `outcome: "command"`: **8 and 4** at `06b03dc`, and read again on the base.
  *If `ABC-036` merges with this already fixed, `A3` is met at the `Ready for Dev` re-read and is
  struck, not redone.*
- **`A4` (comments only).** **Then** `git diff --numstat <base>...<tip> -- src` lists only files
  from the 15 sites (at most 9 files). Over those files the non-comment pipeline is **empty**:

  ```
  git diff -U0 <base> -- src | grep -E '^[+-][^+-]' \
    | grep -vE '^[+-][[:space:]]*(\*|/\*\*|\*/|//)'   -> empty
  ```

  The test-file count and the suite total equal the base's. Lint, typecheck, build and `npm test`
  exit 0, the skip count is 0, and integrity prints `No findings.`

## Dependencies

- **⚠️ `ABC-036` must merge first.** It is in Ready for UAT, and the owner's acceptance is owed.
  It edits `src/command-input.ts` and its test (sites #5–#8, and `A3`'s line).
- **⚠️ `ABC-051` must merge first.** It is in Ready for UAT, and the owner's acceptance is owed. It
  re-numbers `src/turn-loop.ts` after `:271`, and `A2` resolves anchors in that file.
- **`ABC-128`** edits `src/turn-loop.test.ts` (other lines). Prefer it first. The second one rebases.
- **`ABC-126`, `ABC-127`: no overlap.** They touch puzzle files and `src/quiescence.test.ts`.
- **Merge-order only, all in `Backlog`, comment lines:** ~~`ABC-038` (`src/line-input.ts`, one
  attach line)~~ *(dropped 2026-10-10 on the owner's word; no longer a merge-order neighbour)*,
  `ABC-114` (`src/cli.test.ts`), `ABC-087`/`ABC-119` (`src/engine.ts`, `src/cli.ts`).
  Whichever lands second rebases.

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** Comments only, no new file. 0 ms.
- **`NFR-002` and the other runtime NFRs — not triggered.** `A4` proves zero non-comment lines.
- **UAT is OWED under the literal standing rule.** `git diff --name-only … | grep -v '\.test\.ts$'
  | grep '^src/'` prints up to 6 production files (comment lines only). This is QE-051-d's question.
  Whether a comment-only diff counts as "zero production lines" is the **owner's word** (pending on
  `ABC-051`). If he rules yes, the waiver applies here too. This does not block `Ready`.
- **Security — not triggered.** No executable line.

## Test notes

1. **Run `A1`'s grep first, on the base, and paste the 15 lines.** If the count is not 15, the base
   moved. Re-read the table, do not guess.
2. **Name the symbol, not a new line.** `(`src/turn-loop.ts` `INPUT_ENDED_NOTICE`)` is the shape.
   Do not cite `turn-loop.ts:189`.
3. **#3/#11 and #7.** The arms are comments inside `runTurnLoop` and are not exported symbols. Cite
   the label the comment carries (`` `A9b` ``, `TRANSITION 16`) with `runTurnLoop`, so that
   `grep -F` finds it.

## Size and priority rationale

**Size `XS` (1).** 15 one-token comment edits that are already mapped, plus one count, in at most
9 files. No logic. **Not `XL`. No split.**

**Priority `P3`.** QE graded it LOW. No behaviour changes. It fixes misdirection for readers. The
UAT question (above) costs a turn of the owner's attention, which is one more reason not to rush it.

## Definition of Ready

Assessed by BA/PM, **2026-10-10**, against the wave tip `85d0139` and the tips of `ABC-036`
(`06b03dc`) and `ABC-051` (`a9ed126`). **Result: 9 of 10, 1 ⚠️. NOT met. Stays `Backlog`.** The ⚠️
is an ordering hold with a named release: when `ABC-036` and `ABC-051` have both merged, item 3
becomes ✅ by that fact, and the page meets the bar after the table is re-read.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 15 cites, 14 stale, each mapped. One stale count, measured |
| 2 | scope and out-of-scope clear | **✅** turn-loop cites and one comment. The other 97 cites, a guard and wording are fenced out |
| 3 | INVEST-shaped | **⚠️** small and testable, but **not independent until `ABC-036` and `ABC-051` merge** (Orchestrator, after the owner's acceptance of both) |
| 4 | acceptance testable and measurable | **✅** a grep of 0, anchor counts ≥ 1 or = 1, `grep -c` 0 plus 8/4, an empty non-comment pipeline |
| 5 | dependencies known | **✅** `ABC-036`, `ABC-051` (first), `ABC-128` (same file), Backlog overlaps named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` 0 ms; runtime NFRs not triggered and proven by `A4`; the UAT path is stated |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3`, with the reason |
| 10 | no major unresolved blocker | **✅** the owner's comment-only ruling decides whether UAT is waived, and it does not block the build |
