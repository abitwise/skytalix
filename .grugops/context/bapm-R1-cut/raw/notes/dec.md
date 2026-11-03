# bapm-R1-cut: **`ABC-275` cut, S, P2, DoR 10/10, Ready.** `tools/rating/rating.ts r` accepts `--budget-ms 100` (skytalix `st=0.1` / 50, Stockfish `st=0.1` / 2 000); at 100 ms `--elo` above 2 600 is refused; every other argv, default, pin and dry-run print stays byte-equal; 0 lines under `src/` / `data/`. **`ABC-273` (R1): DoR row 10 ✅ → 10/10, held in Backlog until `ABC-275` merges.** EPIC-011: R1–R3 / G2 ruled (100 ms), S′ pool row at E 1 810 copied (7.0 / 10, no step), `ADR-0064` in force; `ABC-274` A5 cites `ADR-0067` d8's dated line. No bar moved

BA/PM, task `bapm-R1-cut`, records only, on `grugops/bapm-R1-cut` from `main` `30d15584`. Nothing run. Pages commit `5a5bc897`.

## ABC-275 (new)
- **Source:** `arch-post-269` decision `…8136b589` § 2 (the change), observation `…1fa63931` item 2. `ABC-255` item 2 narrowed to `r`; `rpair` and `d` untouched.
- **Why it exists:** read, not run, at `30d15584`: `r --budget-ms 100` throws "r takes only 500" (`rating.ts` ~826), and `cutechessArgs` fixes Stockfish at `st=0.5` (~427). `pair-check.ts` line 421 asserts the refusal.
- **Acceptance (all offline):** A1 R1's dry-run vector compared whole (`--elo 1810 --budget-ms 100 --rounds 100 --concurrency 1`); A2 byte-equal prints for `r` (no flag, 500), `d` (default and 3 000 … 1 000, 100), `rpair`, existing rows unedited except the one refusal row; A3 refusals (other `r` budgets, `--elo 2601` / `3190` at 100, `d` 500, `rpair` flag); A4 the edge (2 600 and 1 320 accepted at 100; 2 601 / 3 190 still accepted at 500 and 4 000); A5 0 lines under `src/` / `data/` / `vitest.config.ts`; A6 R1's `cmd.txt` and `machine.txt` `control:` line name both sides' control (read at R1, no offline row, as `QE-255-a` was declined); A7 gates green, 0 lane rows.
- **Priority P2, not the Architect's P3:** the Orchestrator's brief sets P2 because it gates R1 and R1 goes before the next value-changing merge. Recorded on the page.
- **Size S** (low end; brief allowed XS / S).

## ABC-273 (R1)
- Front matter `adr:` names the ruling. DoR row 10 ✅ (`…8136b589`). Scope 2's `UNKNOWN - verify` struck and the exact command written (both env vars, `--concurrency 1` written out, E 1 810 start confirmed by QE at PREREG).
- R1-A2: the command as run shows both variables set (paths redacted); R1-A3: host 0.4–0.9 h (estimate), asked if QE's PREREG estimate > 1 h or the band rule steps E (the second run asked first).
- Dependencies: `ABC-275` merged (hard); placement before `ABC-239` / `270` / `271` / `272` (the Orchestrator's ruling, not a hard dependency). **DoR 10/10; status stays backlog** until `ABC-275` merges (the Architect's line, `…1fa63931` item 1).

## EPIC-011
- New top block. § Phases: R1 row (ruled; `ABC-275`), R2 / R3 rows re-pointed to C4's 100 ms reading, E1 row `ADR-0064` IN FORCE. G2 row: the reading shape and the claim rule; no longer waits on a ruling, targets stay *[proposed]*. The owner-answers "Still open … R1–R3" item marked ruled. § Tickets row 25 (10/10, held on `ABC-275`), new row 27 (`ABC-275`), ids line. § Close-out S′ pool: the Architect's figures copied (E 1 810: 7/3/0, 7.0 / 10 = 70.0 %, < 30 games, no step; ≥ 19.0 / ≤ 10.5 of next 20 at 30). § Owner questions `ADR-0064` row. § Dependencies: `ABC-275` → `ABC-273`, before the next value-changing merge.
- E1 Done was already recorded by `bapm-269-done` (checked; only the in-force line added).

## ABC-274
- New top block and a dated sub-list under A5 citing `ADR-0067` d8's line of 2026-11-03: the PREREG is sealed by QE before timing and states the bar / statistic (R ≤ 1.0500, unrounded, two sessions), arms, void band, the session spread as a report against 0.037 ("within one session spread" grades nothing), and the round order in words (rounds 2, 4, 6 counted from 1 reverse). Status Ready, DoR 10/10 unchanged.
