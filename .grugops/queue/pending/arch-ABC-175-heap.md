---
subtask: arch-ABC-175-heap
role: architect-design
tickets: [ABC-175]
ref: .grugops/context/arch-ABC-175-heap/
---

# Architect: verdict command under the heap cap (records only)

## Problem
`secnfr-ABC-174-a0` (route V, F_hi 1.047, A0 commit `ed88329c`; done file `.grugops/queue/done/secnfr-ABC-174-a0.md`, note `.grugops/context/secnfr-ABC-174-a0/notes/…-e4b8d062.md`) found that on the ABC-175 run tree (`grugops/ABC-174` @ `f6b63c1c`, carrying ABC-173's heap guard per ADR-0008 addendum / NFR-010) the verdict command and the A1 `-t "3v4"` probe have no `NODE_OPTIONS=--max-old-space-size=…` prefix, and the guard refuses an unprefixed one-file run (exit 1, no test runs). Probable form: `caffeinate -i env LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`. Whether 180 verdict games fit in that heap is UNKNOWN — no OOM probe is in scope here; an OOM on the night goes to the owner (ABC-173 Q4).

## Do
Rule the verdict and pre-flight command forms under ADR-0008's addendum (which heap value; must it match the AGENTS.md lane prefix; does the A0 vitest arm C1 at 400 bind it). Write a dated forward-only addendum to ADR-0045 D6.3 and ADR-0038 addendum 2 (`memory-bank/50-decisions/`) with the exact commands. Say whether the night needs an OOM pre-probe and how (owner-routed if it costs a run).

## Fences
Records only, on main's working tree: those two ADR files and your notes. No `src/`, `tools/`, `AGENTS.md`, `plans/`, no lane runs, no timing. Leave uncommitted. Never push or merge.

## Publish
Notes under `ref:` (`kind: decision`); `.grugops/queue/done/arch-ABC-175-heap.md` (brief + `## Result`, the exact two commands) and `.claim.md`, uncommitted.
