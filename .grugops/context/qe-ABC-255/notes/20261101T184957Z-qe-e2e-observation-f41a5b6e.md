---
id: 20261101T184957Z-qe-e2e-observation-f41a5b6e
kind: observation
by: qe-e2e
at: 2026-11-01T18:49:57Z
verified_by: 
confidence: high
refs:
  - ABC-255
  - EPIC-011
  - ADR-0056
  - QE-255-a
  - QE-255-b
  - QE-255-c
  - QE-255-d
  - QE-255-e
  - QE-249-c
  - ABC-225
supersedes: 
seal: sha256:22e4c212bf4138add05f34c88149a2eb1aedd09f2d8bfea5f58926676ce329fe
---

# QE observation, qe-ABC-255: the gaps (none blocking)

- **QE-255-a (LOW, carrier: SE, or BA/PM as a test note).** No offline row holds the `control:` line that `rating.ts` writes to `machine.txt` for a short budget (scope 3).
  - Mutant M8 drops the line, and all 32 pair-check tests still pass.
  - The three real reads show the line present and correct: `skytalix st=0.5 timemargin=50` for A5, and `skytalix and base st=0.1 timemargin=50` for A3 and A4.
  - Remedy: one pair-check row that drives `main()` up to machine.txt, or accept it as records-only. Not changed by QE.
- **QE-255-b (INFO, carrier: SE).** `--budget-ms` is read with `Number()`, not checked as text.
  - `r --budget-ms 500.0|5e2|0x1F4` and `d --budget-ms 1e2` are accepted and print the same vector as 500 / 100.
  - `--concurrency` is text-checked ("2.0 or 0x2 is refused"). `d`'s Number() reading is pre-existing at base `8f2fc9b5`.
  - It is harmless: the vector is identical. A `/^\d+$/` check would match `--concurrency`.
- **QE-255-c (INFO, pre-existing, carrier: BA/PM backlog).** The harness's own `host.log` overstates contention.
  - `hostLine` counts `pgrep -f /vitest`, which also matches flock waiter and shell command lines (cf. QE-249-c).
  - In A5 every host.log line read `foreign_vitest_procs=7` (later 2), while QE's sampler counted 0–2 real vitest processes.
  - This is ABC-225 code, not ABC-255's.
- **QE-255-d (INFO, carrier: BA/PM and Architect, ADR-0056 S′ E re-pin).** The first S′ on main scored 9/10 (0.900) at E 1 650. That is above ADR-0056's 67–83 % estimate.
  - It is one 10-game read. The re-pin trigger needs at least 30 pooled S′ games outside 60–85 %, so it is not triggered.
  - Recommendation only: start the S′ smoke ledger with this read.
- **QE-255-e (INFO, admissibility).** A3 ran ALONE.
  - A5 is SHARED: the start came at the end of the 20 min wait cap, behind a long foreign grugops vitest. 28.9 % of samples carried a real foreign vitest.
  - A4 started ALONE but is SHARED: 15.5 % of samples carried a foreign vitest, from the marketing repo.
  - In both, foreign processes stayed under 20 % CPU in all but 1–3 samples, and load1 medians were 1.56–1.96.
  - What the reads check is unaffected. That is time losses (0) and overshoot: the max is 5 ms against a 50 ms margin.
  - A timing-grade comparison of games/h between blocks is not claimed.
