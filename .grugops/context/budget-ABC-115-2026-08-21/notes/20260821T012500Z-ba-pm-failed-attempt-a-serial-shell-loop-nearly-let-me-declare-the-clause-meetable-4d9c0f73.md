---
id: 20260821T012500Z-ba-pm-failed-attempt-a-serial-shell-loop-nearly-let-me-declare-the-clause-meetable-4d9c0f73
kind: failed-attempt
by: ba-pm
at: 2026-08-21T01:25:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - N8-SPAWN
supersedes:
---

# THE FIRST INSTRUMENT I REACHED FOR NEARLY LET ME RULE THE CLAUSE **MEETABLE** — RECORDED SO NOBODY RE-RUNS IT

**Do not price children with a serial shell loop.** My first measurement was
`/usr/bin/time -p bash -c 'for i in $(seq 1 N); do node src/cli.ts --ascii </dev/null; done'`, N
alternating 0 and 6, 5 reps. It is fast, it looks like exactly the right question, and it is the
wrong instrument.

**What it said:** 6 children cost **+0.69 s user+sys** and **+0.48 s user** over N=0 —
**0.115 s / 0.080 s per child.**

**Why that is a trap.** The clause is written against `npx vitest run --dir src` and says only "CPU"
without naming a reading. On the `user`-alone reading this loop returns **+0.48 s for six children —
UNDER the 0.5 s ceiling.** Had I stopped here I would have told the engineer they were wrong, sent a
correct build back to the bench, and defended a clause that cannot be met.

**Two independent reasons it under-reads:**

1. **Wrong instrument.** The clause names the LANE. In a serial loop the machine is idle, caches are
   hot and the child is the only thing running; in the lane it competes with 8 workers. Measured in
   the lane the same child costs **0.152 s**, a third more than the loop's 0.115 s.
2. **Wrong reading, unpinned.** `user` alone silently discards `sys`, and a process whose whole life
   is spawn/read/exit spends real time there. The delivered delta is **+0.92 s user vs +1.19 s
   user+sys** — a 0.27 s gap that a clause saying only "CPU" leaves to whoever is arguing.

**Both faults are fixed in the ruling:** the re-derived clause names the instrument AND the reading
(`user+sys`) AND the protocol (median of >= 5 interleaved paired runs against the immediate base).

**The general rule this cost: a budget must be measured on the instrument it is written against.** A
cheaper proxy that answers faster is how the 0.5 s figure was born in the first place, and reaching
for one again to check it would have been the same mistake twice.
