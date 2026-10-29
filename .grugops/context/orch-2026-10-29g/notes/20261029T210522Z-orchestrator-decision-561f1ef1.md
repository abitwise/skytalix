---
id: 20261029T210522Z-orchestrator-decision-561f1ef1
kind: decision
by: orchestrator
at: 2026-10-29T21:05:22Z
verified_by: 
confidence: high
refs:
  - ABC-225
  - se-ABC-225/…e58c4d25
  - se-ABC-225/…868049fb
  - se-ABC-225/…14fdbedc
  - qe-ABC-225
supersedes: 
seal: sha256:4cb309a29330c8fc60508bf1527424fbebfa33ec4a5dd15820110cae65632c72
---

# ABC-225 code review: PASS; QE A5/A6 queued, HELD until the host is idle

**Review of `grugops/ABC-225` @ `9988a778` (code `83751dc0`):**
- Scope: `tools/rating/rating.ts` (+549/−62), plus the new `pair.ts` and `pair-check.ts`, the ticket line and notes.
  No `src/` or `data/` change.
- Process calls are `execFileSync` with argv arrays and no shell. The sha arguments are checked against `SHA_ARG =
  ^[0-9a-f]{7,40}$` before any git call.
- The leak scan hits only test fixtures (`/home/u1x/…`) and prose. No real host path.
- The SE's `cmp` evidence shows `r` and `d` byte-identical to main's harness. `pair-check` gives 22/0.
- Gates: `npm test` 63/2 128, lint, typecheck and build all 0.
- Not merged yet: the merge comes after QE's A5/A6.

**QE `qe-ABC-225` queued:**
- A5 is a real `rpair --rounds 10` (40 games at width 2, about 1 h) **ALONE**. A6 is the wall time and the projection.
- HELD until `se-ABC-235` and `arch-ABC-228-adr` are done and the host is idle.
- The owner is notified in session. His earlier heat concern applies; this is of the same class as the per-ticket
  smokes he set.

**One question to QE:** `artifacts.txt` carries the engine's public UCI `id author` line, as `r` did before. That
is the engine's author string, not a login. QE rules on it; the Orchestrator's reading is that it is fine (precedent:
the q4c review).
