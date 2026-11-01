---
id: 20261101T204914Z-software-engineer-decision-efd7790c
kind: decision
by: software-engineer
at: 2026-11-01T20:49:14Z
verified_by: 
confidence: high on the stop (two independent reasons); speed figures informal, not an ALONE read
refs:
  - ABC-253
  - se-ABC-253
  - EPIC-010
  - ADR-0055
  - grugops/ABC-253
  - d46ed7ec
  - src/zobrist.ts
  - src/transposition.ts
  - src/engine.ts
  - src/search.ts
  - src/transposition.test.ts
  - src/engine.capacity.test.ts
  - src/search.capacity.test.ts
  - src/search.null-move.test.ts
  - ABC-081
  - ABC-122
  - ABC-208
supersedes: 
seal: sha256:b906e51d02e345e627c89ceef646ae273ad22f4a5f734d88d06620a25d706860
---

# ABC-253 STOPPED after the profile-first step: A5 is out of reach and the page conflicts with itself. No src/ change

**Decision.** The build stops before any src/ edit. The Orchestrator should close the ticket as dropped ("nothing to cut"). No src/ or test file changed on grugops/ABC-253.

**Reason 1: the prize is below A5's bar.**
- Base profile (main d46ed7ec, chooseMove 4 s, kiwipete and position-6, 2 fresh runs each, under the host lock). Self time: zobristKeyAfterMove 0.79-0.87 %, probeTable 0.88-1.30 %, storeEntry 0.07-0.16 %, repeatsInPath 0.01-0.03 %, repeatsBeforeRoot 0.02-0.08 %, GC 1.04-1.15 %. The key path totals about 1.9-2.4 %, so it clears the brief's ~1 % floor. That is why a probe was built rather than an immediate stop.
- An informal scratch prototype moved the whole chooseMove hot path to u32 halves: the per-ply keys, the incremental update and null-move update, TT keys and slot, the path scan, and priorKeys converted once per call. Its 48/48 tick-clock identity rows matched base.
- Profiled, the prototype cut the update from about 0.8 % to 0.26-0.28 %. The probe only went from 0.9-1.3 % to 0.79-0.95 %: its cost is the cache miss on the 4 MiB table, not bigint. GC stayed at 0.98-1.02 %, so it was not bigint garbage. Net saving is about 0.6-0.8 % self, a ceiling near 1.007x.
- Informal A/B (5 interleaved fresh runs per board per build, 4 s; not A5 and not an ALONE read): kiwipete 1.004x, position-6 0.992x, start 1.015x. Spreads were 1.8-5.9 %. A5 needs >= 1.02x on two boards. Per the page's miss rule nothing is re-tunable, and the key path is far below the 5 % re-open trigger.

**Reason 2: as written, the page asks for two things that cannot both hold (Architect ruling needed if ever re-opened).**
- Scope 1 puts the TT keys and index, the update and the repetition scan in halves. A2 needs ABC-081's TT rows to pass unedited. Those rows instrument the bigint seams themselves:
  - src/transposition.test.ts's vi.mock of probeTable forwards ONE bigint argument, and its storeEntry wrap reads args[1] and args[4].
  - Its A6 rows count exactly one BigUint64Array per search() and per chooseMove().
- Rows not on the unedited list but in the same position:
  - ABC-122's capacity rows (src/engine.capacity.test.ts, src/search.capacity.test.ts) mock zobristKeyAfterMove to return fresh bigints and spy repeatsInPath(BigUint64Array).
  - ABC-208's probe watch (src/search.null-move.test.ts) reads probeTable's bigint key.
- A halves hot path takes those seams off the call path, so the probe and store counts, the table-off switch and the write spies read 0. The rows go red unless they are re-pointed. Re-pointing them is an edit A2 forbids for the ABC-081 rows. A single-argument halves probe would also change an exported signature.

**Fence kept.** No src/ edit, no test edit, nothing pushed or merged. The prototype lived only in scratch and is deleted. Its patch is kept as raw/patch.py.
