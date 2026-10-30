# bapm-ABC-220-merge-fold: ABC-220 Done at ec1e835b; ADR-0044 D3, D4.5, D5, D11 folded; SEC-220-a pointer in ADR-0052; QE-220-a and SEC-220-b into ABC-221; ABC-222 and ABC-221 DoR 10/10, Ready

BA/PM, records only, at `main` `4ac4f3bb` (carries the `ABC-220` merge `ec1e835b` and the Security/NFR merge `18485bae`). No `src/`, `tools/`, `data/` or board edit. Nothing run, built, timed or played.

## Rulings
1. **ABC-220 closed.** Front matter `done` / `Done` with `closed:` (merge `ec1e835b`; QE PASS_WITH_GAPS `qe-ABC-220` `…7a09c5e1`, which signs UAT under Test note 3; Security/NFR PASS_WITH_RISKS, no required fix). A MERGED block records A1–A14 MET (A11 max 22 001.0 ms, A14b R1 0.38 ms, A12 9.69 s), the `NFR-004` text, `AR-NFR004-A` standing at 22 s, `AR-UCI-BUSY` placed, Test note 4's three owed items and each gap's disposition. A closing line sits under the DoR.
2. **ADR-0044, dated fold lines (ADR-0052 § Status amends list; Test note 4), only for what is in force at `ec1e835b`:**
   - § Status: the ADR-0052 pointer block gains one line naming the folds and what waits for `ABC-221`.
   - D3 `uci` row: the `TimeMode` combo line, two values; `var uci-clock-mode` at `ABC-221` only.
   - D3 `setoption` row: exact match against the frozen `TIME_MODES` tuple, the confirmed refusal text, not reset by `ucinewgame`.
   - D4: a new item 5 (D4.5): `C` (`safeClockShare`, `CLOCK_RESERVE_MS` 1 000, `CLOCK_OVERHEAD_MS` 100) and `simple-tournament`'s `min(x, T)` / `min(T, C)` / T, with T = `SIMPLE_TOURNAMENT_BUDGET_MS` = `SIMPLE_TOURNAMENT_CEILING_MS` = 22 000. D4.1–D4.4 govern `TimeMode level`. The clock-mode line is folded at `ABC-221`'s merge.
   - D5: ≤ one budget + `AR-NFR004-A` late in `simple-tournament`, ≤ 22 s read to the whole second (< 22 500 ms), no worker, `AR-UCI-BUSY`. ≤ 60 s waits for `ABC-221`.
   - D11: `Skill Level` governs only while `TimeMode` is `level`.
3. **SEC-220-a (re-routed to BA/PM by the brief):** `ADR-0052` § Consequences gains a dated pointer. The quoted `NFR-004` clause A reads ≤ 4 s since `ABC-228`'s merge (`e42b637b`, `ADR-0053` d10, `ADR-0045` FOLDED). The level-5 comparisons in § Status, D3 and the `AR-NFR004-A` bullet read the same way. No decision changes.
4. **ABC-221:**
   - **A12 (QE-220-a, LOW).** QE-A3a's four asymmetric-increment rows go in `src/uci-session.test.ts`'s `simple-tournament` A7 block. Each is `go wtime 10000 btime 10000 movestogo 10`, giving B `winc 0 binc 2000` → 2 800, B `winc 2000 binc 0` → 800, W `winc 2000 binc 0` → 2 800 and W `winc 0 binc 2000` → 800. The same four inputs in `uci-clock-mode` give the same budgets.
   - **Test note 5 (SEC-220-b, INFO).** BA/PM's call: fix the `milliseconds` comment, not the rule. No row.
   - **A11** is re-worded to A13 + A14a + A14b in the mode. The existing A14a row's option-line expectation moves with A1.
   - The `NFR-008` headroom line (QE-220-c) is added. Test note 4 gains the `ADR-0044` clock-mode halves.
   - **DoR 9/10 → 10/10, Ready.** Both waits are met: ADR-0052 is accepted and `ABC-220` is merged. Pull after `ABC-222` (owner: "later"). Size M (12 rows), P3.
5. **ABC-222: DoR 9/10 → 10/10, Ready.** Row 10's wait (`ABC-220` merged) is met by `ec1e835b`. A RE-SCORED block pins the build sha and records `ABC-220`'s overshoot reading (≤ 1.0 ms) for the PREREG. It also notes that these games are `AR-NFR004-A`'s next reading at 22 s, and that A1 already guards QE-220-f. A5 is unchanged.
6. **EPIC-009:** a header block records milestone 1 as half done (`ABC-220` Done; `ABC-222` pullable). The tickets table now shows row 1 Done, row 2 Ready 10/10 and row 3 Ready 10/10 (pull order only). The § Scope fold line is dated.

The front matter on `ABC-222` and `ABC-221` reads `ready` / `Ready`. Board moves and pull order are the Orchestrator's.
