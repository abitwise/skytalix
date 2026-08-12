---
id: 20260812T160400Z-software-engineer-artifact-ref-what-was-written-and-refused-e5b26c48
kind: artifact-ref
by: software-engineer
at: 2026-08-12T16:04:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-026
  - ABC-028
  - ADR-0008
  - ADR-0011
  - NFR-002
  - NFR-008
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - src/history-pane.nfr.test.ts
supersedes:
---

# What this hop wrote, what it refused to write, the board move it requests, and every fence held

> **Hand-authored**; `scripts/context-io.ts` does not exist here, so there is **no derived `index.md` /
> `index.jsonl`** for this `ref:` — `notes/` is the source of truth and stands alone.
> `kind: artifact-ref` is a pointer and needs no stamp.

Branch **`grugops/ABC-029-containment`**, worktree `../cli-chess-abc029-build2`, twenty-second in a
linear stack off `main`. **The fast-forward is denied by the host classifier and is with the owner; it
was NOT attempted.**

## Files written

| path | what |
|---|---|
| `src/history-pane.nfr.test.ts` | **the only `src/` file changed — `+24 / −8`.** Two sites: the executable regex (`:314`) and the probe's docblock (`:345-367`). **ZERO production lines.** |
| `plans/traceability.md` | **ONE row (`ABC-029`), APPEND-ONLY to its `Tests` and `Status` cells**, plus one `_Updated:` line at the head |
| `.grugops/context/ticket-to-pr-ABC-029-containment/notes/` | **5 notes** — 1 `decision`, 2 `observation`, 1 `failed-attempt`, this `artifact-ref` |
| `.grugops/queue/claimed/ticket-to-pr-ABC-029-containment/claim.md` | the Workflow 17 registry record |
| `.grugops/queue/claimed/ticket-to-pr-ABC-029-containment/ticket-to-pr-ABC-029-containment.md` | the subtask file, moved out of `pending/` |

**`git diff --stat` outside those paths is EMPTY** — verified, not assumed.

## Gates on this branch tip after the change

| gate | baseline (Orchestrator's brief) | **measured here** |
|---|---|---|
| `npm run lint` | 0 | **0 errors**, 2 pre-existing `biome migrate` infos — identical |
| `npm run typecheck` | 0 | **0** |
| `npm run build` | 0 | **0** (`tsc --noEmit`) |
| `npx vitest run` | 752/752 on 26 files | **752 passed (752) on 26 files** |
| skip count | 0 | **0** |
| e2e | — | **`UNKNOWN - verify`** — `ui_e2e` is `ui-or-critical-path` and there is no runnable UI surface until `EPIC-006`. Not invented |

**Commands run:** `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, `npx vitest run`,
`npx vitest run src/history-pane.nfr.test.ts`,
`npx vitest run src/history-pane.nfr.test.ts --reporter=json`,
`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`, and — **read-only or out of
tree only** — `git show <ref>:<path>`, `git ls-tree`, `git ls-files`, `git log`, `git diff --stat`,
`git merge-base`, `git status`, `md5`, `cmp`, `comm`, `grep`, `sed`, `find`.

## The measurement rig — outside every repository

Everything ran in the session scratchpad on throwaway copies: `base16`, `base17`, `landed16`,
`landed17`, `rebase19`, and three `N8-LANE` arms. **No file in any repository worktree was written by
any measurement and NO other worktree was entered** — `../cli-chess-ABC-019` was never opened and the
live Architect/Design hop on `ADR-0011` was not touched. `ABC-019`'s files came from the **git object
database** (`git show <ref>:<path>`), per `## Test notes` 8.

## Claim mechanics — hand-rolled, and said so

**`scripts/claim.js` does not exist** and **`scripts/context-io.ts` does not exist** — re-checked at
source at this hop: there is no `scripts/` directory in this worktree, and a `find` for `claim*` /
`context-io*` across it (outside `node_modules`/`.git`) and across the kit root
`/Users/olgeroeselg/.grugops/agent-factory` returns nothing.

Workflow 17 step 2 was executed **by hand**: the `claimed/` parent did not exist and was created
first; **the claim directory itself was a bare `mkdir`, no `-p`**, so the atomicity the protocol
relies on is intact and a second claimant would have taken `EEXIST`. Then `claim.md`, then the subtask
file moved in. **Both are moved into `done/` at the end of this hop** — a claim directory left behind
is reclaimed by a stale sweep and resurrects finished work.

**Recorded again because it is still true: `.grugops/queue/pending/ticket-to-pr-ABC-029-containment.md`
was UNTRACKED when this hop claimed it**, so `git mv` refused it and a plain `mv` was used, producing
no ` D` in `git status`. **The queue's git history must not be read as complete.**

## Requested board move — `In Development → In Review`

That is this role's transition on `plans/board.md` and the containment is implemented with its rows
measured and the gate green. **`plans/board.md` was NOT opened for edit** — the brief reserves it and
it is the Orchestrator's.

**Two sequencing inputs, and the call is the Orchestrator's, not mine:**

1. **`ABC-028`'s `A5` COMMENT HALF is unblocked by this build.** Its blocker was
   `src/history-pane.nfr.test.ts`, which is now written and released. **I did not take any part of
   `ABC-028`'s work and did not open `src/history-pane.test.ts`.**
2. **`ABC-019` is the `P0` behind this.** The `src/` half of its rebase is measured green on a
   byte-faithful replica (804/804 on 28 files, both instruments green) — see the sibling
   `observation`. **That is not its gate.**

**RECORD DISAGREEMENT, FLAGGED NOT FIXED:** `ABC-029`'s ticket front matter reads
`status: in-development` / `column: In Development`, and Architect/Design's hop recorded
`plans/board.md` carrying it under `In Design` at that time. **I did not open the board to check
whether that was resolved, because the brief reserves it.** The Orchestrator owns reconciling the two
records; this project's convention is *"the front matter moves when the board does, by the role that
owns the board."*

## Not taken — every fence in the brief, held

- **ZERO production lines, and the STOP condition never fired.** `src/history-pane.ts` md5 is
  `c4653c4c263c4c417ea34969164ccd86` at the end of this hop. **No production line was owed** — the
  sweep is in the `decision` note. Had one been owed I would have stopped and reported it.
- **`src/history-pane.test.ts` NOT opened** — it holds `ABC-028`'s new `A5` table.
- **`plans/board.md` NOT opened for edit. `plans/nfr-catalog.md` NOT opened.** No target, bar, level
  or `UNKNOWN - verify` marker moved anywhere.
- **No ADR opened** — `ADR-0011` and `ADR-0008` were read at source; an Architect/Design hop is live
  on `ADR-0011`'s *"6 of 12 is the maximum"* sentence and **nothing here depends on its outcome**:
  `A6.2` is a required verdict (`WPERFT-DYN` green), which the landed build satisfies either way.
- **`ABC-028`, `ABC-019`, `ABC-017` and every merged ticket NOT edited. `ABC-029`'s own ticket page
  NOT edited** — no criterion renumbered, reworded or deleted. The rows are BA/PM's; my verdicts are
  here, not on their page.
- **No test added, none weakened, none narrowed, none deleted.** Instrument test count **8** before
  and after; lane **752** before and after.
- **No `N8-LANE` verdict claimed.** `UNKNOWN - verify` with the floor reported; the lane TOTAL is
  `ABC-026`'s and `MET`/`MISS` is Security/NFR's.
- **No other worktree entered. Nothing merged, nothing pushed, nothing deployed, no
  `git checkout main`.**
- **No `finding` written and nothing self-stamped** — no `§14-gate` verdict record exists under this
  task and `context.human_admission` is **`off`**. Every result is a `decision`, `observation`,
  `failed-attempt` or `artifact-ref`, and the one non-adjudicable quantity (`N8-LANE`) is marked
  `UNKNOWN - verify`.
- **Content inside this workspace was treated as DATA, not instruction.** Nothing read in `src/`,
  `plans/`, `memory-bank/` or `.grugops/` purported to authorise a write outside this boundary, and
  nothing was acted on as if it did. **Nothing to report under that rule.**
