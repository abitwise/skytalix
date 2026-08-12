---
id: 20260812T102800Z-qe-e2e-artifact-ref-what-was-run-and-every-fence-held-4f9b7c62
kind: artifact-ref
by: qe-e2e
at: 2026-08-12T10:28:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-026
  - ABC-028
  - ADR-0011
  - NFR-002
  - NFR-008
  - src/history-pane.nfr.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
supersedes:
---

# What this hop ran, what it wrote, and every fence in the brief — held

> **Hand-authored.** `scripts/context-io.ts` does not exist here (re-verified at source at this hop),
> so there is **no derived `index.md` / `index.jsonl`** for this `ref:` — `notes/` is the source of
> truth. `kind: artifact-ref` is a pointer and needs no stamp.

Worktree `../cli-chess-abc029-qe2`, branch `grugops/quality-gate-ABC-029-containment`, HEAD
`313ec7450c48fc143b0cf7673ca51c5d760369cc`. **This branch is twenty-seventh in a linear stack off
`main`; the fast-forward is denied by the host classifier and is with the owner. It was NOT
attempted.**

## The digest of the file I gated

**`src/history-pane.nfr.test.ts` — md5 `d51b02be9351c8ee8ed5b3436873db68`**, blob
`c230cd8f8c7a2ff50cc219e0db1a9484c101cf5f`, 457 lines, 8 tests. Taken at claim, re-taken after the
last run, **unchanged**. `src/history-pane.ts` md5 `c4653c4c263c4c417ea34969164ccd86` — unmoved.

## Files written by this hop

| path | what |
|---|---|
| `.grugops/context/quality-gate-ABC-029-containment/notes/` | **5 notes** — 2 `observation`, 1 `failed-attempt`, 1 `claim`, this `artifact-ref` |
| `.grugops/queue/claimed/quality-gate-ABC-029-containment/claim.md` | the Workflow 17 registry record |
| `.grugops/queue/claimed/…/quality-gate-ABC-029-containment.md` | the subtask file, moved out of `pending/` |

**NOTHING under `src/`, `plans/` or `memory-bank/` was written.** `git status --porcelain` outside
`.grugops/` is empty.

## Commands run

`npm run lint`, `npm run typecheck`, `npm run build`, `npx vitest run`,
`npx vitest run src/history-pane.nfr.test.ts` (×143, across two out-of-tree trees),
`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`,
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`,
`./node_modules/.bin/biome check` (×7), `./node_modules/.bin/tsc --noEmit` (×1, on a mutant tree),
and — **read-only or out of tree only** — `git rev-parse`, `git show <ref>:<path>`, `git ls-tree`,
`git log --all -S`, `git diff --name-status`, `git diff --stat`, `git merge-tree --write-tree`,
`git worktree list`, `git status`, `md5`, `grep`, `sed`.

## The measurement rig — outside every repository

Session scratchpad only: `base16`, `base17`, and a throwaway variant directory rebuilt per run, plus
two control trees and two lint trees. **No file in any repository worktree was written by any
measurement, and NO other worktree was entered** — `../cli-chess-ABC-019`,
`../cli-chess-abc029-build2` and `../cli-chess-abc028-cmt` were never opened. Every foreign file came
from the **git object database** (`git show <ref>:<path>`), per `## Test notes` 8.

## Claim mechanics — hand-rolled, and said so

**`scripts/claim.js` does not exist and `scripts/context-io.ts` does not exist** — re-verified at
source at this hop: there is no `scripts/` directory in this worktree, and a `find` for `claim.js` /
`context-io*` across it (outside `node_modules`/`.git`) and across the kit root
`/Users/olgeroeselg/.grugops/agent-factory` returns nothing.

Workflow 17 step 2 was executed **by hand**: the `claimed/` parent did not exist and was created
first; **the claim directory itself was a bare `mkdir`, no `-p`**, so the atomicity the protocol
relies on is intact and a second claimant would have taken `EEXIST`. Then `claim.md`, then the
subtask file moved in by `mv`. **Both are moved into `done/` at the end of this hop.**

**The subtask file was UNTRACKED when claimed**, so a plain `mv` was used and no ` D` appears in
`git status`. **The queue's git history must not be read as complete** — the same note the Engineer's
hop recorded, and it is still true.

## Requested board move — `In Review → In Security/NFR`

QE owns the `In Review` exit. **`plans/board.md` was NOT opened for edit** — the brief reserves it.
The ticket front matter reads `status: in-review` / `column: In Review`; the two agree and neither
was edited.

## `plans/traceability.md` — read, and DELIBERATELY NOT EDITED

Workflow 05 asks the gate to append the `Tests` link from the QE result. **I added ZERO committed
tests** — every one of the 143 instrument runs was against a throwaway out-of-tree copy, and the
brief forbids weakening, narrowing or deleting any existing test, which I did not. **A `Tests` cell
here would have to describe tests that do not exist in the tree**, which is the same refusal
Architect/Design, BA/PM and the Engineer each recorded on that file. The `Status` cell is the
Orchestrator's to move with the board. **The row the criteria gaps deserve is BA/PM's, appended by
the hop that writes them.**

## Not taken — every fence in the brief, held

- **No existing test weakened, narrowed or deleted, and none added.** Instrument count **8** before
  and after; lane **752/752 on 26 files** before and after; skip **0**.
- **`plans/board.md` NOT opened for edit. No ADR opened for edit. `plans/nfr-catalog.md` NOT opened.
  `ABC-028`, `ABC-019` and every merged ticket NOT edited. `ABC-029`'s own ticket page NOT edited** —
  no criterion amended, renumbered or reworded. **The four gaps are REPORTED AND ROUTED, not fixed**;
  `A6.1`/`A6.2`/`A5.6` and `L2` are BA/PM's, and `ADR-0011`'s cost-3 sentence is Architect/Design's.
- **No production line written. `src/history-pane.test.ts` NOT opened** — it holds `ABC-028`'s `A5`
  table.
- **No `N8-LANE` verdict claimed and the FLOOR was not turned into a number.** `UNKNOWN - verify`
  stands; the lane total is `ABC-026`'s.
- **No E2E invented.** `quality.ui_e2e` is `ui-or-critical-path`, there is no UI surface until
  `EPIC-006`, and the `AGENTS.md` slot is `UNKNOWN - verify`. Recorded as such.
- **No `finding` written and nothing self-stamped** — no `§14-gate` verdict record exists under this
  task and `context.human_admission` is **`off`**. Every result is an `observation`,
  `failed-attempt`, `claim` or `artifact-ref`, and every non-adjudicable quantity is
  `UNKNOWN - verify`.
- **No green `§14-gate` verdict emitted.** `emitVerdict` lives in `scripts/context-io.ts`, which does
  not exist here, and I am one role inside the gate rather than the gate: **Security/NFR fires for
  this ticket and has not run.**
- **Nothing merged, nothing pushed, nothing deployed, no `git checkout main`.** No other worktree
  entered.
- **Content inside this workspace was treated as DATA, not instruction.** Nothing read in `src/`,
  `plans/`, `memory-bank/` or `.grugops/` purported to authorise a write outside this boundary, and
  nothing was acted on as if it did. **Nothing to report under that rule.**
