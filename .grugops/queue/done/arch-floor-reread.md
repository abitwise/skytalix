---
subtask: arch-floor-reread
role: architect-design
ticket: plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
ref: .grugops/context/arch-floor-reread/
inputs: Security/NFR …d0c770b5 (R-178-1, the stale provisional F 0.654 s for src/uci-session.test.ts) and …f636dfd0 (ABC-200's new 5-file set, provisional F 1.316 s above the bound, first twin R 0.050 s); QE timing …03c392fc; ADR-0035 D2
width: 2 (beside qe-ABC-201)
---

# Re-read the per-set floor F for the two sets whose provisional F is stale (R-178-1), so ABC-197's timing hop can be pre-registered

## Do
- For `src/uci-session.test.ts` (ONE-FILE): rule F from the admissible twins (R 0.070 s from ABC-177 A8, and R 0.030 s here). Rule whether the vitest 4.1.11 → 4.1.12 bump starts a new series.
- For ABC-200's 5-file set: record its first admissible twin (R 0.050 s), and say whether a provisional F stands or one more window is owed.
- Check ABC-197's 650 ms bound against the ruled F, as a cut check. If ABC-197's page needs an amendment, write it as a dated block. If any bound would move, that is an NFR-bound change: STOP and write it as an owner question.
- Records only. No runs.

## Fences
- Work on `grugops/arch-floor-reread` (worktree `../wt-arch-floor-reread` from `main`). Records only. No `src/`, `tools/` or `package*.json`. On `plans/board.md`: one `_Updated` line. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/archF/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-floor-reread`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result (architect-design, 2026-10-23T08:05Z): **both floors ruled; the vitest bump is not a new series; `ABC-197` A6 passes the cut check. No STOP: no bound moves.**

- **Branch:** `grugops/arch-floor-reread` @ `938bd9db` in `../wt-arch-floor-reread`, from `main` `e9ed895e`. Not pushed, not merged. Records only: no test, lane, probe or timing ran. Every figure was recomputed from the committed per-run TSVs (sha256 `43117fbaa2fb`, `6b5e0392983d`, `f5764cd4f2d6`), and each agrees with QE or Security/NFR.
- **`src/uci-session.test.ts` (ONE-FILE): F = 0.070 s CPU / 0.090 s wall.** It has two admissible twins, so the largest R governs: `ABC-177` A8 (4.1.11) 0.070 / 0.090 s and `ABC-178` B7 (4.1.12) 0.030 / 0.050 s. It replaces the provisional 0.654 s. From the third admissible reading on, the median of three governs.
- **Series: vitest 4.1.11 → 4.1.12 does NOT start a new series.**
  - The rule on record is about mechanism (`ADR-0042` R6, `ADR-0040` d4): a series breaks when a change moves per-file cost or queueing. Here `vitest.config.ts` is identical, and the runner, pool, workers, harness and heap flag are the same.
  - `QE-198-b` reads no shift without coverage (+0.5 % / −1.3 %), and `N8-LANE` runs without coverage.
  - The new-series answer (0.030 s) would be the smaller F, so this ruling is the stricter one at a cut.
  - **Re-open if:** the instrument runs with coverage, or on a minor or major bump, a runner change or a config change.
- **`ABC-200`'s 5-file set: F = 0.050 s CPU / 0.050 s wall.** This is its first admissible twin (`…f636dfd0`), and by decision 3's amendment it replaces the provisional 1.316 s outright. **No provisional F stands and no window is owed.** It is one quiet-host reading, and a wider later reading raises F by the rule.
- **`ABC-197` cut check: PASS.** `A6` 650 ms CPU ≥ F 0.070 s (≈ 9.3×). `A6` has no wall bound, and `A7`'s 10 s is `NFR-008`'s own level. **Page amendment: one dated block** under `A8`. It names F = 0.070 s for `A6`'s pre-registration and asks that `0.070` be passed to `readout174a.py` in place of `16pct`, which would print `650 ms >= F: False` again. No criterion moves.
- **STOP: none.** F is data (`ADR-0035` Rollback). The 650 ms, W, `N8-SPAWN`, the heap caps and every criterion on `ABC-197` are unchanged.
- **`R-178-1`:** its condition is met. Closing it in the catalog is Security/NFR's, as the `NFR-008` row owner, at its next catalog hop.
- **Written:**
  - `ADR-0035` § Status: a "Per-set floors, 2026-10-23" pointer. No decision changed.
  - The `ABC-197` page block.
  - `plans/board.md`: one `_Updated` line.
- **Notes** (sealed by grugops 2.1.0 `admitAndAppend` under `../wt-arch-floor-reread/.grugops/context/arch-floor-reread/notes/`, index rendered, read back): `20261023T080227Z-architect-design-observation-8ccdcfaa` and `20261023T080227Z-architect-design-decision-578a9290`.
- **Still open on the floor account (out of this brief):** the `ABC-174` narrow set's F (R 0.160 / 0.070 s, never recorded); the full-lane pre-cap F, with its "outright" against "on MET" wording conflict (`…6b1e94d2` § 4). Also, `ABC-197`'s cost line cites the 0.605 s headroom at `f81bf03c`, which is now superseded by `…d0c770b5`'s 0.990 s. That line is an estimate and is BA/PM's to refresh.
- **Not touched:** `src/`, `tools/`, `package*.json`, `plans/nfr-catalog.md`, `plans/traceability.md` (the row below is for the Orchestrator), other worktrees. No column moved.

### Trace row (10 cells, header order)

| ABC-197 (arch-floor-reread) | Per-set F re-read (R-178-1): src/uci-session.test.ts F = 0.070 s CPU / 0.090 s wall (A8 + B7; 4.1.11 → 4.1.12 not a new series); ABC-200 5-file set F = 0.050 s / 0.050 s (first admissible twin, no window owed); ABC-197 A6 650 ms passes the cut check | EPIC-007 | A6 | NFR-008; N8-LANE; ADR-0035 D3 (+ Status pointer 2026-10-23); ADR-0042 R6; ADR-0040 d4; R-178-1 (condition met) | `grugops/arch-floor-reread` @ `938bd9db` (records only)<br>`.grugops/context/arch-floor-reread/notes/` (…8ccdcfaa, …578a9290) | records only; recomputed from committed TSVs 43117fbaa2fb / 6b5e0392983d / f5764cd4f2d6 | — | — | F ruled; no bound moved; no STOP; ABC-197 page block (A6 pre-registration names F = 0.070 s); merge is the Orchestrator's |
