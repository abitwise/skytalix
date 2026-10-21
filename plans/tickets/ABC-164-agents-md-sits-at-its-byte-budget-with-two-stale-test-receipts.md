---
id: ABC-164
title: "`AGENTS.md` sits at exactly its 24,576-byte budget, and two of its receipts carry test counts that every test-adding ticket makes stale (`CLI_DEEP` 7, `Test (all)` 57 / 1775)"
status: backlog
column: Backlog
size: XS
priority: P3
epic: —
feature: —
---

# ABC-164 — move the two live counts out of `AGENTS.md` into the command log, and buy back headroom. Scribe; ZERO `src/` lines

> **Cut 2026-10-17 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-followups`), from the Scribe follow-up the
> QE hops on `ABC-101` carried (`.grugops/context/qe-ABC-101/notes/…2fa04d14` § Owed elsewhere) and the Orchestrator's
> list. Re-measured at `main` `1671f24f` (`…bapm-cut-followups/notes/…readings-85e8dfdd`).

## Problem

*User:* every agent that reads `AGENTS.md` on start, and the Scribe hop that next has to add a line.

*Pain:* at `1671f24f`:
- `wc -c AGENTS.md` = **24,576** B, the budget exactly (`ABC-109`; guarded by `src/cli.test.ts` `A5` at `:2421`).
  **0 B of headroom:** the next byte added reds `npm test`.
- The `CLI_DEEP` receipt (`AGENTS.md:132`) says "7 passed (1 default)". The lane reads **10 passed (1 default)** at
  `1671f24f`.
- The `Test (all)` receipt (`AGENTS.md:85`) says "57 files, 1775 tests". The suite reads **58 files, 1810 tests**.
- Both counts move with every ticket that adds a test. `ABC-096` (in flight) will move them again. The full dated
  receipts already live in `memory-bank/90-agents-md-command-log.md` (`§ Test (all)`, `§ Real-engine CLI lane`), and
  `AGENTS.md`'s `### Test` heading points there ("Full RUN receipts for every command below").

*Value:* `AGENTS.md` states commands and traps, not counts that rot, and the next Scribe edit fits.

## Scope

- **`AGENTS.md`:** in the `Test (all)` and `CLI_DEEP` comments, replace the test counts with the pointer the file
  already uses, keeping every trap and rule in them (the 60 s bound and exit 124, Ctrl-C not SIGKILL, "Unset: NOT
  DEFINED, not skipped", the run-at-QE trigger). The Scribe writes the words.
- **`memory-bank/90-agents-md-command-log.md`:** one dated RUN receipt per lane, read at the tip, plus the usual
  history row with the byte figures before and after.

## Out of scope

- **Any other `AGENTS.md` line**, and every other lane's counts (they are dated RUN receipts and stay).
- `src/`, including the `ABC-065`/`ABC-109` guard rows.
- Raising the 24,576 B budget.

## Acceptance (Given/When/Then)

- **`A1` (headroom bought back).** **Given** head, **then** `wc -c AGENTS.md` is **less than 24,576**. The command
  log row states the figure, the headroom in bytes, and the headroom in edits at `ABC-109`'s 1,159 B/edit.
- **`A2` (no live count left in the two comments).** The `Test (all)` comment and the `CLI_DEEP` comment each contain
  **no** test or file count. The `### Test` pointer to `memory-bank/90-agents-md-command-log.md` is kept. QE reads
  them on joined text.
- **`A3` (the rules survive).** Each of these strings is still in `AGENTS.md`, checked on joined text: `exits 124`,
  `never SIGKILL`, `NOT DEFINED, not skipped`, `Run at QE`. Each occurs at least once at `1671f24f`.
- **`A4` (the receipts are true).** The command log's new receipts equal a run at the tip:
  `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts` (count, exit) and
  `npm test` (files, tests, exit). They are read, not copied from this page.
  *(Heap prefix added 2026-10-21 by BA/PM, `bapm-rule-QE-159` ruling `QE-159-b`: `ABC-173`'s heap guard refuses the
  bare command. The criterion is unchanged.)*
- **`A5` (fences).** `git diff --name-only <base>` lists exactly `AGENTS.md` and
  `memory-bank/90-agents-md-command-log.md`. `npm test` is green, with the `ABC-065` and `ABC-109` rows included.

## Dependencies

- **Pull after `ABC-096` merges**, so the receipts are read once on its tree. Not a blocker on the cut.
- `ABC-109` — `Done` (the budget and its guard).

## Security / NFR triggers

- **`NFR-008`:** not triggered. 0 test files, 0 tests.
- **Security:** not triggered. Documentation only.

## Test notes

1. **Read on joined text.** The comments wrap across lines (`G-QE-070-2`).
2. **Gates:** lint, typecheck, build, `npm test`. A QE hop is owed. The UAT waiver is expected (0 production lines).

## Size and priority

**`XS`:** two comments and two receipts. **Not `S`:** no code.

**`P3`:** a stale count misleads and breaks nothing. **Not `P2` yet. Promotion trigger (`P2`, merge first):** a
ticket that must add text to `AGENTS.md` is cut or pulled (for example the Scribe line `ABC-146` owes on its
`node` route), because at 0 B it cannot land.

## Definition of Ready

BA/PM, 2026-10-17. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 24,576 B; `CLI_DEEP` 7 vs 10; `Test (all)` 57/1775 vs 58/1810 at `1671f24f` |
| 2 | scope and out-of-scope clear | **✅** two comments, two receipts; other lines and the budget fenced |
| 3 | INVEST-shaped | **✅** small; pull order after `ABC-096` |
| 4 | acceptance testable and measurable | **✅** `< 24,576` B, 0 counts, four strings kept, receipts equal a tip run |
| 5 | dependencies known | **✅** `ABC-096` (order), `ABC-109` `Done` |
| 6 | security/NFR triggers with a measurable target | **✅** not triggered, with reasons |
| 7 | test notes present | **✅** two |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, promotion trigger named |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's. Owner of the build: **the AGENTS.md Scribe**, then QE.
