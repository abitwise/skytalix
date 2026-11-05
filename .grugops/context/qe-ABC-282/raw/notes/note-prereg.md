# qe-ABC-282 PREREG, sealed and committed before any game and before any QE run. A6 is 100 games at `d --tc 40/8` (40 moves in 8 SECONDS), W1 against main's merge-base, GAIN ≥ 50.0 / 100, estimated 30–45 min, so it runs. A miss is final: no re-play. A4 is the 5-game 40/15 check, estimated 3.3–3.7 h, over the 1 h line, so this hop does NOT run it: STOP and report, only the owner approves it

QE/E2E, task `qe-ABC-282`. Worktree `.claude/worktrees/qe-ABC-282`, branch `grugops/qe-ABC-282`, cut from `grugops/ABC-282` `7e4b1006`. Written before any game, timing read or offline read. It adds nothing to the bars and fixes the builds, commands, order, estimates and verdict rules.

## Builds
- **Candidate:** `04ebeb7e`, the Engineer's code commit, `src/` tree `d235214c`. The branch tip `7e4b1006` has the same `src/` tree.
- **Base:** the merge-base `22931005`, `src/` tree `845f5662`. `main` `6fa7ebae` has the same `src/` tree, so the base is `main`'s engine. `tools/rating` is tree `8f03fe47` on both this branch and `main`, with `ABC-300`'s `--tc`.
- **Production diff:** `src/engine.ts`, `src/uci-session.ts`. UAT is not waived.
- **Tools:** cutechess-cli sha256 `dc776901…f40a`, Stockfish `c78c22a9…52d2`, both read equal to `rating.ts`'s pins. `openings.epd` `0d7f7a72…`. The paths sit in a scratch file; no path enters a record.
- **Arms in `<scratch>`:** B = `git archive 22931005`, H = `git archive 04ebeb7e`, H2 = `cp -a` of H (`diff -r` clean), I = a copy of H with event pushes added by `raw/scripts/instr.py` (5 added lines, no decision changed; the driver checks that I's rows equal H's). Each arm leaves out `.grugops/context/*/raw/` and borrows `node_modules` by symlink. H's `src/` equals this worktree's.

## A6 (ticket A6; ADR-0071 D10; F7)
- **Command, the whole match in ONE `flock <scratch>/host-test.lock` hold, nothing else in it:** `node tools/rating/rating.ts d 04ebeb7e 22931005 <out> --tc 40/8 --rounds 50 --concurrency 1`. `--dry-run` printed both engines with `tc=40/8`, `timemargin=0`, `restart=on`, `option.TimeMode=uci-clock-mode`, `-repeat`, `-games 2`, `-rounds 50`, `-concurrency 1`, `-maxmoves 200`, `-debug all`. Nothing was built or started.
- **MET:** 100 of 100 complete, **0 losses on time by either side**, 0 faults, and a score **≥ 50.0 of 100**. Intent GAIN. The harness's `state:` label is not the verdict.
- **Below 50.0, or any loss on time or fault:** NOT MET, final (F7, F4). Not merged. No re-play, no margin, no change of form, no subset read.
- **A launch or harness error before the first game** is not a read: it is recorded, and the same command runs once more. Once a game has started, the read is the read.
- **Time estimate, from ADR-0071 D10, not SE's `ABC-300` note (QE-300-d):** `40/8` is 40 moves in 8 seconds. D10's model gives 22–24 s a game at 137.6 plies, about 40 min. Re-run on `qe-ABC-283`'s C2′ game lengths (100 games, mean 116.4 plies) with D2's budget formula, the model spends 9.6 s a side at full use, so about 31–32 min of play. The C2′ match shows engine starts add almost nothing. **Estimate 30–45 min, about 1 min of builds included.** The hard bound is 200 moves a side, 80 s a game, 2.2 h, which is not expected. Under 1 h, so it runs. If it overruns once started it is not killed, and the overrun is reported.
- **Reports (ticket, not bars), by `raw/scripts/a6-read.py` from `d.out`:** mean completed depth, the share of moves with `info string partial`, the clock left at each period end, each side's closest call, and each completed side-period's use. Period use at 40/8 is information. **It is not A4 and does not stand in for it.**
- **QE-300-a closes here:** `machine.txt`'s `control:` line and `cmd.txt`'s tokens, read from this real run.

## A4 (ticket A4; ADR-0071 D11; R-0071-1; F5): the STOP
- **What it is:** `ABC-223`'s protocol unchanged, 5 games at `tc=40/900` in `uci-clock-mode`, M1 (0 losses on time, closest call ≥ 500 ms) and M2 (≥ 75 % of each completed side-period, book included).
- **Time estimate:** `qe-ABC-223`'s run took **3 h 56 min** (08:54:19Z to 12:50:15Z), 5 games, 12 side-periods, at ≥ 99.88 % period use. W1 lowers that use. D11 forecasts about 85–95 %, which scales 3 h 56 min to **about 3.3–3.7 h**. EPIC-009 budgets it at ≤ ~5 h. Even one game is up to 4 side-periods, about 1 h.
- **Ruling:** that is over the brief's 1 h line, so **this hop does not run A4**. The brief says only the owner approves it, and no record holds his approval: `ADR-0071` D10's "under 1 h, not asked" is about A6 only.
- **No workaround.** The ticket says fewer than 5 games is not a reading, D11 argues no shortening, and the brief keeps a whole match in one hold. Five separate 1-game holds would be the same run in pieces, so that is not done.
- **Effect:** A4 stays `UNKNOWN - verify`, and QE names it as a blocking gap unless the owner approves the run and it reads MET. If A6 misses, A4 is moot, which is why the sub-hour read goes first.

## Offline, re-read independently (`raw/scripts/drv282.ts`; QE's own, from the ticket and ADR text)
Frozen or virtual clocks only, each part in its own process, under one hold (`offline.sh`).
- **A0-1, A0-2:** computed fresh on B and H; must equal each other, SE's `…aadd2d48` figures and, for A0-1, read the same with `softMs: 1`.
- **A0-3:** 6 rows byte-equal B to H, and D3's row must differ, showing `softMs` is handed in.
- **Every non-clock mode node-identical to main:** on all of K25, 19 session rows each (`level`, `simple-tournament`, `uci-clock-mode` with `movetime`, depth, nodes, mate and no own clock; `level`'s rate path by `Skill Level`), byte for byte B to H, plus 125 `chooseMove` rows with `softMs` absent. **One differing row is F1.**
- **A1 (c):** K25 by hash (`e41a4914…0479`, `63d88b2a…0570`), `virtualClock(1)`, H ∈ {25, 50, 100, 200, 400}, 125 rows. MET when the head's median share is strictly below the base's. Both are reported. The base column also comes from the merge-base build through A0's identity rows.
- **A1 (a), (b), as properties on those rows:** with T(d) the boundary reading, T(depth) ≥ soft means the head stopped with nodes = N(depth); T(depth) < soft means it started depth + 1. Any counterexample is F2. The committed rows must be green too.
- **A2 (a)–(c), D12:** arm I logs each root return and QE's oracle, from D12 item 2's words, re-derives the played move, score and `partial` on every aborted row. Any disagreement is F2. Committed rows green.
- **A3 (a):** every aborted head row has nodes equal to the base's and elapsed ≤ H + 1. **A3 (b):** 2 280 go lines (19 clocks × 6 `movestogo` × 5 increments × 2 sides, 0 ms to 2^31) against QE's D2/D3 oracle: budget, soft = budget / 2.3, ≤ 60 000, ≤ t − 1 100 except the 1 ms floor. Plus the deep lane's real-clock row.
- **b:** P1's method re-read on B by QE's driver. Information; SE sealed it before A1 (c).
- **A5:** `qe-ABC-283`'s `drv.ts` unchanged: mate floor rows equal B to H with 0 violations, zugzwang 7 / 7 at recorded depths, G1 none newly missed, B and H equal. Plus the null-move, PVS/LMR, bundle and puzzle deep lanes.
- **Gates (`lanes.sh`):** typecheck, lint, build exit 0; skip count 0; `test-skip-integrity` no findings; `npm test` green; `ENGINE_DEEP` engine and uci-session; R-281-a's four lines (4, 1, 1, 1 passed; a short count blocks); ABC-302's nine lines (1 passed each).

## Reviews, pin or bar
- **`ABC-221` A10:** read against `ABC-221` A10's text and ADR-0071. A pin if the row still reads the ceiling, the wall and the memory at the same 59 500 budget and the moved assertion is one W1 makes impossible. A bar if any `NFR-004` / `NFR-009` strength is lost.
- **D12 item 2's two readings:** read against D12's words. Readings 1 and 2 are counted by arm I on K25's 125 rows and, as information, on a wider K25 × 80 budgets (5–400).

## NFR-008 (ticket § NFR triggers; `…112cd856`, `…f30bd604`), graded with twin arms, ALONE
- `qe-ABC-283`'s `n8.sh` form, only the expected counts changed: B 71 files / 2 684, H and H2 71 / 2 709. ONE hold. Order rotates, round 0 discarded, until 8 complete scored rounds or 12 in all.
- **Twin admissible** when |median CPU delta H2 − H| ≤ max(1.5 % of H's CPU, 0.01 s) and the sign is at chance. Inadmissible: VOID, one re-read in a new hold.
- **The graded figure, fixed now since SE reported two:** the **paired** H − B median wall over complete rounds, `n8-grade.py`'s form and `qe-ABC-283`'s graded line. The difference of the two arm medians is reported beside it. **≤ +0.10 s is MET.** Over: the page sends the ticket back to the SE to move rows deep, which is a blocking gap and not a re-read.
- Reported against 10 s and 9.6 s. A grade over 10 s goes to the owner.

## Order and estimates
1. A6, one hold (30–45 min).
2. NFR-008, one hold (about 6 min).
3. Offline, one hold (about 15 min).
4. Lanes and gates, one hold each (about 15 min; the uci-session lane holds four searches of up to 60 s).

No single run here but A4 passes 1 h.

## Verdict rules
- **FAIL:** A6 NOT MET, or a defect in A0–A3 or A5 (F1, F2, F4, F6), or F3. Nothing merges.
- **PASS_WITH_GAPS, not signing UAT:** every read bar MET and A4 unread, or the lane over budget. By the 2026-10-22 ruling only PASS, or PASS_WITH_GAPS with no blocking gap, signs.
- **PASS or PASS_WITH_GAPS signing UAT:** only with A4 read and MET.
