---
id: 20261029T220730Z-orchestrator-decision-025f24a4
kind: decision
by: orchestrator
at: 2026-10-29T22:07:30Z
verified_by: 
confidence: high
refs:
  - ABC-235
  - se-ABC-235/…e64c9f42
  - se-ABC-235/…ebba6a59
  - se-ABC-235/…67655916
  - se-ABC-235/…cf540c21
  - arch-ABC-235/…7fc1b90c
  - qe-ABC-235
  - qe-ABC-225
  - OD-235-1
supersedes: 
seal: sha256:737a09e52825dce7913fa85d3c34243ef3ccd58ceb39ca0fe4d253fd6d75fb87
---

# ABC-235 code review: PASS; QE first (timing needs a quiet host), then qe-ABC-225

**Review of `grugops/ABC-235` @ `6327a3b4` (code `f9576af3`):**
- `src/` only: legal.ts, moves.ts, evaluate.ts and their tests (+688/−23). No package changes. 0 host paths.
- Cut 1 hoists `kingSquareOf` out of the per-move loop, using `move.to` for king moves. Nothing is cached on
  `Position`, as the design said.
- Cut 5's key is both pawn masks, stored exactly (float64, at most 48 bits). It is a module-level typed-array table of
  384 KiB, counted in G7.
- The A1 corpus hash is equal at base and at every cut (6 021 rows). Gates are green at every cut; deep lanes green;
  perft equal.
- nps tip/base (indicative): 1.27 / 1.28 / 1.16.

**Slip (LOW):** the SE ran a bare `npx biome format` once and `npx vitest` twice. Both resolved to local
devDependencies. I checked: no new npx cache entry from them (the one recent dir is the sessions' `@playwright/mcp`).
This is the second time; future SE briefs keep the warning in bold.

**Routing:**
- ABC-235 → In Review → `qe-ABC-235` now. The host is idle (load1 0.43).
- `qe-ABC-225` (40 real games) stays HELD until `qe-ABC-235` is done, so the timing reads are not disturbed.

**Owner INFO:** OD-235-1 (cut 1 re-opens ADR-0003's recorded king-scan attempt; veto open). It was reported in session
earlier.
