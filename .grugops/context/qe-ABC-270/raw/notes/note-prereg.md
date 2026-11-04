# qe-ABC-270 PREREG, sealed before any QE timing of `ABC-270`'s build: K3 (`G2`) in two sessions, one process each, in `ABC-274`'s form (`ADR-0067` d8's A5 instrument: two sessions, reverse order, a `main`-copy control); and K4 (`G6`, graded "≥ base", every run at depth ≥ 6). MET iff R ≤ 1.0500 unrounded. No bar moved; a miss is `ADR-0068` F2 and is never re-played

QE/E2E, task `qe-ABC-270`. Written after the arms were extracted, and before any QE timing reading of the build. The Engineer's pre-reads (`se-ABC-270` `…15cac083`: R = 0.9899 with the host not ALONE; `G6` with the Tctl wait relaxed to 75 °C) are known to QE. They grade nothing, and nothing below is chosen or tuned from them: the instrument is `qe-ABC-274`'s PREREG `…4b732a08`, as written there, less its P arm. Sources, cited not restated: ticket `ABC-270` K3 / K4 and its falsifier table; `ADR-0068` d6 and F2; `ADR-0067` d8 (A5) and `qe-ABC-274`'s PREREG.

## K3 (`G2`, ≤ 1.05 ×)
- **Arms**, all imported into **one** `node` process per session, each from `git archive` into its own scratch dir (deleted afterwards):
  - **B, the base:** `main` `4b9c5357`, `src/` tree `4cb84035` (the tree K0 and `ADR-0068` name; `main`'s `src/` has not moved since the cut). Entry: `evaluateAtPhase`.
  - **C, the control:** the same tree, a second dir. Entry: `evaluateAtPhase`.
  - **H, the graded arm:** `grugops/ABC-270` code commit `795a6b61`, `src/` tree `0f393c18` (= the branch tip's). Entry: `evaluateAtPhase`.
- **Instrument (`qe-ABC-274` `g2.ts`, P removed):** the six perft roots; N = 200 000 calls per root per round; 6 rounds. **Round order in words:** rounds 2, 4 and 6, counted from 1, reverse the session's arm list; round 1 is the dropped warm-up. Each arm's statistic is the mean over rounds 2–6 of its mean over the six roots, in ns per call. Every arm is called `ev(position, phase)` with `phase = phaseOf(root)` (H's), computed once per root before timing; a running sink.
- **Session order:** session 1 lists **[B, C, H]**; session 2 lists **[H, C, B]**.
- **Statistic and verdict:** r_s = mean(H) / mean(B); **R = (r₁ + r₂) / 2; MET iff R ≤ 1.0500**, compared unrounded, printed to 4 dp. No third session, no tie-break.
- **Void rule, on C alone:** c_s = mean(C) / mean(B) outside **[0.970, 1.030]** voids that session. It is re-run once, in its own recorded window, in the same order. A second void in the same slot is a **STOP to Architect/Design** with every reading attached: no K3 verdict and no further session.
- **Nothing else voids, adds or drops anything:** no load threshold, no extra session or round, no dropped root, round or outlier, no re-read after a verdict.
- **The spread, a report (grades nothing):** each r_s, |r₁ − r₂|, and each arm's per-round min–max over rounds 2–6, against `qe-ABC-269`'s reference spread **0.037** in r. If |R − 1.0500| ≤ 0.037 the verdict line adds "within one session spread". MET stays MET; a miss stays a miss.
- **Host, per session:** one `flock <scratch>/host-test.lock` hold per session (the G2 run and its nps report together); one core. Recorded at the start and the end: `date -u`, `uptime` (load1), the top five CPU users (`ps`), Tctl; plus `node --version` and the trees. A foreign process that is not a test, build, engine or game run (for example `abtop`) is recorded and never touched; it voids nothing.
- **S2 nps (ruled report-only, `…401c3d09`; never grades):** right after each session, in the same lock hold: `chooseMove` to depth 8 on a frozen clock, kiwipete and position-6; arms H and B; 3 rounds alternating, round 1 dropped; ns per node and H / B. Node counts are printed; H's and B's must equal K0 (1 296 788 / 404 930); a mismatch would be a K0 defect, reported as such. Beside it, nodes per ms at 4 000 ms from K4's own runs.

## K4 (`G6`, graded "≥ base"; `NFR-005`)
- **Instrument:** `qe-ABC-268`'s `g6.mjs` / `timed.mjs` / `host.mjs`, **unchanged** (byte-compared with `qe-ABC-268/raw/qe-scripts/`), `g6` mode only: 5 interleaved rounds; each a kiwipete pair then a position-6 pair; base first in odd rounds, head first in even; one fresh plain `node` process per search at `LEVELS[5]` (`timed.mjs` refuses unless `LEVELS[5].budgetMs` = `DEFAULT_BUDGET_MS` = 4 000 and blunder rate 0); wait-clear before every read (0 vitest, 0 cutechess-cli, load1 ≤ 2.0, **Tctl ≤ 60.0**); thermal stop at a session median Tctl > 85.0. Width 1. One lock hold, after K3.
- **The cool-down is not relaxed.** If the host does not cool: a precondition timeout (exit 3) or a thermal stop (exit 9) gives **no K4 reading**, and QE stops and reports it (K4 `UNKNOWN - verify`); QE may also stop a session that has waited more than 20 min on one read, with the same disposition. A new window then needs a new sealed dated line before it runs.
- **Builds:** base = B's tree (`4cb84035`); head = H's tree (`0f393c18`).
- **Graded:** each board's median completed depth for head **≥ base's**; **every head run at depth ≥ 6** (FAIL below); a head run at depth 7 or below is a WARN. Reported: medians of nodes, the moves, `ms`, load1 and Tctl per read; `qe-ABC-274`'s `grade-g6.mjs` computes the grade.

## Outcomes, written before the reading
- **K3 MET and K4 MET:** QE completes the independent re-checks (K0 and the cross-build, K1 (a)–(e) with the literal-FEN line, K2 with the deep lanes, mutants on a scratch copy) and gives the verdict.
- **K3 NOT MET or K4 FAIL:** `ADR-0068` **F2: STOP to Architect/Design.** One value-identical cut, then one re-read of the bar that missed, under a new PREREG sealed before it. No re-play here, no bar moved. QE still reads the other rows for the Architect; the verdict is FAIL.
- **A double void, or no K4 reading by a host fault:** no verdict on that row; the verdict says so.

## Order
K0 and the K1 reads are deterministic and untimed, and may run before K3. Then K3 session 1, session 2, then K4, each in its own lock hold, ALONE as far as QE's own runs go (the lock is shared with `qe-ABC-279`). Then `npm test`, the deep lanes, the mutants. Any single run forecast over 1 h: stop and return the question (forecasts: each `G2` session with its nps ≈ 1 min; K4 ≈ 6–7 min).
