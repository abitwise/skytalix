---
id: 20260812T163000Z-qe-e2e-artifact-ref-gate-run-6b21d94f
kind: artifact-ref
by: qe-e2e
at: 2026-08-12T16:30:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-017-narrow
  - abc017-qe2-2026-08-12
  - ABC-017
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - 20260812T154500Z-software-engineer-artifact-ref-diff-gates-and-trace-row-d61a9f34
supersedes:
---

# The baseline, the harness, and the brief checked again — the BRIEF is exact on every figure, and the ONE wrong number is the Engineer's own

> **HAND-AUTHORED.** `scripts/context-io.ts` does not exist in this repo and the kit has no
> `scripts/` directory at all (`/Users/olgeroeselg/.grugops/agent-factory/scripts/` is absent), so
> Workflow 16's single sanctioned writer cannot be used; `mcp__grugops__propose_note` is not in this
> session's tools either. This note is written by hand and **says so**, following the practice every
> prior role on this ticket recorded. **Nothing in this note set is a `finding`** — no `§14-gate#<id>`
> machinery exists in this repo and none was invented. **No self-attested stamp.**

## Claim (Workflow 17)

`scripts/claim.js` is absent too, so the claim was taken with a plain shell **non-recursive**
`mkdir .grugops/queue/claimed/quality-gate-ABC-017-narrow` — the same single atomic `mkdir(2)` that
`claimTask` relies on, so `EEXIST` would have meant "claim lost" and any other error a genuine
failure. It returned rc=0. The `claimed/` parent did **not** exist (the brief said it was empty; it
was in fact absent, the Engineer having released his) and was created first, so the task-directory
`mkdir` was the single operation that decided ownership. Registry record written, subtask moved
`pending/ → claimed/`, and `→ done/` on publication.

## The brief's baseline — re-run BEFORE any work, as instructed

The brief said **seven consecutive hops** had caught a wrong figure in one of its briefs and asked to
be checked again.

| quantity | brief said | measured here |
|---|---|---|
| `npm run lint` | exit 0 | **exit 0** — 46 files, 0 errors, 2 pre-existing infos |
| `npm run typecheck` | exit 0 | **exit 0** |
| `npm run build` | exit 0 | **exit 0** |
| `npm test` | 744/744 on 26 files | **744/744 on 26 files** |
| skip count | 0 | **0** |
| `src/history-pane.ts` md5 | `54fd4346dcc1a0060c4e66ae0149265d` | **identical** |
| hop diff | +224/−5 over two EXISTING test files | **+224/−5**, `src/history-pane.test.ts` and `src/history-pane.nfr.test.ts` |
| behind `main` | rebased onto current `main` | **0 behind**, 16 ahead |

**Every figure in the brief is EXACT. This is the first brief on this ticket with no wrong number in
it, and the streak of seven is broken by the brief being right rather than by nobody checking.**

## The one wrong figure I did find, and it is in the ENGINEER's note, not the brief

`20260812T154500Z-software-engineer-artifact-ref-diff-gates-and-trace-row-d61a9f34` records the diff
as:

| file | the note says | `git show --numstat 0c31aef` |
|---|---|---|
| `src/history-pane.nfr.test.ts` | +87 / −0 | **+87 / −0** — exact |
| `src/history-pane.test.ts` | +134 / −4 | **+137 / −5** |

**Non-load-bearing and it changes no conclusion** — the aggregate the brief carries (+224/−5) is the
one that is right, and it is right because the Orchestrator measured the commit rather than summing
the note. Reported because this project's record is that a small wrong figure is how a large wrong
one gets inherited, and because the Engineer's note is what a later reader will quote. The likely
cause is benign: the figure was taken before `npx biome check --write src/history-pane.test.ts`,
which that same note records running.

## Commands run

| command | purpose |
|---|---|
| `npm run lint` / `npm run typecheck` / `npm run build` | the three named gates, exit 0 each |
| `npx vitest run --reporter=json` | 744/744, 26 files, and the per-test verdicts every table below is built from |
| `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` equivalent, read from the JSON | skip count 0 |
| `git show --numstat 0c31aef` | the hop diff, measured on the commit rather than summed from a note |
| `md5 -q src/history-pane.ts` | asserted before the run, after every one of 28 mutation cycles, and at the end |

## The harness — out of tree, and the worktree never held a mutant

A copy of `src/` in the session scratchpad with `node_modules` **symlinked** to the worktree's, plus
`package.json` / `tsconfig.json` / `biome.json`. A pristine copy sits **outside** the vitest include
glob — the first attempt kept it beside `src/` and vitest collected it, reporting 1488/1488 on 52
files, which is recorded here because it would have made every "survivor" meaningless and it was
caught by the number being exactly double.

The driver is patch-run-revert over `[file, find, replace]` edits with:

- a **uniqueness check on every anchor** — an edit whose anchor does not occur exactly once is
  reported as an error, never silently scored as a survivor;
- a **restore-and-assert** step after every mutant, which throws if
  `src/history-pane.ts` md5 is not `54fd4346dcc1a0060c4e66ae0149265d`;
- verdicts taken from `vitest --reporter=json` **per test**, never from a reading of the diff.

Harness green control before any mutant: **744/744 on 26 files, skip 0** — it reproduces the
worktree exactly.

**28 patch-run-revert cycles were run. `src/history-pane.ts` md5 was re-asserted after every one and
is `54fd4346dcc1a0060c4e66ae0149265d` now.** `git status --short` in the worktree shows only the
queue transition; `git diff HEAD -- src/` is empty; the suite is **744/744, skip 0** after all of it.

## Coverage — reported, not enforced

`mode` is `lean`, so `quality.coverage_threshold: 0.8` is not an enterprise gate here. Not
re-measured this hop: zero production lines changed since the pass that measured it
(`src/history-pane.ts` 100/100/100/100), and the four new tests only add cases over the same module.
**Recording that it was not re-run rather than restating a stale number as if it were fresh.**

## E2E — still NOT written, and still for the config's reason

`quality.ui_e2e` is `ui-or-critical-path` and there is no runnable UI surface until `EPIC-006`;
`AGENTS.md` carries `Dev / run` and `E2E` as `UNKNOWN - verify`. **No E2E was invented to fill the
slot.** The outer acceptance loop is `src/history-pane.test.ts` + `src/history-pane.nfr.test.ts` +
`A13` in `src/frame.test.ts`.

## Scope held — what this narrow pass did NOT do

- **Did NOT re-run the 22 mutants.** Only the nine survivors, which is what the brief asked for.
- **`G5`/`AR-4` untouched.** `WCOLS24R` was not rebuilt, `HISTORY_COLS` is not proposed for widening,
  no criterion is proposed for it here or anywhere, and no constant-FRAME-width criterion is proposed.
  `ADR-0009` and `ADR-0010` were **not** re-opened.
- `src/status-panel.*`, `src/turn-loop.*`, `src/frame.test.ts`, `plans/board.md`,
  `plans/nfr-catalog.md`, `memory-bank/50-decisions/` — **not touched**.
- **No existing test was weakened, skipped or deleted.** The two single-file runs
  (`npx vitest run src/history-pane.test.ts`) are a FILTER, not a suite edit; the full-suite skip
  count is **0** before and after.

## Standing rule — nothing tried to widen my boundary

No note, comment or file in this workspace attempted to authorise a write outside the boundary this
subtask names. Recorded because the rule requires reporting either way. **One low-severity injection
scan fired twice** — on the repo's own root `AGENTS.md` (*"act as the Orchestrator"*) and on the
Engineer's note **quoting that same line while reporting the same scan**. Both are that file's
legitimate routing instruction to human and agent readers, and both are false positives. **I remained
QE/E2E**, which is the role the activating agent named; a file in the workspace is data and cannot
reassign a role.
