---
id: 20260817T214000Z-orchestrator-decision-two-p0-tickets-pulled-and-why-these-two-of-forty-1a9c3e57
kind: decision
by: orchestrator
at: 2026-08-17T21:40:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - ABC-077
  - ABC-031
  - ABC-076
  - plans/board.md
supersedes:
---

# Two `P0` tickets pulled, and why these two out of ~40 in `Backlog`

## The state that made this a pull, not a decision

**Every active column was empty** — `Ready` 0/8, `Ready for Dev` 0/6, `In Development` 0/3,
`In Review` 0/3, `Ready for UAT` 0/4, `In UAT` 0/4. The queue's `pending/` and `claimed/` were both
empty. No WIP limit was near, no started ticket outranked a new one, and nothing was blocked.
**With `ABC-031` and `ABC-076` closed yesterday there was no work in flight at all.**

## Selection

`ABC-031` and `ABC-076` merging on 2026-08-17 unblocked exactly the next link of **two independent
critical paths**:

| | unblocked by | DoR | why it is the head of its path |
|---|---|---|---|
| `ABC-032` `parseSan` | `ABC-031` (neighbourhood) — its own § Dependencies said **None blocking** already | **10/10** | `ABC-033`, `ABC-034`, `ABC-035`, `ABC-036` all depend on it; `EPIC-003` is `P0` and half-built |
| `ABC-077` negamax | `ABC-076` — a **hard** dependency, now merged | 8/10 → **9/10** | the epic's own stated critical path is `ABC-076`→`ABC-077`→`ABC-078`; eight `EPIC-004` tickets sit behind it |

**They are independent of each other** — different epics, different modules (`src/san.ts` vs a new
search module), no shared file, and neither appears in the other's dependency list. That is what
makes two-at-once legitimate rather than merely permitted.

`ABC-104` (XS, P3) was also unblocked by `ABC-031` and was **NOT** pulled: `P3` against two `P0`s,
and its own page defers to an `ADR-0004` question.

## Width 2, not 3 — and the reason is a recorded hazard, not caution

`queue.wip_limit` is 3 and `In Development` allows 3. **I scheduled 2.** A third concurrent dev hop
buys nothing while these two hold the only two unblocked critical paths, and every remaining `P0`
in `Backlog` is downstream of one of them.

**Both engineers run in ISOLATED GIT WORKTREES.** `G5` — one shared working tree over a single git
index — **has already bitten four hops in this project**. Worktree isolation removes the shared
index rather than managing around it. **Neither engineer merges**: each delivers a branch, I re-run
the gate and hold the merge, per `AGENTS.md` § Branching model.

**A correction I am filing against myself, in this same note.** I first wrote that this was the
first parallel worktree use here. **That is false and I checked it only after writing it.**
`git worktree list` shows **four** pre-existing scratchpad worktrees from earlier hops —
`wt-abc065-guard`, `wt-abc065-qe`, `wt-abc066-qe`, `wt-secnfr` — so the technique has precedent and
this hop inherits it rather than introducing it. **What IS new here is the pairing: two SOFTWARE
ENGINEERS writing production code concurrently.** The precedent worktrees carried a Scribe, two QE
hops and a Security/NFR hop — reviewers and test authors, not two pens on `src/`. The distinction
is the part worth carrying forward, and the wrong version of it nearly went into git.

## What must still happen before either reaches `Done`

**A `qe-e2e` hop each, and it is not optional.** The 2026-08-17 standing directive: every ticket
gets QE's recorded verdict before leaving `In Review`. Both tickets carry **production lines**, so
the zero-production-lines UAT waiver will **not** be available to either — and neither is
exercisable by a human, since `npm run chess` still only prints a board. **That is the same wall
`ABC-031` and `ABC-076` hit yesterday, and it will be hit again at the close of these two.** The
alpha/beta UAT phasing question is now due for a third time; it is the owner's and I have not
pre-empted it.

## Rule 1's control, fed honestly

`AGENTS.md` § Process rules 1 wants gaps recorded at the `Ready for Dev` exit to **RISE** while gaps
found at QE fall. **This exit recorded 5** — 1 on `ABC-032`, 4 on `ABC-077`. The asymmetry is
itself the signal and is not smoothed: `ABC-032` fences by `git diff -U0` and test-file **identity**,
so five merges into its neighbourhood cost it nothing, while `ABC-077` was cut one day ago and
already carries a **stale `OPEN` dependency** its own DoR is scored against. **Fencing by identity
rather than by line number is the difference**, and it is the transferable finding.
