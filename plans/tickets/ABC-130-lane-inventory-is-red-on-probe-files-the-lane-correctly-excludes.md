---
id: ABC-130
title: "`lane-inventory.js` has been red on every tree since 2026-09-24 — it expects tracked `.grugops/context/` probe files that the lane excludes on purpose"
status: backlog
column: Backlog
size: XS
priority: P2
epic: —
feature: —
---

# ABC-130 — the inventory tool must not expect factory state that the lane rightly refuses to collect

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rule-abc119-a2`). It comes from the
> Engineer's `ABC-119` r2 stop (`…b7edc319`, `.grugops/context/ticket-to-pr-ABC-119-r2/notes/`) and
> from the two times `ABC-122` named this item (build `…3a0e770b`, QE `…8f1c4d02`). **QE `ABC-118` gap
> G5 (`Q2`) is folded in.** That is the same mechanism. The ruling and its measurements are in
> `.grugops/context/rule-abc119-a2/notes/`.
>
> **`ABC-118` IS NOT RE-OPENED AND IS NOT DEFECTIVE.** It passed QE, and QE named G5 rather than
> folding it in. **This page cuts G5 only.** QE `ABC-118`'s G2, G3, G4 and G6 are still owed to BA/PM
> and are **not** cut here.

## Problem

*User:* every hop that runs `ABC-118`'s control: QE, the Engineer, and every reader once the
`ABC-109` Scribe line gives the tool a caller.

*Pain:* `node tools/grugops/lane-inventory.js` **exits 1 on every tree since `b324cb6` (2026-09-24)**.
The cause is tracked `*.test.ts` probe files under `.grugops/context/`, which `vitest.config.ts`
excludes **on purpose**. The `.grugops/**` exclude entry exists because that directory is "docs and
factory state that may carry illustrative code". Re-measured at this cut on `242b624` and `ba20d25`:

| added | probe file (tracked, correctly not collected) |
|---|---|
| `b324cb6`, 2026-09-24 | `.grugops/context/ruling-abc079-oracle/probe/vt/oracle.test.ts` |
| `0ebe63f`, 2026-10-10 | `.grugops/context/fold-abc084-gate-b/probe/a3-const-eval.probe.test.ts` |
| `c632048`, 2026-10-10 | `.grugops/context/cut-harder-puzzles/probe/vitest-price.test.ts` |

- **It recurs by construction.** Any hop that commits a vitest probe beside its notes re-reds the
  tool. Measured in a copy: one more committed probe gave 4 findings, still exit 1.
- **Three hops have paid for it so far:** the `ABC-122` build, the `ABC-122` QE hop, and the
  `ABC-119` build, whose `A2` had to be ruled.
- **A control that is always red teaches its readers to skip it.** Then a real inventory change, the
  defect `ABC-118` (`P1`) was cut to catch, goes unseen.

**The inversion (G5), re-measured, and it disagrees with the record.** QE recorded that removing the
`.grugops/**` glob turns the tool **GREEN**. **Today it stays RED, but for a false reason.** It
collects a fourth probe, `.grugops/context/ticket-to-pr-ABC-081/probe/depth-vitest.test.mjs`, which
has been tracked since `504f046`. The tool reports that file as *"NOT tracked by git"*, which is G4's
false text. Either way the tool reads a correct `exclude` as a defect and cannot honestly report the
harmful edit.

*Value:* the tool is green on a correct tree, red on a real inventory change, and every line it prints
is true.

## The fix shape — RULED

**The tool's tracked set omits `.grugops/`, by a fixed pathspec held in the tool.** It is never
derived from `vitest.config.ts`. **Owner: Software Engineer.**

| option | verdict |
|---|---|
| **Tool omits `.grugops/` (literal in the tool)** | **CHOSEN.** One file. It ends the recurrence. It keeps `ABC-118` `A4`'s property: no `test.exclude` edit can reach the expectation |
| Tool reads the exclude list from the config | **REFUSED.** The expectation would then move with the very edit it guards (`ABC-118` `A4`) |
| Rename or delete the probes | **REFUSED.** It rewrites three other tasks' evidence, which notes cite by path (`cut-harder-puzzles` `…5fefe3f1`, `fold-abc084-gate-b` `…28f56967`, `ABC-122`). It also recurs with the next probe |
| Change `vitest.config.ts` | **REFUSED.** The config is right. Dropping `.grugops/**` would collect factory probes into the lane, and the file is `ADR-0008`'s |

## Scope

- `tools/grugops/lane-inventory.js` only:
  - the tracked-set pathspec omits `.grugops/`;
  - a **collected** path under `.grugops/` prints a true line;
  - the header comment states the omission and why it is held in the tool.

## Out of scope

- **`vitest.config.ts`, `src/`, `package.json`, `AGENTS.md`, `plans/nfr-catalog.md`, the ADRs.** None
  is touched.
- **The probe files.** All four stay byte-identical; none is renamed or deleted.
- **Other documentation directories** (`plans/`, `memory-bank/`, `.github/`, `.gemini/`). They hold
  **zero** tracked `*.test.ts` today (measured), so no pathspec is added for them. Add one when a file
  appears.
- **QE `ABC-118` G1** (the tool has no caller; that is `ABC-109`'s Scribe line), and **G2, G3, G4
  and G6.** G4 is touched only for paths under `.grugops/`, through `A2`.

## Acceptance (Given/When/Then)

- **`A1` (green on the real tree).** **Given** the build's tip, **when**
  `node tools/grugops/lane-inventory.js` runs at the root, **then** it exits **0**, prints
  `No findings.`, and prints **two equal counts**. Each count equals
  `git ls-files -- '*.test.ts' ':!.grugops/' | wc -l`. No `.grugops/` path appears in the output.
  *At this cut: 50 collected, 53 tracked, exit 1.*
- **`A2` (the harmful edit reds, and says so truly).** **Given** a copy outside the repository with
  `".grugops/**"` removed from `exclude`, **then** the tool exits **1** and names **every** collected
  `.grugops/` path. Today that is three `.ts` files and one `.mjs` file. **No line for those paths
  contains `NOT tracked by git`.** With the glob restored, the tool exits 0.
- **`A3` (`ABC-118`'s reds still fire).** In the same copy, each of the following still reds, with
  the path named:
  - **M1** — `exclude` gains `"src/perft.test.ts"`;
  - **M2** — a foreign checkout planted under `.claude/worktrees/probe/` with `.claude/**` typo'd. This
    needs a replacement config; the CLI `--exclude` flag appends, it does not replace;
  - **M3** — an untracked `src/zz.test.ts`, green after `git add`.
- **`A4` (the recurrence is closed).** **Given** the copy, **when** a new
  `.grugops/context/zz/probe/new.test.ts` is committed, **then** the tool still exits **0**.
  *At this cut: 4 findings, exit 1.*
- **`A5` (the fence, from git).** `git diff --numstat <wave>...HEAD -- src/ tools/ vitest.config.ts
  package.json AGENTS.md plans/nfr-catalog.md` names **exactly one** file,
  `tools/grugops/lane-inventory.js`. `git diff --numstat <wave>...HEAD -- .grugops/context/*/probe/`
  is **empty**.
- **`A6` (gates).** `npm run lint`, which has read `tools/**/*.js` since `ABC-124`, plus
  `npm run typecheck`, `npm run build` and `npm test` all exit 0. The skip count is **0**.
  `test-skip-integrity.js` prints `No findings.`

## Dependencies

- **None blocking. Pullable today.** `ABC-118` and `ABC-124` are `Done`.
- **Successor: `ABC-119` `A2`(i).** That clause is read as a delta and does **not** wait for this
  ticket. Once this ticket merges, the delta reading becomes the literal "`HEAD` exits 0". Any future
  ticket that cites "`lane-inventory.js` exits 0" names this ticket as its predecessor.
- **Ordering: `ABC-109`'s Scribe line** (the tool's first caller) should land **after** this one, so
  that the control is not wired in already red. See the `P1` trigger.

## Security / NFR triggers

- **ASVS L1.** The pathspec is a **literal** in the file, never built from argv, the environment or
  the config. `git` and `vitest` keep fixed argv. The output carries paths and counts only, never
  contents (`ABC-118`).
- **`N8-LANE`: 0 ms, 0 files added under `src/`.** The tool is outside the lane. **`N8-SPAWN`: 0.**
  **`NFR-008`: not touched.** Security/NFR is expected **not** to be triggered (the `ABC-124`
  precedent for a dev-only script). That routing is the Orchestrator's.

## Test notes

- **Every mutant goes in a copy outside the repository.** Use `git archive`, then `git init` and
  commit, and symlink `node_modules`. The tool needs a git index. The repository's own
  `vitest.config.ts` is never edited.
- **`A2` and `A3`'s M2 need a replacement config.** The CLI `--exclude` flag appends; it does not
  replace (`ABC-118`'s trap).
- **Watch `A1` and `A4` RED on the unfixed tool first**, then green on the fix. The readings at this
  cut are on the page, so the red half is reproducible.
- **The QE hop is owed** before `In Review` is exited (the owner's standing rule). QE is not UAT.
  The diff is expected to carry zero `src/` lines, so the 2026-08-17 UAT waiver should apply. That
  is **measured from git at the exit**, never asserted here.
- `.grugops/test-skips.md` is human-owned: read it and run the check, never write to it.

## Size and priority rationale

**`XS`.** One file and one literal pathspec, plus one message branch and four re-planted reds.
Comparable: `ABC-124` (`XS`), a config entry and three small fixes with a red/green plant.
**Not `S`:** no instrument, lane or harness is created. `ABC-118` (`S`) built the instrument.

**`P2`.**
- **For `P1`:** the control has been red for 16 days, three hops paid for it, and an always-red
  control hides the real red it exists for.
- **Against `P1`, and decisive:** the tool has **no caller** (G1), so no gate reds. No ticket is
  blocked: `ABC-119`'s delta reading is met without this one. No product defect exists.
- **Not `P3`:** the recurrence is structural, and its first caller will wire it in red.
- **`P1` PROMOTION TRIGGER (not fired):** any caller lands while this is unmerged (the `ABC-109`
  line, a gate step, a script or a hook), or a ticket makes the literal exit 0 blocking.

## Definition of Ready

Assessed by BA/PM at the cut, **2026-10-10**, at `ba20d25`. **Result: 10 of 10, 0 ⚠️.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** Three probe files, dated by commit. Red on base and head. The recurrence and the G5 inversion were both measured in a copy |
| 2 | scope and out-of-scope clear | **✅** One file. The config, the probes, the other documentation directories, and G1–G4/G6 are fenced by name |
| 3 | INVEST-shaped | **✅** One hop, one file, independent of every ticket in flight |
| 4 | acceptance testable and measurable | **✅** Exit codes, equal counts against a stated `git ls-files` pathspec, a forbidden substring, four named reds, and two git predicates. The unfixed readings are recorded for `A1`, `A2` and `A4` |
| 5 | dependencies known | **✅** No blockers. `ABC-119` `A2`(i) is the successor. The `ABC-109` line is ordered after this ticket |
| 6 | security/NFR triggers with a measurable target | **✅** ASVS L1: the literal pathspec, fixed argv, paths only. `N8-LANE` 0 ms / 0 files. `N8-SPAWN` 0 |
| 7 | test notes present | **✅** Five: the copy discipline, the replacement-config trap, red-first, the QE hop and the waiver, and the human-owned skips file |
| 8 | size assigned | **✅** `XS`, against a comparable |
| 9 | priority assigned | **✅** `P2`, argued both ways, with a promotion trigger |
| 10 | no major unresolved blocker | **✅** None |

Column moves are the Orchestrator's.
