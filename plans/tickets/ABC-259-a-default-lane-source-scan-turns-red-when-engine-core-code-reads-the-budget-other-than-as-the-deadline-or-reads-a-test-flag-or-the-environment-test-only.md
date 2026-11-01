---
id: ABC-259
title: "One default-lane source scan turns red when engine-core code reads the search budget other than as the deadline, or reads a test flag or the environment (test-only, `ADR-0056` R-TC item 2, gap G-1)"
status: backlog
column: Backlog
size: XS
priority: P2
epic: EPIC-010
feature: —
---

# ABC-259: make R-TC item 2 a default-lane row (`ADR-0056` gap G-1)

> **Cut 2026-11-01 by BA/PM** (task `bapm-reconcile-adr0056`, records only, at `main` `bd29dd50`; nothing run, built
> or timed; `src/`, `tools/`, `data/` and the board untouched). Source: `ADR-0056` D5's dated block "the owner's three
> answers", § Gaps, **G-1** (merge `a0f9297e`, ADR commit `fe50a11f`; Architect note `arch-adr0056-owner-answers`
> `…c8c38f1e`). `EPIC-010` milestone 1b, row 30. **DoR 10/10. Recommended `Backlog → Ready`.** Column moves are the
> Orchestrator's.

## Problem

- **User:** the owner, who set the condition *"Make sure engine is not changed internally"* (`orch-2026-10-30a`
  `…43098cef`); the SE and the reviewer of every engine change from milestone 1b on.
- **Pain:** `ADR-0056` R-TC item 2 says no engine code path is keyed on a test control: the budget enters the engine
  core only as the deadline, and the core reads no test flag and no environment. Today that rests on review alone
  (R-TC: *"G-1 below would make this mechanical"*). Every fast read (C2′ at 100 ms, S′ at 0.5 s, C3″) is trusted only
  if it holds: a branch keyed on a 100 ms budget would make every read measure an engine that does not ship.
- **Fact at `main` `bd29dd50`** (read by a text scan of the five files with comments stripped, A8's way; no test run):
  `budgetMs` occurs twice in `src/engine.ts` code, the `readonly budgetMs: number;` field (line 180) and
  `deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS)` (line 710); 0 times in `src/search.ts`,
  `src/quiescence.ts`, `src/evaluate.ts`, `src/transposition.ts`. None of the five holds `process.`, `argv`,
  `import.meta.env`, `VITEST`, `NODE_ENV` or a `…_DEEP` name in code. Comments do mention `budgetMs` (`src/engine.ts`
  lines 56, 148, 176, 578) and `process` (`src/transposition.ts` line 14, `src/evaluate.ts` lines 377, 402).
- **Value:** the owner's condition is held by a row on every `npm test`, at the cost of one row.

## Scope

1. **One `describe` block** in one existing default-lane test file, in the shape of `src/levels.test.ts`'s
   boundary row A8 (read the source with `readFileSync`, strip comments, match). The file is the SE's pick at design;
   `src/levels.test.ts` beside A8 is the ADR's shape. `src/engine.test.ts` is `ABC-249`'s and is avoided while that
   ticket is in flight.
2. **The scanned files**, named in the row as a literal list: `src/engine.ts`, `src/search.ts` (which holds the move
   ordering, `orderMoves`), `src/quiescence.ts`, `src/evaluate.ts`, `src/transposition.ts` (the ADR's list).
3. **The rules**, each on code with comments stripped:
   - **Budget:** `budgetMs` occurs exactly twice in `src/engine.ts`, once as the options type's field and once inside
     the deadline expression, and 0 times in the other four files.
   - **Environment:** no file contains `process.`, `argv` or `import.meta.env`.
   - **Test flag:** no file contains `VITEST`, `NODE_ENV` or an identifier ending in `_DEEP`.

## Out of scope

- Any production line. No file under `src/` changes except the one test file; `tools/`, `data/`, `vitest.config.ts`,
  `package.json`, `AGENTS.md` and the board do not.
- R-TC's other items (where a control is set, the shipped artifact, harness tickets): review and `ABC-255`'s A6 hold
  them.
- Time rules that read the deadline as a continuous function of the time left (R-TC "Allowed", W1's shape): they read
  `deadline`, not `budgetMs`, and the row does not police them.
- Widening the list to `src/legal.ts`, `src/moves.ts` or a module milestone 1b adds: not asked by the ADR. Recorded as
  an open question for the Architect (§ Dependencies).
- A semantic (AST) analysis. A text scan is what A8 uses and what the ADR proposed.

## Acceptance criteria

The base is `main` at the commit the build branches from. The tip is this ticket's delivered commit.

- **`A1` (green at production).** **Given** the tip, **when** `npm test` runs, **then** the new row passes on the five
  files as they stand, with the comment mentions listed in § Problem present.
- **`A2` (the budget rule turns red on a planted read).** **Given** a scratch copy of the tip with one line added to
  `chooseMove` in `src/engine.ts` that reads `options.budgetMs` outside the deadline expression (for example
  `if (options.budgetMs <= 100) { … }`), **then** the row fails, naming `src/engine.ts` and the budget rule. **And
  given** a scratch copy with `budgetMs` read once in `src/search.ts`, **then** the row fails, naming `src/search.ts`.
- **`A3` (the environment rule turns red).** **Given** a scratch copy with `process.env.SKYTALIX_FAST` read in
  `src/search.ts`, **then** the row fails, naming the file and the rule.
- **`A4` (the test-flag rule turns red).** **Given** a scratch copy with the identifier `SEARCH_DEEP` used in code in
  `src/evaluate.ts`, **then** the row fails, naming the file and the rule.
- **`A5` (comments do not trip it).** **Given** a scratch copy with a comment added to `src/quiescence.ts` that names
  `budgetMs`, `process.env` and `ENGINE_DEEP`, **then** the row stays green.
- **`A6` (planted lines are never committed).** A2–A5 are read out of tree by the SE and re-read by QE; the build note
  lists each plant and the row's message. No plant is in any commit.
- **`A7` (what the diff may touch).** **Given** `git diff <base> <tip> --name-only`, **then** it prints only the one
  test file. No existing row's title or `expect(` line changes; a header test count in that file, if it has one, is
  raised by the number of rows added. Added comments cite only `ABC-259`, `ADR-0056` or R-TC.
- **`A8` (cost).** **Given** the vitest JSON report of three head runs of `npm test`, **then** the new rows' summed
  duration median is **≤ 20 ms** (five file reads and regex matches; no search, no clock).
- **`A9` (gates).** **Given** the tip, **then** lint, typecheck and build exit 0; `npm test` is green with 0 skips and
  the count is base + the rows added; `test-skip-integrity` reports no findings; `G8` head median ≤ 10 s (`NFR-008`).

**If a rule cannot be written so that A1 and A5 hold together** (a comment-stripping case the A8 regex gets wrong on
these files), the SE stops and reports the case. The ticket goes back to BA/PM; the rule is not loosened silently.

## NFR triggers

- **`NFR-008`:** the default lane stays **≤ 10 s** (A9). The rows' budget is **≤ 20 ms** (A8). `G8` read 9.09 s at
  `qe-ABC-248`, and `ABC-249` budgets ≤ 100 ms of that headroom.
- **`ADR-0046` R1–R4:** not triggered; the rows read no clock.
- **`NFR-004` / `G5` / `NFR-009`:** no production line changes, so none moves.
- **Security (ASVS L1):** not triggered. Test-only, no input surface.

## Test notes

1. **The plants are examples.** Any line that breaks a rule will do, as long as A2–A4 each show one rule's failure
   message naming its file.
2. **A later engine ticket that adds a core module** (milestone 1b's packed-move code, for example) adds it to the list
   in its own diff, and its review checks that; until the Architect answers the open question, this is a review
   habit, not a row.
3. **No production line, so no smoke and no UAT:** the waiver (`AGENTS.md`, 2026-08-17) holds if
   `git -c core.quotePath=false diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` is
   empty at delivery. QE's verdict is the gate (the `qe-e2e` hop is owed as on every ticket).
4. **Rollback:** revert the delivered commit.

## Size and priority

- **Size: `XS`.** One `describe` block, three rules, five files, four plants read out of tree. **Not `S`:** no
  fixture, no search, no timing design.
- **Priority: `P2`.** It holds the owner's explicit condition for every graded read, and milestone 1b rewrites the
  scanned search, ordering and key code next. **Not `P1`:** nothing breaks the condition today (§ Problem), so it
  guards, it does not fix.

## Dependencies

- **`ADR-0056` R-TC** on `main` (merge `a0f9297e`). No ADR of its own.
- **Order (recommended, not binding):** before `ABC-251`, which rewrites the search, quiescence, ordering and killers,
  so that rewrite is a change the row already reads. Beside `ABC-249` (a different test file, if the SE keeps to
  § Scope 1). Order is the Orchestrator's.
- **Shared file:** the chosen test file only. `src/levels.test.ts` has no open ticket in flight at `bd29dd50` that
  BA/PM knows of (`UNKNOWN - verify` against the board at pull).
- **Open question for the Architect (not a blocker):** should the list also hold `src/legal.ts`, `src/moves.ts` and
  any module milestone 1b adds? The ADR named five files; widening is a one-line change to the list and does not
  change this ticket's size.
- **Owners:** SE: A1–A8. QE: the re-read of A2–A5 and A9's lane.
- No owner question.

## Definition of Ready

BA/PM, 2026-11-01, at `main` `bd29dd50`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ R-TC item 2 rests on review alone; the ADR names the gap (G-1); today's counts read |
| 2 | scope and out-of-scope clear | ✅ one block, one file, five named files, three rules; production, widening and AST out |
| 3 | INVEST-shaped | ✅ independent of every engine ticket; XS; testable by plants |
| 4 | acceptance testable and measurable | ✅ green at production; red on each of three planted violations, naming file and rule; green on comment-only mentions; one file in the diff; ≤ 20 ms; 0 skips; `G8` ≤ 10 s |
| 5 | dependencies known | ✅ `ADR-0056` R-TC merged; order before `ABC-251` recommended; the widening question stated as non-blocking |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` ≤ 10 s; rows ≤ 20 ms; R1–R4 and security not triggered |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P2`, both directions argued |
| 10 | no major unresolved blocker | ✅ none; a rule that cannot hold A1 and A5 together stops the build and comes back (stated) |

**Recommended: `Backlog → Ready`.** Column moves are the Orchestrator's.
