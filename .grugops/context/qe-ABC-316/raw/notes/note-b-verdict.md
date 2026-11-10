# qe-ABC-316 stage B verdict, read once per PREREG `…c80a1080`. **L1: VALID, 147.5 / 200 (73.75 %) at E 1 320, inside the band: E is confirmed and L1's figure is X = 1 499.5 ± 53.4.** **L2: VALID, 164.5 / 200 (82.25 %) at E 1 450, ABOVE the band (outcome 3): X = 1 716.4 ± 64.3 is "outside the band; not the level's figure".** An upward step to E′ 1 720 is allowed only on the Orchestrator's word. QE stopped, and the question is returned. No step was run

QE/E2E, task `qe-ABC-316`, stage B. Both levels ran once under one hold of the host lock, 15:54:24Z–17:20:58Z, with the host ALONE. Runs, host and records: the stage B readings observation `20261110T172335Z-qe-e2e-observation-659eb162`, sealed just before this note. This is a reading, not a merge gate. Raw: `raw/out/l1-e1320/`, `raw/out/l2-e1450/`, `raw/out/session-*/`.

## The figures, on the README Strength section's scale: "Stockfish 19 `UCI_Elo` E, skytalix at level L (`Skill Level` L, `st` = the level's time, `timemargin` 50), Stockfish `st` the same, this host"

| | L1 (`st` 0.1 s, E 1 320) | L2 (`st` 0.18 s, E 1 450) |
|---|---|---|
| W / D / L (skytalix) | **142 / 11 / 47** | **164 / 1 / 35** |
| points / score | **147.5 / 200 = 73.75 %** (White 72.0, Black 75.5) | **164.5 / 200 = 82.25 %** (White 83.0, Black 81.5) |
| Elo Δ against E (`cutechess-cli`) | **+179.5 ± 53.4** (LOS 100.0 %) | **+266.4 ± 64.3** (LOS 100.0 %) |
| X = E + Δ ± Y (the tool's state line) | **1 499.5 ± 53.4** (1 446–1 553) | **1 716.4 ± 64.3** (1 652–1 781), **outside the band; not the level's figure** |
| opening-cluster interval | ± 53.9 (iid ± 52.9) | ± 69.0 (iid ± 62.9) |
| band outcome (PREREG) | **2: E confirmed; X is L1's figure; no step** | **3: an upward step is allowed, on the Orchestrator's word** |
| validity | **MET** | **MET** |
| wall (`r`) | 36 min 37 s | 49 min 56 s |
| host | ALONE (217 samples) | ALONE (296 samples) |

## Validity, per the PREREG's six bars (each level)
- 200 of 200 games, with 200 results in the PGN.
- `faults: 0`, `unclassified: 0`.
- skytalix loses **0 on time**: max latency 105 ms at L1 (margin 150) and 184 ms at L2 (margin 230); 0 moves over `st` + 10. Stockfish also had 0 time losses.
- Depth guard: L1 `0 of 10813 moves below depth 1`, L2 `0 of 8360 moves below depth 2`.
- State `rating`, not UNRESOLVED. Neither THERMAL nor RUNAWAY fired.
- Record check passed: the control line byte-equal, the level tokens in `cmd.txt`, `Skill Level L` and `UCI_Elo E` in 200 of 200 processes with a `go`, 0 missing or other.
- **No skytalix fault and no product finding at either level.**

## The band rule, applied as sealed (`ABC-204` A4, `ADR-0056` D5 item 4)
- **L1:** P = 147.5 lies inside 50.0–150.0, so this is outcome 2.
  - **E 1 320 is confirmed, and X = 1 499.5 ± 53.4 is L1's figure.** No step.
  - It is 2.5 points under the upper edge. The one move-cap draw gave skytalix 0.5 of them; without it P = 147.0, still outcome 2. The rule is the sealed one; nearness to the edge changes nothing.
- **L2:** P = 164.5 is above 150.0, so this is outcome 3.
  - This run's X = 1 716.4 ± 64.3 is reported, labelled **"outside the band; not the level's figure"**.
  - **The step, if ordered:** one new 200-game run at E′ = E + Δ = 1 450 + 266.4 = 1 716.4, rounded to 10: **E′ 1 720**, inside the 1 320–3 190 clamp. The same command with `--elo 1720` and everything else as sealed. It is a new run, so it needs a PREREG line for E′.
  - **Time:** an estimate of about 50 min (45–90 min), from this run's 83.9 plies a game at 0.18 s. A stronger Stockfish may lengthen games (**UNKNOWN - verify**).
  - It needs **the Orchestrator's word**. The owner's W at the go block held "for these games only", so the host word for a step is his to ask.
  - **QE did not run it and stopped.** Not pre-approved (the go block's Band step line).
- **Re-runs:** none. A clean reading is never re-played, and the two levels are not pooled.

## Reported, not graded
- **L2 − L1** = 1 716.4 − 1 499.5 = **+216.9**, with L1 at ± 53.4 and L2 at ± 64.3. Combined in quadrature that is about ± 84, so the difference lies at about +133 to +301.
  - L2's X is outside the band, so this difference is provisional until a step or the Orchestrator's ruling.
  - Stockfish has 180 ms at L2 and 100 ms at L1. Its strength at a given `UCI_Elo` may move a little with time (**UNKNOWN - verify**). So part of the difference may be scale, not skytalix.
- **Against the PREREG's expectations, both read stronger than the README's projections.**
  - L1 is projected at 1 000–1 300 (expected 13.7–47.1 %) and read 73.75 %, X 1 499.5.
  - L2 is projected at 1 300–1 550 (29.7–64.0 %) and read 82.25 %, X ≈ 1 716.
  - The PREREG named this possibility: a blunder plays the strict second-best root move, often close to the best. That is an inference, not a measurement of the blunder penalty.
  - For `ABC-316` A4 (README), the L1 figure stands as measured. L2's figure waits on the step or the Orchestrator's ruling.
- Draw rates are low: L1 5.5 %, L2 0.5 %. Plies a game: L1 mean 108.4 (median 79); L2 mean 83.9 (median 73).

## Acceptance (QE's reading; the cut note `…20c41f8c`)
- **A3, stage B, "one figure per level":**
  - **L1 MET**: 1 499.5 ± 53.4, valid, inside the band.
  - **L2 OPEN**: valid, but outside the band, so no figure yet. It closes with one step at E′ 1 720 on the Orchestrator's word, or by his ruling otherwise.
- **A1, A2:** stage A, PASS (`…495d816f`, `…c80a1080`). Unchanged.
- **A4, A5:** not QE's at this hop. A4 waits on L2.

## Gaps
- **L2's figure is open** (above). That is the one blocking item for A3.
- The sampler counted 2 single samples at L2 with one `node` or `stockfish` each, both at game boundaries. This is likely the tool's own engine restart racing `hostcheck.sh`'s snapshot (**UNKNOWN - verify**). It is not a SHARED class, and under FL it changes no line.
- The time estimate missed low: 1.44 h against 1.6–3.6 h. It voids nothing.
- **Not covered:** levels 3–7 (a later ticket), the 40/15 claim, and any Stockfish time-scale correction between 100 and 180 ms.

## Fences held
- The four sealed scripts were sha-checked OK just before the launch and not edited.
- No band step. No `src/`, README, ADR, EPIC or board edit.
- No push, force, amend, rebase or merge.
- No foreign process was touched or recorded beyond class and count.
