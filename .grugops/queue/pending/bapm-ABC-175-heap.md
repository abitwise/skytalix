---
subtask: bapm-ABC-175-heap
role: ba-pm
tickets: [ABC-175]
ref: .grugops/context/bapm-ABC-175-heap/
---

# BA/PM: ABC-175 page amendment for the heap prefix and the A0 re-take (records only)

## Problem
`secnfr-ABC-174-a0` (route V, F_hi 1.047, A0 commit `ed88329c`; done file `.grugops/queue/done/secnfr-ABC-174-a0.md`, note `.grugops/context/secnfr-ABC-174-a0/notes/…-e4b8d062.md`) found that on the ABC-175 run tree (`grugops/ABC-174` @ `f6b63c1c`, carrying ABC-173's heap guard per ADR-0008 addendum / NFR-010) the verdict command and the A1 `-t "3v4"` probe have no `NODE_OPTIONS=--max-old-space-size=…` prefix, and the guard refuses an unprefixed one-file run (exit 1, no test runs). Probable form: `caffeinate -i env LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`. Whether 180 verdict games fit in that heap is UNKNOWN — no OOM probe is in scope here; an OOM on the night goes to the owner (ABC-173 Q4).

## Do
Amend `plans/tickets/ABC-175-*.md` only:
1. § Scope 2 (`:37`) and A1's probe (`:92`): the commands carry the heap prefix. **Use the exact form the Architect hop `arch-ABC-175-heap` writes** (running in parallel; read its done file `.grugops/queue/done/arch-ABC-175-heap.md` when present). If absent when you finish, use the probable form above, mark it "pending Architect ruling", and say so.
2. A1: record the A0 re-take as done — A0 commit `ed88329c` (records-only on `f6b63c1c`), route V, F_hi 1.047; new staleness inputs (vitest.config.ts md5 `326bc5ca578a29c48102e0192b4bfe5a`, ladder.test.ts md5 `bba67b75565b4f4a2e8d231e8bcd6b2e`, node v26.11.1, vitest/4.1.11) replacing the eb216351 values; the "A0 is STALE" bullet becomes history, dated.
3. Re-score DoR. Add an OOM-on-the-night line pointing to ABC-173 Q4 (owner decides).

## Fences
That ticket page and your notes only. No `src/`, ADRs, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`. Leave uncommitted. Never push or merge.

## Publish
Notes under `ref:` (`kind: decision`); `.grugops/queue/done/bapm-ABC-175-heap.md` (brief + `## Result`) and `.claim.md`, uncommitted.
