---
id: 20261024T130823Z-software-engineer-observation-fcbbf321
kind: observation
by: software-engineer
at: 2026-10-24T13:08:23Z
verified_by: 
confidence: high on the paired readings in this window; not a sentinel window
refs:
  - ABC-212
  - AR-212-LANE
  - NFR-008
  - N8-LANE
  - A9
  - A12
  - A13
  - grugops/se-lane-ABC-212
  - 8c1d0e6c
  - 2079e0df
  - security-nfr-ABC-212/20261024T135200Z-orchestrator-decision-550e067d
  - security-nfr-ABC-212/20261024T124433Z-security-nfr-decision-e2c5d6b9
  - plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
supersedes: 
seal: sha256:6987a5c6cf4d93195a6695f1b54c4e1911417955a6fff5d1e38a32ecb613a55b
---

# ABC-212 lane cost: paired npm test wall, head 8.58–8.82 s vs base 9.07–9.38 s (all clean); gates green

Readings at `8c1d0e6c` (head) and `2079e0df` (base), in one worktree, with only `src/uci-session.test.ts` swapped between arms. ABBA order. Before each run the script waited until `pgrep -fl 'node.*vitest'` was empty. Before the first round it waited about 8 min, because another repository's vitest was live. During each run it sampled for a foreign vitest every 0.5 s. Node v26.11.1, Apple M3, load1 4.1–9.4 before runs. Raw: `raw/lane-timing.tsv` (scratch `<scratchpad>/se212lane/`).

| | base `2079e0df` (clean n=6) | head `8c1d0e6c` (clean n=4) |
|---|---|---|
| `npm test` Duration | 9.07, 9.09, 9.10, 9.26, 9.33, 9.38 s (mean 9.21) | 8.58, 8.73, 8.74, 8.82 s (mean 8.72) |
| `src/uci-session.test.ts` file wall | 4 362–4 632 ms | 3 546–3 624 ms |
| the 9 A9 rows, summed | 1 050.5–1 143.0 ms | 155.2–159.9 ms (≤ 650 N8-LANE slice) |

- Two head runs (round 1, runs 6–7: 9.54, 9.55 s) overlapped a foreign vitest. They are discounted and kept in raw.
- The lane drop (about 0.49 s mean) is smaller than the A9 drop (about 0.93 s), because files run in parallel.
- **These are not the Orchestrator's sentinel windows.** In this window base read 9.07–9.38 s, against the 10.34/10.81 s the Orchestrator read for the same line. The host state differs. The merge's sentinel re-read is still the Orchestrator's.

**Gates at `8c1d0e6c`:** lint rc 0 (125 files); typecheck rc 0; build rc 0. `npm test`: 62 files, 2 066/2 066, `success: true`, pending 0, todo 0 (every timed run too). `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` gives `No findings.`. `UCI_DEEP` 5/5. `CLI_DEEP` and `ENGINE_DEEP` were not run (outside the brief).
