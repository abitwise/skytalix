# arch-Q1-see-pruning PREREG: Q1 (SEE pruning of losing captures, quiescence and main search) on `main` `dc7dc15d` (`src/` tree `4cb84035`: E1 taper and the ABC-274 packed blend, futility in force): instrument, three forms, the premise (pay) gate, the safety gate, the choice rule, the bar-derivation rules and the verdict rule, sealed and committed before any measured run

Architect/Design, task `arch-Q1-see-pruning`, on `grugops/arch-Q1-see-pruning` from `main` `dc7dc15d`. ADR id: **`ADR-0069`** (`arch-ABC-270` writes `ADR-0068` in parallel; this task takes the id after it, per the brief). Inputs: brief `.grugops/queue/claimed/arch-Q1-see-pruning.md` (Orchestrator, 2026-11-03T20:07:55Z); owner `Q-3K-9` YES (`orch-2026-10-30a` `…af126c04` item 6: "`ADR-0024` d4 opened for design of Q1; design only, build on its own evidence"); `ADR-0065` (decision 2 `see`; § Diagnostics, the Q1 diagnostic, not pre-registered); `ADR-0024` d4; `ADR-0056` row Q1 and C2′; `ADR-0061` (instrument, cut audit); `ADR-0064` (B0 counts on E1). **No measured run has been made in this hop.** The patch was applied to a scratch copy and the modules imported once (a load check: no search run, no count read).

## Instrument
- Base: `git archive HEAD src package.json` at `dc7dc15d` into a scratch directory outside the repository (deleted after).
- `patch_q1.py` (this task's `raw/probe/`), knobs in a scratch `Q1` record in `quiescence.ts`:
  - `see(position, move)` and `isLosingCapture(position, move, margin)`: `arch-ABC-234`'s `patch_234.py` code, unchanged (swap list on the target square, least valuable attacker each step, x-rays through captured squares, pins ignored; values 100 / 320 / 330 / 500 / 900, king 20 000). A capture is **LOSING** iff it does not promote, the mover is not the king, the victim is worth less than the attacker, and `see < −margin`. En passant (P×P) and any capture of an equal or bigger piece never are.
  - **Quiescence rule (`q`):** out of check (a node that stood pat), a LOSING capture (margin `qMargin`) is skipped before it is made. In check every evasion is searched, as today. With `qCheck`, a capture that gives check is never skipped.
  - **Main-search rule (`m`):** at a node that is not the root, has a null window, remaining depth 1..3, alpha and beta strictly inside ±20 000 (the mate band) and the side to move not in check (futility's node guards without its evaluation clause), a move at index ≥ 1 that is a LOSING capture with `see < −100 × depth` and gives no check is skipped. A skipped move keeps its index (futility's rule). The first move (the hash move when there is one) is never skipped. Both recursions.
  - Counters and an audit mark (scratch only). With every knob off the scratch search is `main`, node for node.
- Driver: `probe.ts` (this task's `raw/probe/`), `arch-ABC-234`'s shape with the LMR/PROBE parts removed. Modes: `seecheck`, `nodes`, `reach`, `fire`, `drift`, `mate`, `zug`, `g1`, `qaudit`, `maudit`.
- Every batch under `flock <host-test.lock> timeout 1800` (≤ 30 min a run), every job `timeout 600`, **one job at a time**. Deterministic counts only: fixed depth; `chooseMove` with `maxDepth` / `maxNodes` on a frozen clock; `G1` on its virtual clock. No timing is read. Hop total ≤ 2 h of runs.

## Instrument checks (not bars; a miss is fixed in the instrument and explained before any gate is read)
- **SEE:** `see < 0` and LOSING on all 24 `HANGING_CORPUS` losing moves, and six hand rows exact: undefended pawn +100; CPW x-ray row −220; Q×P defended by a pawn −800; R×R recaptured, x-ray queen, king takes queen **0** (`ADR-0065`'s corrected value); N×N defended 0; B×N defended by a pawn −10.
- **The door** (every knob off) reproduces E1's recorded counts (`ABC-269` B0, `ADR-0064`): `search()` d8 **839 514 / 1 533 901**, `chooseMove` d8 **1 296 788 / 404 930** (kiwipete / position-6), and reach **5.879** at 47 000 on the 190 (`ADR-0064` form L). ABC-274 is value-identical, so these are expected exactly; a mismatch is explained before any gate is read.

## Candidate forms (pre-registered; read in this order)
- **QS** quiescence rule, margin 0, no check exemption. Main rule off. (The `arch-ABC-234` diagnostic shape, now pre-registered.)
- **QSc** as QS, but a capture that gives check is never skipped.
- **QSM** QS plus the main-search rule (depth 1..3, `see < −100 × depth`, gives no check, index ≥ 1).

## The premise (pay) gate — each form
- **(P1) nodes:** fixed depth 8 on kiwipete and position-6, `search()` and `chooseMove`: **≤ 0.95×** the door's on each of the four readings.
- **(P2) reach:** mean completed depth at 47 000 nodes on the 190 (+ 6 endgames), `chooseMove` `maxNodes` on a frozen clock: **≥ door + 0.10 ply**.
- Both must hold. Stated expectation (not a gate): the diagnostic on the older `main` read 0.22–0.68× and +0.884 ply.

## The safety gate — each form
- **Drift** at depth 5 on the 190 (+6), both recursions, head against the door: **≥ 90 % of non-mate scores within 25 cp, none beyond 150 cp, 0 mate sign changes.** Why looser than `ADR-0065`'s 95 % / 75 cp: Q1 changes values by design (the diagnostic read 96.26 %, max 69 cp); this bar is a defect net (a sign error in `see`, a prune in check, a pruned promotion read piece-sized, ≥ 300 cp, on many rows), not a strength bar. Strength is C2′'s.
- **Mate floor** on the 287 at the **same depth**, door d5 → head d5 (`search()`): **0** violations (a door mate the head does not score as a same-sign mate). d4 → d5 is a report.
- **Zugzwang:** `ADR-0050` d9's seven rows at their recorded depths: **7 / 7** (hard).
- **`G1`:** **≥ 54 / 58 with no NEWLY-MISSED line.**
- The audits (`qaudit`, `maudit`) are information only; `ADR-0061`'s bars (≤ 0.5 % flips, 0 errors ≥ 200 cp) are quoted for scale. Why not a bar: SEE misjudges pins and overloads by construction, so a quiescence prune makes some window-relevant errors; the instrument is calibrated for main-search cut verdicts, not quiescence. C2′ decides strength.

## Choice rule
Among forms passing both gates, the largest reach gain at 47 000. A form within **0.05 ply** of the best goes to the earlier form in the order QS, QSc, QSM (the main-search rule must earn its code).

## Bars `ADR-0069` writes for the chosen form (derived by these rules, fixed now)
- **Pay (a):** d8 four readings ≤ min(0.95, ⌈100·(max of the four + 0.05)⌉ / 100).
- **Pay (b):** reach ≥ door + max(0.10, ⌊20·0.7·gain⌋ / 20).
- **Drift:** ≥ max(90, ⌊lower of the two measured within-25 shares⌋ − 2) % within 25 cp; none beyond min(150, max(25, ⌊1.5 × the larger measured max⌋)) cp; 0 sign changes.
- **Mate floor:** same depth, 0. **Zugzwang** 7 / 7. **`G1`** ≥ 54 / 58, no NEWLY-MISSED.
- **`G2`:** `src/evaluate.ts` and `src/evaluate-params.ts` byte-identical to base (Q1 does not touch the evaluation); not re-read. If either is touched, `G2` is read by its rule.
- **`G6` / `NFR-005`:** by its rule at each build's `LEVELS[5]` (4 000 ms): 5 runs per board, any run below depth 6 FAILs, depth 7 a WARN, "≥ base" graded by the median (a search ticket; `Q-3K-4` (b) covers evaluation tickets only).
- **The read (`ADR-0056` C2′ as folded):** 100 games at 100 ms against the merge-base, intent **GAIN, ≥ 50.0 / 100**; S′ at E 1 810; the Levels deep lane exit 0. Q1 fires at 100 ms (the reach gain is read at the 100 ms node budget), so NEUTRAL "invisible at 100 ms" is closed to it.
- `NFR-009`: the SEE scratch bytes are summed (`ADR-0065` d2's ~256 B).

## Reports (not bars)
- `fire` at depth 6 over the 190 (+6), `search()`: quiescence moves that are LOSING captures on the door, their refuted share and the nodes under them; the head's pruned counts (quiescence and main).
- d7 nodes (kiwipete, position-6); d8 on position-4 / position-5 / startpos; reach at 20 000; `qaudit` (every 50th pruning quiescence node, d6) per form; `maudit` (every 10th main-rule node, d6) for QSM; mate floor d4 → d5.

## Verdict rule
- **A form passes both gates:** `ADR-0069` is written PROPOSED for it, with the bars above, intent GAIN, a test-only off-door pair (`ADR-0026` d10), file list, test rows, falsifiers and effort. It also records that it amends `ADR-0024` d4 (SEE leaves the quiescence fence), which the owner's acceptance carries.
- **No form passes:** `ADR-0069` is written PROPOSED with "premise not met on `main`" (the `ADR-0063` / `ADR-0065` / `ADR-0066` pattern), the failed gate(s) named; no form is tuned after the read; the recommendation is park.
- Anything run after the gates are read is labelled DIAGNOSTIC and cannot change the verdict. A miss is never re-played.
