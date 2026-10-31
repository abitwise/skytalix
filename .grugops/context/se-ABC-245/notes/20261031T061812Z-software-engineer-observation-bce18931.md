---
id: 20261031T061812Z-software-engineer-observation-bce18931
kind: observation
by: software-engineer
at: 2026-10-31T06:18:12Z
verified_by: 
confidence: high for gates and counts (run); the npm test wall is informal (n=3, head only, shared host), UNKNOWN - verify
refs:
  - se-ABC-245
  - ABC-245
  - ABC-242
  - EPIC-010
  - ADR-0046
  - ADR-0054
  - ADR-0032
  - NFR-008
  - QE-242-b
  - SE-242-f
  - R1
  - R2
  - R4
  - arch-qe242a-ruling
  - bapm-ABC-245-rescore
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-93eb0bf9
  - grugops/ABC-245
  - 7e81732e
  - 9c008db4
  - 4387d4e8
  - src/levels.test.ts
supersedes: 
seal: sha256:97d51935e56b42bdee27838ead5ee30ceeb2c216c853923f314aaf20ee502a21
---

# `ABC-245` readings at `7e81732e`: gates green, `npm test` 63 files / 2 364 passed, skips 0; informal wall median 9.30 s (load1 1.1–2.1)

- `npm run lint` exit 0 (biome, 131 files, no fixes). `npm run typecheck` exit 0. `npm run build` exit 0.
- `npm test` × 3, each exit 0: 63 files, **2 364 passed**, 0 failed, 0 skipped, 0 todo (last-run.json).
  `src/levels.test.ts` 46 tests, file span 162 ms; the new row's in-thread duration 1.67 ms.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- **Informal `npm test` wall** (date stamps around the npm call, n = 3, head only, no base, two records-only hops
  beside it on the host): 9.30 / 9.41 / 9.24 s, **median 9.30 s**. load1 before/after: 1.14 → 1.51, 1.51 → 2.11,
  2.11 → 2.10. Not a `G8` reading (`G8` is QE's): `UNKNOWN - verify`. Under 9.6 s, so tranche 2 would not fire on it.
- The `ABC-242` and `ABC-230` rows pass unedited (`git diff` touches only the header line and adds lines after the
  last `ABC-242` row).
