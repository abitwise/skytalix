---
id: 20261029T202649Z-architect-design-observation-04fdc439
kind: observation
by: architect-design
at: 2026-10-29T20:26:49Z
verified_by: 
confidence: high on the source lines quoted and the arithmetic; UNKNOWN - verify on cutechess's own per-move latency and other GUIs
refs:
  - arch-epic009-settings
  - EPIC-009
  - orch-2026-10-29g/…a67f71ac
  - sa-ideas-verify/…1ccf0010
  - ADR-0052
  - NFR-004
  - AR-NFR004-A
  - RISK-EPIC009-01
  - RISK-EPIC009-03
  - cutechess v1.5.1 projects/lib/src/uciengine.cpp
  - cutechess v1.5.1 projects/lib/src/timecontrol.cpp
  - raw/alloc.mjs
  - raw/alloc.txt
  - main b5df6cde
supersedes: 
seal: sha256:d93ef1b1e6e0453fcc91456e9aeea98454c68968c85e3fa1588816282eb18a07
---

# Evidence for ADR-0052: cutechess v1.5.1 source facts, and the allocation arithmetic (no engine run, no game)

Read at `main` `b5df6cde`. Its `src/` is the code SA `sa-ideas-verify` `…1ccf0010` mapped. No engine probe ran at this hop.
No `cutechess-cli` process was running, and none was started.

## 1. cutechess-cli at tag v1.5.1 (the pinned version), source read only

- `projects/lib/src/uciengine.cpp` `startThinking`: `wtime`/`btime` are always sent; `winc`/`binc` only when above 0;
  `if (myTc->movesLeft() > 0) command += " movestogo %1"`. So `tc=40/900` sends `movestogo` 40…1. This closes SA
  `…1ccf0010` § 7's first `UNKNOWN - verify` for v1.5.1. `ABC-222` still logs it.
- `sendOption`: `setoption name <name> value <value>`, or `setoption name <name>` with no value.
- `projects/lib/src/timecontrol.cpp` `update()`: `m_lastMoveTime = m_time.elapsed()` (ms, from `startTimer()`). A move
  expires when `m_lastMoveTime > m_timeLeft + m_expiryMargin`. At a period's end it calls
  `setTimeLeft(m_timePerTc + m_timeLeft)`: the base is added to what is left. So with `timemargin=0`, the closest call is
  exactly the clock left after the move.
- `UNKNOWN - verify`: whether cutechess refuses a combo value outside its `var` list before sending; other GUIs' `movestogo`.

## 2. Allocation arithmetic (`raw/alloc.mjs`, output `raw/alloc.txt`)

Simulated clock. Each searched move costs its budget + δ (31 ms = `AR-NFR004-A`'s bound); a book move costs 0.
`C = max(1, min((t − 1000 − m·100)/m + inc, t − 1100))`, m = movestogo or 20.

| case | level 7 today (D4.1) | simple-tournament min(22000, C) | uci-clock-mode min(59500, C) |
|---|---|---|---|
| 40/15, one period: closest / use | 19 ms / 100 % | 18 760 ms / 97.9 % | 1 069 ms / 99.9 % |
| 40/15 with 6 book moves | 19 ms | 150 946 ms / 83.2 % | 1 069 ms / 99.9 % |
| 40/15, 3 periods | 19 ms | 18 760 ms | 1 069 ms |
| 40/15 with no movestogo, 80 moves | 128 s | 166 s | 117 s |
| scaled tc=40/60, 3 periods | 19 ms | 1 069 ms | 1 069 ms |
| largest δ keeping closest ≥ 500 ms at 40/15 | 0 ms | 600 ms | 600 ms |
| largest δ keeping closest ≥ 500 ms at tc=40/60 | 0 ms | 456 ms | 456 ms |

- Hard stop: `wtime 3000 movestogo 1` → 1 900 ms; `wtime 800` → 1 ms (depth 1 answers). Cap: `wtime 3600000
  movestogo 40` → 59 500.
- The level-7 row reproduces `EPIC-009`'s risk: D4.1's `t − 50` at a period's last move leaves ~19 ms at δ = 31.
- The SA's pipe probes (P1, P4, P5) show the wall minus the engine time at 1–3 ms. cutechess's own share of δ is
  `UNKNOWN - verify`, read by `ABC-222`.
