<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: bapm-R1-cut

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-03T12:47:52Z | decision | ba-pm | high: every figure is copied from the Architect's sealed arch-post-269 notes (…8136b589, …ee31f3ee, …3f30baf8, …1fa63931) or read in tools/rating/rating.ts and pair-check.ts at 30d15584 (read, not run); pages diff 5a5bc897; no bar moved; priority P2 is the Orchestrator's brief over the Architect's P3, recorded |  | # bapm-R1-cut: **`ABC-275` cut, S, P2, DoR 10/10, Ready.** `tools/rating/rating.ts r` accepts `--budget-ms 100` (skytalix `st=0.1` / 50, Stockfish `st=0.1` / 2 000); at 100 ms `--elo` above 2 600 is refused; every other argv, default, pin and dry-run print stays byte-equal; 0 lines under `src/` / `data/`. **`ABC-273` (R1): DoR row 10 ✅ → 10/10, held in Backlog until `ABC-275` merges.** EPIC-011: R1–R3 / G2 ruled (100 ms), S′ pool row at E 1 810 copied (7.0 / 10, no step), `ADR-0064` in force; `ABC-274` A5 cites `ADR-0067` d8's dated line. No bar moved |
| 2026-11-03T12:47:52Z | observation | ba-pm | high: each brief item checked against the pages before (30d15584) and after (5a5bc897); open items are routing, not findings; board read only |  | # bapm-R1-cut: open items after this hop. **Orchestrator:** place `ABC-275` (Ready) and then `ABC-273` before the next value-changing merge; move `ABC-273` to Ready when `ABC-275` merges (or queue a records hop); decide whether `ABC-273`'s P3 should rise to match the placement ruling (left at P3 here, the brief did not ask). **Architect:** none owed. **Owner:** nothing new; `ADR-0067` acceptance, Q-3K-6, Q-3K-7 (a)/(b)/(c), Q-3K-8, Q-3K-9, B-T8 stay pending |
