---
id: 20260812T100000Z-qe-e2e-artifact-ref-gate-run-7a4c19e8
kind: artifact-ref
by: qe-e2e
at: 2026-08-12T10:00:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-017-qe
  - abc017-qe-2026-08-12
  - ABC-017
  - ABC-027
  - ABC-016
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - src/frame.test.ts
  - plans/tickets/ABC-017-bounded-move-history-pane.md
supersedes:
---

# Every command this gate ran, the baseline, the coverage, and the ONE thing that changed underneath it

> **HAND-AUTHORED.** `scripts/context-io.ts` does not exist in this repo and the kit has no
> `scripts/` directory (`$GRUGOPS_HOME/agent-factory/scripts/` is absent);
> `mcp__grugops__propose_note` is not in this session's tools. Workflow 16 names `context-io.ts` as
> the single sanctioned writer; it is absent, so this note is written by hand and **says so**.
> **Nothing in this note set is a `finding`** — no `§14-gate#<id>` stamp exists in this repo and
> none was invented. No self-attested stamp.

## The baseline, re-run before any work — the Orchestrator's figure is EXACT

| command | result |
|---|---|
| `npm test` | **734 / 734 on 26 files** |
| `npm run lint` (`biome check .`) | exit **0** — 46 files, 0 errors, **2 pre-existing infos** |
| `npm run typecheck` (`tsc --noEmit`) | exit **0** |
| `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** skipped |

**734/734 on 26 files, lint/typecheck 0, skip 0 — confirmed, not inherited.** Every red below is
attributable to a mutant I applied, and every mutant was applied **out of tree**.

## `main` MOVED UNDER THIS BRANCH DURING THE PASS — `ABC-027` merged

This is the one fact the brief could not have carried and it changes the gate's scope.

- Branch `HEAD` is `e0c08b6`; `git merge-base HEAD main` is `c572efa`.
- **`main` is now `ca0b448` and is EIGHT commits ahead of the merge base.** The head commit is
  *"docs(board): grug merge ABC-027, and the integrity event was grug own defect"*, and the two
  production commits in that range are `4f48a84` *"grug make in-place writer clear each row as grug
  write it"* and `bc9a09f` *"grug move erase to column 0, grug stop eating the h-file"*.
- So **`ABC-027` has landed**, `src/frame.ts` and `src/frame.test.ts` both moved on `main`, and the
  tree I gated is **not** the tree that will merge.

**I did not rebase** — sequencing the rebase is the Orchestrator's and I never touch a protected
branch. I re-gated the **prospective merge** instead, read-only.

## The prospective merge, measured rather than assumed

`git merge-tree --write-tree main HEAD` (no ref, index or working-tree write), tree
`c2fdf821c9bfd01c21225fab0c18337f511f07e2`, extracted with `git archive` into the scratchpad:

| | result |
|---|---|
| `src/frame.test.ts` | **auto-merges CLEAN** — the ticket's disjoint-line-range claim HOLDS, verified |
| `plans/traceability.md` | **CONFLICT (content)** — both sides appended rows. Docs only, trivial, but it IS a conflict and the rebase hop must expect it |
| `npx tsc --noEmit` on the merged tree | exit **0** |
| `npx vitest run` on the merged tree | **740 / 740 on 26 files** (734 + `ABC-027`'s 6) |

**`ABC-017` is green against what it will actually merge into.** That is the single most useful
number this hop produced and it did not exist before the hop.

## Coverage — reported, not enforced

`.grugops/factory.config.json` is `mode: "lean"`, so `quality.coverage_threshold: 0.8` is not an
enterprise gate here. Measured anyway, in the scratch harness so no `coverage/` artifact was written
into the worktree (`npx vitest run --coverage --coverage.reporter=text`):

| file | stmts | branch | funcs | lines |
|---|---|---|---|---|
| `src/history-pane.ts` | **100** | **100** | **100** | **100** |
| all files | 95.87 | 99.21 | 97.36 | 95.87 |

**100% coverage on the pane, and nine wrong builds survived it.** Recorded in that order on
purpose: coverage is not the measure, and this ticket is the demonstration.

## E2E — NOT written, and the reason is the config, not laziness

`quality.ui_e2e` is `ui-or-critical-path`. There is **no runnable UI surface until `EPIC-006`** —
`AGENTS.md` carries `Dev / run` and `E2E` as `UNKNOWN - verify` for exactly this reason, and there
is no CLI entry point. **No E2E was invented to fill the slot.** The outer acceptance loop for this
ticket is `src/history-pane.test.ts` + `src/history-pane.nfr.test.ts` + `A13` in
`src/frame.test.ts`, and that is the honest statement of it.

## The harness

Out of tree, in the session scratchpad: a copy of `src/` with `node_modules` symlinked, a pristine
copy beside it, and a patch-run-revert driver over `[file, find, replace]` edits with a
**uniqueness check on every anchor** — an edit whose anchor does not occur exactly once is reported
`SKIPPED-ANCHOR` rather than silently scoring a survivor. Verdicts are `vitest --reporter=json`'s
per test, never a reading of the diff. **No file was added to the repo**, `N8-LANE`'s declared file
count of two is unmoved, and `src/` in the worktree is byte-identical to `HEAD`.

## What this role did NOT touch

`src/frame.ts`, the screen model, `src/status-panel.*`, `src/turn-loop.*`, `plans/board.md`,
`plans/nfr-catalog.md`, `memory-bank/50-decisions/`. **No test was weakened or deleted** — the two
suite-variant experiments below were run out of tree and reverted; the worktree suite is unchanged.
`ADR-0009` and `ADR-0010` were **not** re-opened. **Zero production lines and zero test lines** —
this gate reports, it does not repair.
