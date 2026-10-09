---
id: 20261009T200941Z-software-engineer-observation-abc086-rehop-merged-tree-gates-deep-lane-n8lane-under-457ba6b8
kind: observation
by: software-engineer
at: 2026-10-09T20:09:41Z
verified_by: 
confidence: medium
refs:
  - ABC-086
  - ABC-082
  - ADR-0027
  - N8-LANE
  - NFR-008
  - NFR-004
  - src/engine.test.ts
  - .grugops/context/recut-abc086-lane/notes/20261009T194946Z-ba-pm-decision-826f019a.md
  - .grugops/queue/claimed/ticket-to-pr-ABC-086-rehop/ticket-to-pr-ABC-086-rehop.md
supersedes: 
---

# `ABC-086` re-hop on the merged tree: gates green, `ENGINE_DEEP` green, `N8-LANE` +35 ms net — 15 × 2 shipped

Hand-authored, no seal (degraded posture, `AGENTS.md`). Subtask `ticket-to-pr-ABC-086-rehop`,
branch `grugops/ABC-086-virtual-clock`. Merge of the wave tip `b0a3ba9` (carries `ABC-082`) at
`54540e5`; the re-cut rows at **`a4d8633`**. Machine: Apple M3, Node v26.11.0. Host heavily loaded
throughout (the Orchestrator's `SEARCH_DEEP` lane, then another project's vitest): load1 5.5–29.
Raw files beside this note (`raw-*rehop*`).

## What changed (one file, `src/engine.test.ts`)

- **Merge:** one conflict, `plans/traceability.md`, both sides kept. No `src/` conflict.
- **`A1` default row:** the `startpos`, `position-3` and `position-5` families, filtered from the
  shared `thirtyPositions()` (15, length asserted). Each is searched 2× at budget 2, step 1, with a
  fresh shipped `virtualClock(1)` per run. It asserts identical 30/30 **and** root depth ≥ 2 on every
  run of all 15. The old 30 × 2 row is gone.
- **Helpers:** `deterministicRuns` now takes the positions and keeps each run's depth;
  `nonIdentical` takes those results. The deep 300/300 calls them on `thirtyPositions()` at budget
  24, as before. The depth floor reuses the same runs, so it costs nothing extra.
- **`A6`:** the 10/10 interleaved row moved, unchanged, into the `RUN_DEEP` block. The clock-state
  row stays in the default lane (its describe is retitled to what it now holds).
- `src/engine.ts` and `src/search.ts`: **no change** in the re-hop. Against the wave tip:
  `src/search.ts` 0 lines; `src/engine.ts` +8/−3, 0 non-comment lines (the build's comment edit).

## Gate (`a4d8633` tree, Workflow 05 order)

| step | result |
|---|---|
| host protection | exit 2, `UNKNOWN - verify` (no remote; `gh` no readable status). Never a pass |
| `npm run lint` | exit 1 on first run (formatter: one line wrap in the moved `A6` row); safe autofix (`biome check --write`), recheck exit 0. Self-fix attempt 1 of 2 |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0, **49 files, 1530 passed**, 8.3 s. Wave tip `b0a3ba9`: 49 / 1522 (+8: the build's 9 default rows minus `A6`'s interleaved row) |
| skip count | `0` |
| skip integrity | `No findings.`, exit 0 |
| e2e / UAT spec integrity | not applicable (no UI, no `*.uat.spec.ts`) |

## `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` on the merged tree

**Exit 0, 45 passed (32 default, 13 deep), 314.8 s wall** (user 297.9 s), 19:55–20:00Z, load1 7–10.

- **`A1` 300/300 identical: green**, 123.8 s.
- **Depth-4 floor: green.** Probe of the same tree (`raw-out-rehop-depths.txt`, virtual clock, so
  depth does not depend on speed): **24/30** at depth ≥ 4 at budget 24 (floor 15; the build tree
  read 27/30, the wave-tip pre-read 24/30).
- **Default slice:** 15/15 at depth exactly 2 at budget 2 (no margin above the floor at depth 3; the
  floor is the criterion). The fallback's 10 would read 10/10. All 30 at budget 2: 20/30 at
  depth ≥ 2, as the pre-read said.
- **`A6` 10/10 interleaved (now deep): green**, 0.6 s.
- **`A2`:** 10/10 legal, kiwipete `e2a6` ×10 at d5 ×8 and d4 ×2, 3 001–3 069 ms. Reported, not
  asserted (the d4 pair is the load the test note warns about).
- `ABC-078` `A1` worst case `position-6/a1c1` 3 076 ms at d5, 0/30 over 5 s. `NFR-005` kiwipete d5
  and position-6 d5 at 3 s — under load, not an `NFR-005` reading for this ticket.

## `N8-LANE` — standing instrument

Harness `raw-harness-lane086-rehop.mjs.txt` (the build's, arms re-pointed): CPU = user + sys of
`npx vitest run --dir src`, one fresh process per run, conditions rotated, 9 rounds, round 0
discarded, counts asserted per run. **Arms:** A = `a4d8633` (49 / 1530), N = byte copy of A
(`diff -rq` clean, 3 665 files), B = wave tip `b0a3ba9` (49 / 1522).

- **Run 1 (20:00:52–20:04:48Z) — ADMISSIBLE, the reading.**
  - Null N − A: median **0.000 s (0.00 %)**, sign 4/8.
  - Charge A − B: per round +0.18 −0.12 +0.43 −0.48 +0.68 −0.11 −0.25 +0.53 s, **median +0.035 s
    (+35 ms), sign 4/8.**
  - 0 harness errors of 27. **Load1 before each run: median 22.9 (12.0–26.8).** Confidence medium:
    the per-round spread (±0.7 s) is far wider than the effect, so the instrument reads the charge
    as indistinguishable from zero, and cannot resolve it finer than that at this load.
  - **Net: +35 ms against 650 (and the ≤ 450 ship line).** 0 test files added, no floor, no spawns.
- **Run 2 (20:05–20:08:56Z) — INADMISSIBLE, not a reading.** Null N − A median −0.680 s
  (**−2.22 %**, over the 1.5 % bar), sign 3/8; load1 median 22.3 (14.7–29.0). Its charge (median
  +0.715 s, sign 5/8, rounds −2.36…+2.03) is inside its own null noise. Recorded so it is not lost,
  not used. Raw: `raw-out-rehop-lane-run2-INADMISSIBLE*`.
- **Attribution, in vitest** (`npx vitest run src/engine.test.ts --reporter=json`, 3 runs, load1
  11–12.5): the new `A1` 15 × 2 row **106 / 107 / 109 ms**; every other `ABC-086` default row
  0–1 ms. So ≈ 110 ms in-lane — the low end of BA/PM's 160–240 estimate's band, and well under
  450. That is direct, single-row wall time, not the instrument.

**Slice shipped: 15 × 2** (not the 10 × 2 fallback, which is only for 450–650 ms).

## Stop conditions checked

- `A1` 300/300 on the merged tree: green. Depth-4 floor: green (24/30 ≥ 15). Not hit.
- `N8-LANE` > 650 ms: the admissible reading is +35 ms. Not hit.
- `src/engine.ts` beyond comments / `src/search.ts`: untouched by the re-hop. Not hit.
