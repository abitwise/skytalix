---
id: 20261023T080227Z-architect-design-decision-578a9290
kind: decision
by: architect-design
at: 2026-10-23T08:02:27Z
verified_by: 
confidence: high (rules applied to recomputed readings; series ruling rests on QE-198-b's no-coverage reading, mechanism UNKNOWN - verify)
refs:
  - arch-floor-reread
  - R-178-1
  - ABC-197
  - ABC-200
  - ABC-177
  - ABC-178
  - ABC-198
  - NFR-008
  - N8-LANE
  - ADR-0035
  - ADR-0042
  - ADR-0040
  - 20261023T072556Z-security-nfr-decision-d0c770b5
  - 20261023T075206Z-security-nfr-decision-f636dfd0
  - 20261023T071821Z-qe-e2e-observation-03c392fc
  - 20261021T063630Z-qe-e2e-observation-4263d981
  - 20261022T171339Z-qe-e2e-observation-1478c7fc
  - 20261021T055500Z-orchestrator-decision-b87c35b6
  - plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
  - 20261023T080227Z-architect-design-observation-8ccdcfaa
supersedes: 
seal: sha256:9d5fdac65adbf7cc030f8c46838f40b1100f5c74ccc409d257fd58ebfef3a102
---

# Floors re-read (`R-178-1`): `src/uci-session.test.ts` **F = 0.070 s CPU / 0.090 s wall**; the vitest 4.1.11 → 4.1.12 bump does **not** start a new series; `ABC-200`'s 5-file set **F = 0.050 s CPU / 0.050 s wall**, with no window owed. `ABC-197` A6's 650 ms **passes** the cut check. No bound moves, so there is no STOP

This is a `decision`, not a `finding`. `human_admission` is off, so no stamp exists. The readings are in this task's observation note. Nothing was run or timed. **F is data, not a bound** (`ADR-0035` Rollback: "Decision 3's floors are data, not policy"). Every bound stays as it is: `N8-LANE`'s 650 ms, `NFR-008`'s W, `ABC-197`'s A1–A8, `N8-SPAWN` and the heap caps.

## 1. `src/uci-session.test.ts` (ONE-FILE): **F = 0.070 s CPU / 0.090 s wall**
- **Rule.** `ADR-0035` decision 3, as amended: with fewer than three admissible readings, F is the largest R. The two readings are `ABC-177` A8 (0.070 / 0.090 s) and `ABC-178` B7 (0.030 / 0.050 s). From the third admissible reading on, the median of the three most recent governs.
- **It replaces** the provisional 16 % (0.654 s at B7, 1.136 s at A8). That discharges `R-178-1`'s condition: "re-read it before `ABC-197`'s timing hop is pre-registered". Closing the risk in the catalog is the `NFR-008` row owner's (Security/NFR), at its next catalog hop.
- **A8 counts.** Its strict view was VOID on foreign load and sampler only, which the owner's word `…b87c35b6` stopped from blocking a window. The D1 twin test is admissible in both units (recomputed).

## 2. The vitest 4.1.11 → 4.1.12 bump (`ABC-198`): **not a new series**
- **The series rule on record is about mechanism.** `ADR-0042` ruling 6 broke every set's series because "the runner change moves every file's per-file cost" (3.2.7 → 4.1.11, runner off). `ADR-0040` decision 4 kept sets of ≤ cap files and broke larger ones, because the cap changes how files queue. A series breaks when the change moves per-file cost or file queueing.
- **This bump moves neither.** It is a patch bump inside `~4.1.11`. `vitest.config.ts` is identical between the two bases, so the runner mode, pool, `maxWorkers: 2` and isolation are unchanged. The harness, heap flag and instrument (`lane174` `e2074cdbeedd`) are the same. QE's paired bisect (`…1478c7fc`) reads **no shift without coverage** (+0.5 % / −1.3 %, 26 pairs), and `N8-LANE` arms run without coverage. Its +5 % is coverage-only (`@vitest/mocker`).
- **Direction check.** The other answer (a new series from B7) gives F = 0.030 s. The ruling gives the larger F, which refuses more bounds at a cut, not fewer. No cut on record or in sight sits between 0.030 s and 0.070 s, so no decision hangs on it.
- **The content change between A8 and B7 is not a break either.** `ABC-177` cut the file's B CPU from 7.10 s to 4.09 s. F is keyed by set, and decision 3's own table reads one set across bases (`src/cli.test.ts`, 7.99 / 6.95 s). Keeping A8 is again the larger F.
- **Re-open** on (a) any `N8-LANE` or `NFR-008` instrument that runs with coverage, where `QE-198-b`'s +5 % applies, or (b) a vitest minor or major bump, a runner-mode change or a `vitest.config.ts` change, which take `ADR-0042` ruling 6's path. Later readings on this set are not a trigger: the median-of-three rule takes them in.

## 3. `ABC-200`'s 5-file set: **F = 0.050 s CPU / 0.050 s wall. No provisional F stands, and no window is owed**
- **The set:** `src/cli.real-engine.test.ts src/cli.test.ts src/engine.test.ts src/line-input.test.ts src/startup-questions.test.ts`, SUITE heap 128, vitest 4.1.12, `maxWorkers: 2`, own `npm ci` per arm.
- **Rule.** The amendment's own words: "Its first admissible reading replaces it." The window `security-nfr-timing-2026-10-23` (`…f636dfd0`) is admissible in both units (recomputed). So F is 0.050 s / 0.050 s, the largest of one, and it replaces the provisional 1.316 s outright.
- **No window is owed for F.** The rule does not wait for three readings, and the precedents (`src/cli.test.ts` at 0.100 s and the qe-hop set at 0.020 s) were each set from one or two readings. 650 ms is 13× this F.
- **Stated, not hidden.** It is one reading, on a quiet host (load1 ≤ 3.68, 0 foreign, thermal 0). A loaded reading may read wider, and the rule raises F when one does. The set contains `src/cli.test.ts`, whose own one-file F is 0.100 s (pre-cap, 4.1.11). That is a different set and a different instrument, and it is not compared here.
- **Set identity.** A later ticket whose narrow set resolves to a different file list is a different set and takes the provisional 16 % until its own first admissible reading.

## 4. `ABC-197` cut check: **PASS. Not refused, and no bound moves**
- **`A6`:** ≤ 650 ms CPU on the ONE-FILE set. 650 ms ≥ F 0.070 s (≈ 9.3×). A strict cut check now prints True.
- `A6` sets no wall bound (wall medians are reported), so decision 3's wall clause does not apply. `A7`'s 10 s is `NFR-008`'s own level, not a per-ticket bound.
- The expected ≈ +150 ms charge sits above F, so A6 should resolve the content rather than read "reported, not resolved".
- **Page amendment: one dated block** under `A8`, so the A6 pre-registration names F. Passing `16pct` to `readout174a.py` would print a provisional ≈ 0.66 s and `650 ms >= F: False` again. The block asks that `0.070` be passed instead. No criterion moves.

## 5. Where it is recorded
- `ADR-0035` § Status: a dated "Per-set floors, 2026-10-23" pointer paragraph, as the 2026-10-12 per-set paragraph did. No decision changes.
- `ABC-197`'s page: the dated block in § 4.
- `plans/board.md`: one `_Updated` line.
- **Not done here (out of this brief, still open on the floor account):** the `ABC-174` narrow set's F (R 0.160 s CPU / 0.070 s wall, left to this role at `secnfr-catalog-abc174`); the full-lane pre-cap F and the "outright" against "on MET" wording conflict (`…6b1e94d2` § 4).

## Result
- **F rulings:** `src/uci-session.test.ts` 0.070 s CPU / 0.090 s wall. `ABC-200` 5-file set 0.050 s CPU / 0.050 s wall.
- **Series:** 4.1.11 → 4.1.12 does not start a new series.
- **`ABC-197`:** the cut check passes, and the page gets one dated block.
- **STOP:** none.
- **`R-178-1`:** its condition is met. Security/NFR closes it at its next catalog hop.
