---
id: 20261029T063012Z-qe-e2e-observation-ffb593fe
kind: observation
by: qe-e2e
at: 2026-10-29T06:30:12Z
verified_by: 
confidence: high: every instrument run as stated on 38536a34; outputs read
refs:
  - EPIC-008
  - ABC-204
  - M1
  - M3
  - G1
  - G5
  - G6
  - G8
  - G9
  - 3497aad2
  - 38536a34
  - b5c67ab7
  - orch-2026-10-28a/20261028T210902Z-orchestrator-decision-5dbd717b
  - se-tools-rating-host/20261028T211542Z-software-engineer-decision-f55b4cdf
  - bapm-epic008-hostB/20261028T211452Z-ba-pm-decision-f0c8fedb
  - owner-word-2026-10-24/…4c3f7639
  - owner-word-2026-10-26b/…2ae5fc12
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - grugops/qe-epic008-close
  - ADR-0049
  - qe-epic008-close/20261028T212209Z-qe-e2e-observation-8fb860a9
  - qe-epic008-close/20261029T014341Z-qe-e2e-observation-e8d5c13a
supersedes: 
seal: sha256:66f7da600df7cbe5789eb69237da8d9a9b9758e5e4bdf8fc190fcc3cb9b7bbd2
---

# M3 on the close sha 38536a34, read after both R readings: G1, G5, G6, G8, G9 all MET; the gates are green

Pre-registered in `20261028T212209Z-qe-e2e-observation-8fb860a9`. Run 06:14:49Z–06:27:40Z, in one detached chain (`m3.sh`), after reading 2 ended (06:14:15Z) and never during a reading. Each step had its preconditions checked first (load1 ≤ 8, 0 vitest, 0 cutechess); all passed on the first poll. Power was `none` throughout. Raw files: `.grugops/context/qe-epic008-close/raw/m3/`.

| gate | instrument | result | state |
|---|---|---|---|
| `G1` | `PUZZLE_DEEP=1 … npx vitest run src/puzzle-suite.test.ts` | 18/18 green; **solved 54/58**, baseline 54/58 (missed: 4 mate-in-3 rows, the recorded set) | **MET** (≥ 54) |
| `G5` (`NFR-004`) | `ENGINE_DEEP=1 … npx vitest run` on `src/engine.test.ts` (60/60) and `src/levels.test.ts` (41/41), unfiltered, verbose | engine `A1` worst case `startpos 3002 ms at completed depth 10` (≤ 5 s); levels `A5` level 5 30/30, max **3 002 ms**; `ABC-212` `A4` level 6 max 5 002 ms (30/30 in 5 000–7 000), level 7 max 30 002 ms (10/10 in 30 000–32 000) | **MET** |
| `G6` (`NFR-005`, rule A) | 5 interleaved rounds per board per build, plain `node`, base = `git archive 3497aad2`, head = `git archive 38536a34`, `chooseMove` at 3 000 ms real clock | `kiwipete` base 7 ×5, head 8 ×5 (medians 8 ≥ 7); `position-6` base 8 ×5, head 10 ×5 (medians 10 ≥ 8); min of any run 7 (floor 6); no depth-7 WARN; every run chose the same move per board (`Bxa6`, `Nd5`) | **MET** ("≥ base" on both boards) |
| `G8` (`NFR-008`) | the gate run's `npm test`, `/usr/bin/time -p` | **8.32 s** real (vitest 8.05 s) at load1 1.26 | **MET** (≤ 10 s at load1 ≤ 8) |
| `G9` | `git diff 3497aad2 38536a34 -- src/levels.ts` | empty (0 bytes) | **MET** |

- `G6` overlap: 0 of 20 runs met a foreign vitest or cutechess sample or a load1 > 8 sample (load1 0.76–0.91). Overlap-free = all runs. Node medians: `kiwipete` base 1 450 586, head 1 810 285; `position-6` base 1 715 865, head 1 878 626.
- **Gates (worktree at `38536a34`):** `npm run lint` exit 0 (129 files); `npm run typecheck` exit 0; `npm run build` exit 0, `dist/` 22 files, 0 from `tools/`; `npm test` exit 0, **63 files / 2 128 passed**; `last-run.json` `success: true`, 2 128/2 128, 0 failed; skip count 0; `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`, exit 0.
- **Disclosure, G1:** the first PUZZLE_DEEP run (06:15:51Z, default reporter) was green 18/18, but it printed no row lines, so the count could not be read. The same deterministic lane (budget 25 ms, step 1) was run once more at 06:28Z with `--reporter=verbose` to print it: 18/18, `solved 54/58`. The gate test, "solved ≥ the recorded baseline", is green in both runs. The deep-lane sampler counted vitest processes in 68 samples. All of them are this hop's own `engine` and `levels` lanes (class: self), not foreign load.
