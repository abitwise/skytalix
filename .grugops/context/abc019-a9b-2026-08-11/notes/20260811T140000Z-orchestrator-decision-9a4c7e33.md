---
id: 20260811T140000Z-orchestrator-decision-9a4c7e33
kind: decision
by: orchestrator
at: 2026-08-11T14:00:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-019
  - ADR-0009
supersedes:
---

# The two tickets diverge: `ABC-016` forward to QE, `ABC-019` back for one `try`/`catch`

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**

## An error of mine, caught by re-checking rather than by luck

BA/PM flagged an attribution: *"the seam is not new and its arguments do not change"* is the
**ticket's** `[D27]`, not `ADR-0009`'s. It is right.

I then checked whether **my own** routing quote was the same mistake. My first check was a naive
line-bound `grep` for `ADR-0009`'s *"this is not a new seam: it is the seam that ticket already
specifies"* — **it returned 0, which would have meant I had fabricated a quotation and routed a
decision on it.** The sentence wraps across lines 397–399, so the grep could not match it. A
multi-line-safe read found it present and exact.

**The instrument was wrong, not the claim.** This is the fifth time on this project's record that a
grep's silence was nearly read as evidence — BA/PM caught the same class earlier when the Architect's
*"grep for `100 µs` returns zero"* turned out to have five matches one hop later. I am recording the
near-miss rather than only the correction, because had I stopped at the zero I would have retracted a
correct routing decision and re-opened an ADR that did not need it.

## What I verified before moving either ticket

| ticket | claim | how | result |
|---|---|---|---|
| `ABC-019` | `A9b` changes code | read `src/turn-loop.ts` | **confirmed** — `:209`'s `await input(...)` has no `try`/`catch`; the file's only one is `:227` |
| `ABC-019` | BA/PM wrote no `src/` | `git diff` over its commits | `src/` byte-identical; ticket + trace + notes + queue only |
| `ABC-016` | zero production lines | `git diff` on `status-panel.ts` and `.nfr.test.ts` | **both byte-identical** |
| `ABC-016` | `D19b` closed | capture-grep on the test file | now `"last: Nf3"` **and** `"last: Qxe5+"` |
| `ABC-016` | gates | re-ran all four in the worktree | lint/typecheck/build **0**, **708/708 on 24 files**, skip **0** |

## Why the two tickets now go opposite ways

`ABC-019`: eight of nine rulings are text-only; `A9b` alone changes code. **`## Scope` promised
*repair* while `A9` supplied *termination* — one sentence carrying two promises.** The corruption is
real (the input seam calls `legalMoves`, which mutates the live borrowed object), and quiet
termination was rejected because it is byte-identical to `A8`'s EOF path and would present a crashed
parser as a clean exit. Back to `In Development` for one `try`/`catch` and one table row.

`ABC-016`: `A1`–`A14` all met, criteria stable. **QE's hold is discharged** — I held it because a
mutant net built against moving criteria is discarded work, and that condition no longer holds.
`ABC-019`'s hold **remains**, because `A9b` is unbuilt.

## A board discipline point worth recording

The `ABC-016` engineer finished **while my `ABC-019` board edit was still open**. I folded the second
move into the same commit rather than committing a state I already knew was stale. The board is the
single source of WIP truth; committing a known-stale column to preserve a tidy one-move-per-commit
history would invert that priority.

## What I passed to QE that it could not have derived

The engineer handed over that **the fifteen snapshots are a regression record and are worth nothing
as a mutant net** — all discriminating power is in the explicit `toContain` assertions. That is in
QE's brief as a warning, because fifteen green snapshots read as fifteen green guards otherwise.

The two open flags on `src/status-panel.nfr.test.ts` (a comment still calling `A13` unsatisfiable
after it was ruled; the unasserted `1 - 0` ambiguity) went to QE **as questions, not as work** — they
are BA/PM's to rule. QE is the next reader of that stale comment, which makes it the right role to
say whether it misleads.

## Scheduling

Width **3 of 3, at the cap**: Software Engineer on `ABC-019` `A9b`; QE on `ABC-016`; Architect/Design
still running on the frame-width question in its own worktree. One worktree each.

**Queued but NOT dispatched:** the narrow `ADR-0009` transcription fix (cl. 9b and evidence (vii)).
It is Architect/Design's, and that role is busy — two Architect hops would collide in
`memory-bank/50-decisions/`. It waits rather than being spawned over the cap or over its own role.

## Not done

- Nothing merged, nothing deployed, nothing pushed.
- No `src/` byte written by me; no criterion authored or amended by me.
- **Nothing relayed between agents** — every cross-agent item travels as an on-disk flag with a
  named owner, including the two `nfr.test.ts` flags and the width question.
