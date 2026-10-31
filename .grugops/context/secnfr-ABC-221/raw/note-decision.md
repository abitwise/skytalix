# Security/NFR decision, secnfr-ABC-221: gate PASS (PASS_WITH_RISKS). No required fix; NFR-004's 60 s clause placed and clause B's raw-call bound moved 32 s → 60 s on the owner's Q5; AR-NFR004-A re-accepted at 59.5 s; AR-UCI-BUSY holds exactly at ≤ 60 s

Records only, on branch `grugops/secnfr-ABC-221` from `main` `2c0f7ee9`. The code under review is `grugops/ABC-221` `c48a6f83` (base `d58f2d77`), read with `git diff` and `git show`. The SE's sealed notes are on `fb3696fa`. The catalog commit is `787820c3`. Nothing was run, built or timed, because QE holds the host alone. The full text is in the last section of `plans/nfr-catalog.md`.

## Result: PASS (the role's PASS_WITH_RISKS; ASVS L1, `block_on: high`)
- **Required fixes: none.** No finding is high.
- **Conditional on QE.** The real-clock lines rest on the SE's one `A10` run. The result reopens if QE's `A10` re-run reads a wall over 60 000 ms or a memory growth over 1 MiB, or if QE's `A14b` in the mode reads R1 over 100 ms. `NFR-008` is QE's `G8` and the Orchestrator's watch.

## Security (ASVS L1)
- **V2.2.1 MET.** `TIME_MODES` gains `uci-clock-mode` and is still frozen. The value is still selected by `TIME_MODES.find((mode) => mode === value)`, an exact match with no object key read. A refused value keeps the old one and is echoed only through `info` → `printableOf`.
- **V2.1.1 MET.** The `combo` line and the refusal text are spelled from the tuple.
- **No new input class.** The `go` numbers still go through `milliseconds` and `positiveInteger`. In the mode every branch is bounded by 59 500:
  - `movetime x` → `min(x, 59 500)`;
  - a clock → `min(59 500, C)`;
  - no time token → T (22 000).
  - +Infinity goes to the cap. −Infinity, a negative figure, or NaN (+Infinity clock with −Infinity increment) goes to C's floor or the engine's depth 1.
  - `milliseconds` cannot return NaN by itself.
  - The engine's 60 000 clamp is the backstop. Read from the code, not run.
- **Levels are value-identical.** Every level budget is ≤ 30 000 under both clamps. `src/levels.ts` is byte-identical.
- **`ADR-0036` clause (b), read, not run.** The added production lines hold 0 capability tokens. `package*.json`, `vitest.config.ts` and `AGENTS.md` are untouched. The instrument itself is `UNKNOWN - verify`.
- **One new test child, `ENGINE_DEEP` only** (`A10`). It uses no shell, an argument array, and a script built from fixed constants. It is synchronous (`ABC-173` `C2`), bounded at 330 s, and spawns 0 in the default lane.

## Catalog, before → after (`787820c3`)
- **`NFR-004` Target:** "…(budget 22 s)." becomes "…(budget 22 s); 60 s in UCI `TimeMode` `uci-clock-mode` (budget ≤ 59.5 s). The engine's one clamp sits at the largest ceiling in force, 60 s."
  - That is `ADR-0052` § Consequences verbatim, a pure insertion.
  - A dated line quotes the owner's Q5, "5. increase to 60s" (`orch-2026-10-29g` `…a67f71ac`), and his acceptance with D4 and D6 as written (`…3dd61448`).
- **`NFR-004` mechanism:** two dated notes say the 32 000 clamp is true until `ABC-221`'s merge. A new line covers the mode: its cap of 59 500 holds every branch, with a 500 ms margin. **Clause B's bound on a raw `chooseMove` call moves from 32 s to 60 s, by the owner's Q5.** No surface hands the engine more than 59 500.
- **`NFR-004` Verified by:** MET on the budget handed (`A7`: 59 500 / 59 500 / 5 000 / 22 000 / 22 000). MET on the real clock on the SE's reading (`A10`: 59 499.5–59 501.1 ms, max +1.1 ms, at least 498.9 ms under 60 000). `UNKNOWN - verify` until QE's re-run.
- **`NFR-009` Verified by:** MET at 59.5 s on the SE's reading. `heapUsed` grew ≤ +0.12 MiB, `arrayBuffers` grew 0 and reads 4.51 MiB (≤ 16 MiB), and the max depth was 13. Pending QE.
- **`AR-UCI-BUSY`:** one dated bullet (below).
- **Unchanged:** `NFR-001`–`NFR-003`, `NFR-005`–`NFR-008` and `NFR-010`–`NFR-012`, each hashed per row (sha256) before and after. `NFR-004`'s ID, Category and Applies to cells are unchanged, and so is `AR-NFR004-A`'s blockquote. The edited lines were checked as pure insertions.

## Accepted risks
- **`AR-NFR004-A` at 59.5 s: STANDS, re-accepted with its number. Owner: Security/NFR.**
  - In this mode the budget sits 500 ms under the ceiling, about 16× the ≤ 31 ms bound. So the risk covers only the overshoot past the budget, not past the ceiling.
  - The SE's `A10` read +1.1 ms max over 3 calls (0.002 %), which is not materially worse.
  - The sample is thin: 3 calls, one run. A stall over 31 ms would be a new question, still about 470 ms inside 60 s.
  - The raw-call residual past 60 000 is not read (`UNKNOWN - verify`), and no surface reaches it (`SEC-221-a`).
  - The next readings are QE's `A10` and then `ABC-223`.
- **`AR-UCI-BUSY` at ≤ 60 s: HOLDS EXACTLY. Owner: Architect/Design** (`ADR-0044` D5's worker triggers).
  - The bound's worst case is 59 500 + ~31 + 100 ≈ 59 631 ms, under 60 000, so no whole-second reading is needed.
  - The worst case read is ≈ 59 501.1 ms plus the drain in this mode. QE's `A14b` gives the drain (pending).
  - Order and count: `A11` rows 1 and 2 (`UCI_DEEP` 4/4, in the SE's run).
  - In this mode the busy-reading trigger reads ≥ 60 000 ms. The GUI trigger is unchanged: cutechess pings only between moves, and other GUIs are `UNKNOWN - verify`.

## `SE-221-b` (opinion; the ruling is the Architect's)
- **No security or NFR risk.** The child is the `ABC-081` `A7` / `NFR-009` instrument (`src/transposition.test.ts`, `ENGINE_DEEP`) in the same form. It is not the delivered entry point.
- What D8 guards still holds: no new file, no delivery file, `src/uci.ts` spawned only by `runDialogue`, and 0 default-lane spawns.
- But D8's 2026-10-30 words "has no spawn site" are now false of `src/uci-session.test.ts`. So D8 needs a dated line either way (`SEC-221-b`).
- **Security/NFR prefers keeping the row:** a pinned, repeatable vitest instrument is better than a one-off hand reading. Moving it is test-only and would not change this result.

## Owner
- **No new owner item.** Both levels that moved (the 60 s clause and clause B's 60 s raw-call bound) are his Q5 words, as `ADR-0052` § Consequences words them. No other NFR level was moved.

## Next
- The Orchestrator: `ABC-221` → Ready for UAT once QE's verdict is in. The QE verdict signs UAT (test note 3). If QE's readings contradict the SE's, this gate reopens on the lines named above.
- The merge is a human's. The merge folds are listed in test note 4 (BA/PM) and the `AGENTS.md` lines (the Scribe).
