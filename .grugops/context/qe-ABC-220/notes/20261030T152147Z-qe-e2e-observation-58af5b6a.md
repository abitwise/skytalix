---
id: 20261030T152147Z-qe-e2e-observation-58af5b6a
kind: observation
by: qe-e2e
at: 2026-10-30T15:21:47Z
verified_by: 
confidence: high: each reading ALONE after wait-clear; figures copied from raw/alone and raw/g8
refs:
  - qe-ABC-220
  - ABC-220
  - EPIC-009
  - ADR-0052
  - grugops/ABC-220
  - fbab54ff
  - 68ba364c
  - a649fbc4
  - qe-ABC-220/20261030T144810Z-qe-e2e-decision-8ad475ba
  - A11
  - A12
  - A14
  - A14a
  - A14b
  - G8
  - NFR-004
  - NFR-008
  - NFR-011
  - AR-NFR004-A
  - ADR-0044
supersedes: 
seal: sha256:9d5490c100e888bf4e9a1911b6ed8bdccb71226d65c449df173c07b51636579a
---


# qe-ABC-220 timing: A12, A11, A14a, A14b and G8, each read ALONE and separately, wait-clear before each

QE/E2E, task `qe-ABC-220`, after the PREREG `20261030T144810Z-qe-e2e-decision-8ad475ba` (committed `4b2ad26e`). The tree read is `grugops/ABC-220` `fbab54ff`. QE's worktree HEAD `4b2ad26e` has the same `src` tree, `14295741…`. Host: AMD Ryzen AI 9 HX 370, Linux 7.0.0-42-generic, Node v26.12.1. Wait-clear before each read meant 0 foreign vitest, 0 `cutechess-cli`, load1 ≤ 2.0 and Tctl ≤ 60.0 °C. Each read was clear at the first poll, and no foreign vitest was seen during any read. Raw: `raw/alone/`, `raw/g8/`.

## A12 (`NFR-008`): MET
- One `npm test` at head, 14:50:18Z: **process wall 9.69 s**, vitest Duration 9.36 s, 2 297 / 2 297.
- load1 was 0.41 before and 0.65 after. Tctl was 36.4 °C before.
- **Headroom: 0.31 s** under the 10 s bar.
- The default lane gains 0 real-clock rows. The ABC-220 default-lane block (`src/uci-session.test.ts` lines 1500–2030) has no `Date.now` or `performance.now` call. Its one textual hit is the A11 lane's doc comment.

## A11 (`ENGINE_DEEP`, `src/uci-session.test.ts`): MET
- Started 14:50:35Z. The lane ran 206 / 206 green in a 112.35 s wall.
- load1 was 0.55 before and 0.94 after. Tctl median 73.4 °C, max 75.3 °C, over 22 samples. The THERMAL STOP did not fire.
- Walls, each < 22 500 ms:

| position | wall (ms) | engine info line |
|---|---|---|
| start | 22 000.5 | depth 12, time 22001 |
| after 1. e4 e5 | **22 001.0** | depth 11, time 22001 |
| italian | 22 000.5 | depth 11, time 22001 |
| kiwipete | 21 999.4 | depth 10, time 22000 |
| cpw position 4 | 22 000.1 | depth 13, time 22000 |

- **Max 22 001.0 ms. Excess over 22 000 ms: 1.0 ms**, against `AR-NFR004-A`'s ≤ ~31 ms. That leaves 499 ms of margin under the 22 500 ms whole-second reading.
- Kiwipete's wall is 0.6 ms under 22 000 (QE-220-b, INFO). The engine's deadline runs on `Date.now`, which counts whole milliseconds, while the row's wall comes from `performance.now`. The engine's own `time` reads 22000, so the search did spend T on its own clock.

## A14a (`UCI_DEEP`, `src/uci.real-engine.test.ts`): MET
- Started 14:52:39Z. 9 / 9 green: the 4 ABC-220 A14 rows, the 4 ABC-168 deep rows and the default-lane row.
- The A14 child took **2 070 ms** from spawn to exit. That figure is labelled as spawn-to-exit, not as a latency.
- load1 0.96.

## A14b (the probe, one counted run): MET
- The probe is `.grugops/context/qe-ABC-220/probe/a14b-probe.mjs`. It was dry-run once against a stub entry, and that run was not counted.
- The counted run was at 14:52:54Z: `node .grugops/context/qe-ABC-220/probe/a14b-probe.mjs .` from the worktree. The child was `node src/uci.ts`, spawned asynchronously, with no shell and with NODE_OPTIONS removed.
- Run conditions: load1 just before the spawn was 1.03. Tip `4b2ad26e`, src tree `14295741…`, equal to `fbab54ff`'s.
- **R1 met: 0.38 ms** from the `bestmove` arrival (+2 073.18 ms) to the busy `readyok` arrival (+2 073.56 ms). The bound is 100 ms.
- **R2 met:** `isready` was written 100.43 ms after `go`, and `bestmove` arrived 2 002.02 ms after `go`, so the `isready` was busy.
- **R3 met:** 2 `readyok` and 1 `bestmove`. The busy `readyok` is line 9, directly after the `bestmove` on line 8.
- The child exited with code 0, no signal and empty stderr. The `bestmove` was e7e5, after `info depth 9 … time 2000`.
- Not graded: `go` → `bestmove` 2 002.02 ms; `go` → `isready` 100.43 ms.
- **A14 is MET: A14a and A14b are both met.**

## G8 (`npm test` wall, base `a649fbc4` vs head, interleaved b h h b b h): MET

| run | tree | wall (s) | load1 before | tests |
|---|---|---|---|---|
| 1 | base | 9.50 | 0.87 | 2 245 |
| 2 | head | 9.73 | 0.94 | 2 297 |
| 3 | head | 9.70 | 0.86 | 2 297 |
| 4 | base | 9.64 | 0.81 | 2 245 |
| 5 | base | 9.75 | 0.90 | 2 245 |
| 6 | head | 9.76 | 1.56 | 2 297 |

- **Medians: base 9.64 s, head 9.73 s, delta +0.09 s.**
- Head's median is under 10 s with 0.27 s of headroom (QE-220-c, INFO).
