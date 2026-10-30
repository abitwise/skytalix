---
id: 20261030T152147Z-qe-e2e-observation-c6bdd364
kind: observation
by: qe-e2e
at: 2026-10-30T15:21:47Z
verified_by: 
confidence: high for the measured facts; severities per PREREG section 5
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
  - QE-220-a
  - QE-220-b
  - QE-220-c
  - QE-220-d
  - QE-220-e
  - QE-220-f
  - NFR-004
  - NFR-008
  - NFR-011
  - AR-NFR004-A
  - SEC-228-a
  - arch-ABC-220-a14/20261030T143241Z-architect-design-observation-ca075632
  - se-ABC-220/20261030T123301Z-software-engineer-observation-a76bc514
supersedes: 
seal: sha256:fcc0301c717664ba8cf8af29184645b533cdb1e104e580428e2f1135e617f00c
---


# qe-ABC-220 gaps and observations, with severity (none blocking), and what Security/NFR needs

QE/E2E, task `qe-ABC-220`, at `fbab54ff`. These are recorded as an `observation`: no §14 gate has run on this branch, so there is no `§14-gate#<id>` stamp to carry a `finding`. Severity follows the PREREG `…8ad475ba` § 5. Evidence is in the checks note and the timing note beside this one, and in `raw/`.

## QE-220-a (LOW, test strength): no src row pins the side-to-move increment in the mode branch
- **What:** mutant QM4 makes the `simple-tournament` branch read `clock.winc` for either side. It survives `npm test` at 2 297 / 2 297.
- **Why the SE's rows miss it:**
  - The increment row (`winc 2000 binc 2000`) is symmetric.
  - In the side row (`btime 3000 winc 9000 binc 0 movestogo 1`), the hard stop `t − 1 100` = 1 900 binds whatever increment is read.
- **What catches it:** QE-A3a (Black, `winc 0 binc 2000 movestogo 10` → 2 800; and the mirror) and QE-A6a.
- **Shipped behaviour is correct.** QE-A3a passes on head, both colours. Only the regression net is thin.
- **Follow-up (non-blocking):** move QE-A3a's four asymmetric rows into `src/uci-session.test.ts`'s A7 block. A later ticket, or `ABC-221`, which shares the code, can carry it.

## QE-220-b (INFO): one A11 wall reads 0.6 ms under 22 000 ms
- Kiwipete's wall is 21 999.4 ms, and the engine's own `time` reads 22000.
- The cause: the engine's deadline is `Date.now() + 22 000` in whole milliseconds, while the row reads `performance.now()`. A start late in a millisecond tick ends up to 1 ms early on the finer clock.
- This is not a defect. The other four walls are 22 000.1–22 001.0 ms.

## QE-220-c (INFO, for Security/NFR): `NFR-008` headroom is thin
- A12 read 9.69 s, and G8's head median was 9.73 s (base 9.64 s, +0.09 s from ABC-220's 52 rows). That leaves 0.27–0.31 s under 10 s.
- The board already watches this (9.61 s, 0.39 s headroom, at `secnfr-ABC-228-catalog`).
- The next row-adding merges (`ABC-229`, `ABC-221`) may cross 10 s.

## QE-220-d (INFO): degenerate `go` numbers in the setting reach no budget over 22 000
These checks confirm the ticket's ASVS L1 line ("no new input class"):
- `movetime −5` and `movetime 0` hand −5 and 0, as at a level on base, and the engine plays its unabortable depth 1.
- `wtime −9…9 winc 9…9` hands NaN, and the engine plays depth 1 by `engine.ts`'s stated NaN rule.
- 400-digit `wtime` and `movetime` hand 22 000.
- 3 000 random lines: none over 22 000.
- All of this is pre-existing parsing (`milliseconds`), unchanged by ABC-220.

## QE-220-e (INFO): a clock for the other side only gives T
- White to move with only `btime` gets 22 000, D3's no-time-token branch, as the ADR reads ("a clock for the side to move").
- At a level, the same `go` gives that level's own budget. A GUI always sends both clocks, so this is recorded only.

## QE-220-f (INFO): `setoption name Time Mode …` is ignored silently
- A spaced name is an unknown option, so it is ignored with no line, by the UCI rule already in force for every option.
- cutechess sends `option.TimeMode=…`, which has no space (`ADR-0052` D1). `ABC-222`'s first game log is to show the `setoption name TimeMode value …` line (D1).

## Carried, not QE's
- SE F3 (low): AGENTS.md has no command for the A11 lane. That is the Scribe's, at merge (test note 4). The command QE used was `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 node ./node_modules/vitest/vitest.mjs run src/uci-session.test.ts`.
- The whole-second reading (≤ 22 s means < 22 500 ms) still waits on the owner's confirmation (ticket FOLDED note). It blocks nothing. Every reading here also meets the strict reading except the stated overshoot (max +1.0 ms).
- The brief counts 13 SE mutants. `…e8314efb` lists 12.

## For Security/NFR at the gate
- **`NFR-004` (22 s in `TimeMode` `simple-tournament`):**
  - A6 reads 22 000 exactly on the virtual clock (the SE's rows, plus QE-A6a over 3 000 lines).
  - A11's real-clock max is 22 001.0 ms. **The overshoot is 1.0 ms**, inside `AR-NFR004-A`'s ≤ ~31 ms, which can be re-read at 22 s from this.
  - The clamp is unchanged at 32 000.
- **The busy-latency accepted-risk entry beside `NFR-011`:**
  - Measured terms: one budget (22 000), the overshoot (≤ 1.0 ms here) and the drain (A14b R1, 0.38 ms). The worst case read is ≈ 22 001.4 ms, under the < 22 500 ms reading. One `readyok` per `isready`, in order (A13, A14a, A14b R3).
  - The entry text is the Architect's (`arch-ABC-220-a14` `…ca075632`).
- **`NFR-008`:** QE-220-c.
- **ASVS L1:**
  - The value matches exactly against a frozen tuple. 8 hostile values, including `__proto__` and `constructor`, are refused.
  - The echo goes through `printableOf` (QE-A10e).
  - There is no new input class (QE-220-d).
- **Host:** the readings are from the Linux host (AMD Ryzen AI 9 HX 370, Node v26.12.1). The catalog still names the M3 reference (SEC-228-a, the owner's call).
