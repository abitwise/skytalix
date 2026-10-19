---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-19T15:30:00Z
sealed: false
refs: [ABC-173, ABC-170, ABC-167, ADR-0008]
---

# Owner word, 2026-10-19: ABC-173 coverage red — lighten the rows, keep the cap

## What happened
ABC-173's SE hop stopped at A7, at tip `affee860`. Both coverage lanes failed on their first capped run:
- 3 tests timed out at the 5 s limit: 2 in `src/engine.test.ts` ABC-170 A3, and 1 in `src/uci-session.test.ts` ABC-167 A5.
- There was no OOM and no guard refusal.
- Both lanes passed 2 out of 2 times on re-run.
- During the first runs, another hop's mutation run was loading the host.

## The question and the owner's answer
The owner was asked: *"How do we proceed?"*

His answer, verbatim:

> **"Lighten the rows, keep cap (Recommended)"**

## What the answer means
- **No limit moves.** The cap and both heap rows stay as accepted in `…9f3b6e20`. The per-test timeout is not raised.
- **The heavy rows that timed out move to coarser virtual-clock steps, in ABC-173's diff.** The same goes for any row with the same profile. This is a test-only change.
  - Each re-stepped row must still reject the wrong builds it targets.
  - ABC-167's A5 steps were ruled by BA/PM (`…5c7a1e30`). A row whose discrimination would fail at a coarser step is reported, not changed.
- **After that, the SE finishes ABC-173's owed checks:**
  - the armed reds;
  - the live-worker census;
  - the `heapUsed` peaks;
  - the reporter plants;
  - every lane re-run as spelled.
