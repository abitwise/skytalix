---
id: 20261102T170534Z-software-engineer-decision-822a3168
kind: decision
by: software-engineer
at: 2026-11-02T17:05:34Z
verified_by: 
confidence: high: as committed in 7d9c8695; QE's suggested row
refs:
  - se-ABC-265-fix
  - ABC-265
  - EPIC-011
  - ADR-0025
  - QE-265-a
  - grugops/ABC-265-fix
  - 7d9c8695
  - 6a4b0d37
  - e5694864
  - src/transposition.shared.test.ts
  - src/transposition.ts
  - qe-ABC-265/20261102T170102Z-qe-e2e-observation-ace42c34
  - qe-ABC-265/20261102T170102Z-qe-e2e-observation-9d77019b
supersedes: 
seal: sha256:2f063da4f49ebeadbba57d2826dfb1690eb00d2ea3be17a406e3211da7d2dfaf
---

# se-ABC-265-fix row: one A2 row pins the hit rule's non-zero data word (closes QE-265-a)

- **Row added** in `src/transposition.shared.test.ts`, `describe("ABC-265 A2 — the XOR check")`, after the bit-31 row: "a cleared slot never hits, even for key 0n whose XOR equations it satisfies (a zero data word is empty)".
  - Body: `clearTable(); expect(wordsOf(0)).toEqual([0, 0, 0, 0]); expect(probeTable(0n)).toBe(-1);`
  - The `wordsOf(0)` line shows the slot really is all zero, so the miss can only come from the empty-slot term: key `0n` maps to slot 0 and keyLo = keyHi = 0, which satisfies both XOR equations on zero words.
- **Why this row:** QE's suggested row (qe-ABC-265 gaps note, QE-265-a), as written, plus the one-line slot read.
- **Scope:** tests only. No production `src/` edit; no other row edited. The file now has 12 rows (A1 ×5, A2 ×7 incl. T10 ×2).
