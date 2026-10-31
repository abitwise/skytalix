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
