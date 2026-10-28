---
id: 20261028T212146Z-orchestrator-decision-0c5e9315
kind: decision
by: orchestrator
at: 2026-10-28T21:21:46Z
verified_by: 
confidence: high
refs:
  - EPIC-008
  - ABC-204
  - qe-epic008-close
  - bapm-epic008-hostB/…f0c8fedb
  - orch-2026-10-28a/…5dbd717b
supersedes: 
seal: sha256:2b6a3341cd27f2f340da075acf77596fa86a95201e384f948f364d0257f2d344
---

# Owner word: foreign vitest on this host does not disqualify a reading

**Owner (Olger Oeselg), 2026-10-28, in session:** "don't worry about the other vitest". This host has 24 CPU threads (`nproc` = 24) and an integrated GPU. The engines use only the CPU; the GPU plays no part in any reading.

**What it means for EPIC-008 close step 3′ (`qe-epic008-close`):**
- A foreign vitest process that overlaps games does **not** make an R reading UNRESOLVED and does not make it ungraded. The **all-games** figure is the graded figure for M1.
- QE still samples and maps overlaps, and still reports the overlap-free figure, as information only.
- The pre-reading wait for "no foreign vitest" is waived. The QE hop was spawned before this note, under a brief that waits up to ~60 min. At worst that costs ~1 h per reading. It is not a fault.
- The load1 ≤ 8 pre-check stands as written. On 24 threads it is a loose bar. One skytalix game uses ~2 threads (skytalix plus Stockfish with Threads 1).

**Step 4 (BA/PM):** grade M1 on the all-games figures for both readings. A gap between the all-games and overlap-free figures is reported, not graded.
