---
id: 20260820T002000Z-ba-pm-claim-gate-numbers-unchanged-and-zero-src-lines-b4c5d6e7
kind: claim
by: ba-pm
at: 2026-08-20T00:20:00Z
verified_by:
confidence: high
refs:
  - ABC-043
supersedes:
---

# Gate: the record is UNCHANGED — **1189 tests / 39 files / skip 0**, and this hop touched **zero** lines under `src/`

`kind: claim`, not `finding`: no `finding` is admissible on this install (`AGENTS.md`), so this is a
soft assertion of what I ran, not a stamped verdict.

## Run

In an **isolated agent worktree** off `main` @ `8bb7669` — deliberately, because the repo root's
`.claude/worktrees/` has cost three bad measurements. `npm install` was run in the worktree first
(124 packages); it creates no tracked file.

| step | command | result |
|---|---|---|
| full suite | `npm test` | **exit 0 — 1189 passed / 39 files**, 2.59 s. Identical to the QE record and to `ADR-0015`'s |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| `src/` diff | this hop's changes | **none.** `git status` carries `plans/tickets/ABC-043-the-live-session.md`, `.grugops/queue/**` and `.grugops/context/refine-abc043-a3-name-2026-08-19/notes/**` only |

**These numbers describe the tree as it stands, including the rig this hop refuses.** They are the
unchanged baseline against which the engineer's repair is measured — **not** evidence that the repair
has happened. The count will move when the `parserBug` child is replaced, and that is expected.

## What I did NOT do

No `src/` change. No board column moved. No merge, no deploy. No ticket cut, nothing re-scored, and
`ADR-0015`, `ADR-0011`, `ADR-0013` and `plans/nfr-catalog.md` are byte-unchanged — verifiable from
this branch's diff.
