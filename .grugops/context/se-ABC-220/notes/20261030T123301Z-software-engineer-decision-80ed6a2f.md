---
id: 20261030T123301Z-software-engineer-decision-80ed6a2f
kind: decision
by: software-engineer
at: 2026-10-30T12:33:01Z
verified_by: 
confidence: high: built to ADR-0052 as accepted and amended 2026-10-30; each choice below is pinned by a row
refs:
  - se-ABC-220
  - ABC-220
  - EPIC-009
  - ADR-0052
  - grugops/ABC-220
  - 68ba364c
  - 8e1cdda5
  - ADR-0044
  - ADR-0027
  - src/uci-session.ts
  - src/uci-session.test.ts
  - src/uci.real-engine.test.ts
supersedes: 
seal: sha256:4ee83596cd5eb9ccaa7e2d3558ad38deb35ad0c6459e2e0b4e018b5c16ad9f60
---

# Software Engineer decisions, se-ABC-220: how ADR-0052's simple-tournament was built

Built to `ADR-0052` (ACCEPTED 2026-10-30, the owner's 22 s amendment) and the ticket's FOLDED text, at `grugops/ABC-220` `68ba364c` from `main` `8e1cdda5`.

## The choices the ADR left to the SE
- **Where the mode enters:** `parseGo` takes a fourth parameter, `timeMode`, and computes D3's budget inside its existing budget block. The `level` branch is byte-for-byte the old one. `go` skips the level cap and the blunder branch when `timeMode !== "level"` (one `leveled` flag), so a mode always reaches the `chooseMove` path with D12's limits.
- **C:** `safeClockShare(time, increment, movesToGo)`, private, beside `parseGo`. The increment is added whole (D2), not halved as D4.1's `G` does. `movestogo` defaults to `DEFAULT_MOVES_TO_GO` (20), D4.1's constant, as the ADR names.
- **Constants:** `SIMPLE_TOURNAMENT_CEILING_MS = 22_000`, `SIMPLE_TOURNAMENT_BUDGET_MS = SIMPLE_TOURNAMENT_CEILING_MS`, `CLOCK_RESERVE_MS = 1_000`, `CLOCK_OVERHEAD_MS = 100`, all module-private. No export was added, so no export-list pin moved.
- **The tuple:** `TIME_MODES = Object.freeze(["level", "simple-tournament"] as const)`. The `uci` line and the refusal text are both built from it. A value is accepted only by `TIME_MODES.find((mode) => mode === value)`, so the match is exact and no inherited key can match.
- **The refusal text (A10, the ADR's open wording):** `info string TimeMode takes level or simple-tournament, got <v>; kept <old>`. A helper `spokenList` spells the tuple as `a or b` or `a, b or c`. At the `ABC-221` build it gives the ADR's D1 text exactly, with no edit. This is BA/PM's reading, "the values offered at this build". The Architect confirms it or rules otherwise.
- **The D5 header sentence (Test notes 4, owed at merge):** added to `src/uci-session.ts`'s ONE THREAD paragraph. It reads: answered at most one budget plus `AR-NFR004-A` late, so 22 s read to the whole second; accepted with no worker (`ADR-0052` D7); one `readyok` per `isready`, in order, after the `bestmove`.

## Tests, and where they live
- **The default lane, all in `src/uci-session.test.ts`:** A1–A10 and A13 are in one `describe("ABC-220 …")`, on the virtual clock, with no wall read (A12's structure).
  - The clock rows (A3, A4, A5, A7, A9) replay one GUI clock with `replayClock`. The stubbed `chooseMove` records its budget, and the clock falls by budget + 31 per searched move and by 0 per book move.
  - A4's book hits come from `START_BOOK`, through the real book probe.
  - A8's identity uses a constant `random` (0.5). Its seed's first draw is at least every blunder rate, so levels 1–4 also hand `chooseMove` the session's budget exactly. That budget is checked row for row against D4.1/D4.2, re-derived in the test (`oracleLevelBudget`).
  - A13 runs the real search. The injected clock queues `isready` at its 3rd reading inside the search, and the driver drains the queue in order, as `src/uci.ts`'s readline does.
- **A11 (ENGINE_DEEP):** a new `if (RUN_ENGINE_DEEP)` lane in `src/uci-session.test.ts`, in the `ABC-119` form (unset means not defined). It runs 5 fixed positions through the session at T on `Date.now`, asserts a wall < 22 500 ms each, and prints the max and its excess over 22 000. **Not run.**
- **A14 (opt-in real child): in `src/uci.real-engine.test.ts`, the existing `UCI_DEEP` lane.** This deviates from the ADR's D8 sentence "tests in `src/uci-session.test.ts` and its `ENGINE_DEEP` lane". D7/D9 name "the opt-in real-child lane", and that lane is this file. `src/uci-session.test.ts` cannot spawn the delivered entry point without a second spawn site. No new file was added. `runDialogue` now takes a script, so the file still has one spawn call site. **Not run.**
- **Re-pins (2):** `ABC-167 A1` and `ABC-171 A1` (the exact `uci` reply) gain the `TimeMode` line. The `ABC-171` row's title goes from 5 to 6 lines. The `Skill Level` line is unchanged.
