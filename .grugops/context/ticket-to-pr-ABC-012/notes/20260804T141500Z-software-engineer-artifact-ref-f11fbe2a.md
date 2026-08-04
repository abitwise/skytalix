---
id: 20260804T141500Z-software-engineer-artifact-ref-f11fbe2a
kind: artifact-ref
by: software-engineer
at: 2026-08-04T14:15:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - EPIC-002
  - src/history.ts
  - src/history.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-012-game-history-module.md
  - memory-bank/30-architecture.md
  - grugops/ticket-to-pr-ABC-012
supersedes: 
---

# ABC-012 — what was produced, where it is, and what was NOT produced

## Branch and commits

Branch **`grugops/ticket-to-pr-ABC-012`**, off merged `main` `39e260d`.

| Commit | Contents |
|---|---|
| `3a44b3f` | the Orchestrator's pull (board / trace / context), already present when this subtask was claimed |
| `47cad31` | `feat(history)` — `src/history.ts` and `src/history.test.ts`, the whole production change |
| this commit | `docs(board)` — board, ticket, trace, architecture, the four context notes, the queue record |

**NO PULL REQUEST EXISTS AND NONE WAS INVENTED — this repository has no git remote**
(`git remote -v` is empty), so there is nowhere to push and nothing to open a PR against. The
commits sit on the local branch. `autonomy=pr` is honored in the only way this substrate allows:
the work is on a working branch, it is committed, and **a human holds merge and deploy**.

## Files produced

| File | Change |
|---|---|
| `src/history.ts` | **NEW** — 154 lines, 51 executable. Six exported functions and the `GameHistory` interface |
| `src/history.test.ts` | **NEW** — 213 lines, 7 tests, one per acceptance criterion |

## Files edited

| File | Change |
|---|---|
| `plans/board.md` | `In Development` 1/3 → 0/3, `In Review` 0/3 → 1/3; header, both column comments |
| `plans/tickets/ABC-012-game-history-module.md` | front matter `in-development` → `in-review`; an appended implementation record. **No acceptance criterion, `## Out of scope` line, NFR bar or test note edited** |
| `plans/traceability.md` | the `ABC-012` row updated in place — exactly the `Code`, `Tests` and `Status` cells. No row appended |
| `memory-bank/30-architecture.md` | nine → ten modules, the `history.ts` row, the DAG bullet (depth 6 → 7), and the "who owns game history is an open decision" bullet this ticket falsifies |
| `.grugops/queue/…/ticket-to-pr-ABC-012-dev*` | moved `pending` → `claimed` → `done` **by hand**, with a `claim.md` registry record |

## Files deliberately NOT edited

- **`plans/nfr-catalog.md`** — its own format comment gives its rows to Architect/Design and
  Security/NFR, and Security/NFR re-gates these bars. The measured figures live in the notes, the
  ticket, the board and the trace's `Status` cell instead. Same division the `ABC-011` Engineer kept.
- **The trace row's `NFRs` and `UAT` cells** — same reason; `UAT` has nothing to say until
  `EPIC-006` gives a human something to exercise.
- **Every file under `src/` except the two new ones** — verified md5-identical to `39e260d`.
- **The ticket's acceptance prose** — including the one criterion that cannot be satisfied as
  worded, which is recorded for BA/PM in the decision note rather than rewritten here.

## Commands run, and what they returned

| Command | Result |
|---|---|
| `npm test` | **221 passed / 10 files / 0 failed** (baseline 214 / 9) |
| `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| `npm run lint` | **exit 0** (2 pre-existing biome config-schema infos) |
| `npm run typecheck` | **exit 0** |
| `npm run build` | **exit 0** |
| `npx vitest run --coverage --coverage.include='src/history.ts'` | **100 / 100 / 100 / 100** |
| `git diff --numstat 39e260d -- src/` | **empty** — no tracked file under `src/` differs from merged `main` |

## Out-of-repo harnesses (not artifacts of this repository)

The mutation runner, the module-graph rebuilder and the NFR benchmark all ran from the session
scratchpad, read-only against `src/`, and wrote nothing into the repository. They are not committed
and are not repo artifacts; their results are in the observation note with their protocol and their
machine.

## Migration / docs

**No migration.** No dependency was added or changed (`package.json` and the lockfile are
untouched), no runtime dependency exists in this project at all, and no configuration moved. The
only doc surface affected is `memory-bank/30-architecture.md`, edited above. `AGENTS.md` needs no
new command slot: this module has no runnable entry point and is exercised by `npm test` like every
other module.

## Remaining work, by owner

- **QE/E2E** — owns the `In Review` exit. Four adversarial leads are handed over by name in the
  claim note, each with the reason it is a lead and not a defect.
- **Security/NFR** — owns the five NFR bars and `plans/nfr-catalog.md`'s rows. The bars are measured
  and MET here on one machine; re-gating them is that column's.
- **BA/PM** — owns acceptance criterion 2's stale wording (`result: "draw"` for a draw that
  `ABC-020` ruled claimable). The ticket was handed over unamended.
- **`ABC-019`** — the turn loop, which blocks on this module and is now unblocked.
