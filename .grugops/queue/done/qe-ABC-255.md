---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T16:56:28Z
subtask: qe-ABC-255
role: qe-e2e
ref: .grugops/context/qe-ABC-255/
branch: new grugops/qe-ABC-255 from grugops/ABC-255 (head a08ba9be; code 78cd2415; base 8f2fc9b5) — worktree .claude/worktrees/qe-ABC-255
width: TESTS/GAMES SERIALIZED. Wrap EVERY test/build/engine/cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; hold it for each game block. qe-ABC-254 may hold it first — wait.
---
# QE: grade ABC-255 (harness: d 100 ms control, r 0.5 s smoke) — and its three real reads
## Ticket
plans/tickets/ABC-255*.md, A1–A8. SE notes on the branch .grugops/context/se-ABC-255/ (…8953bec7, …5333bc23, …8b930153, …e65b673f). ADR-0056 C2′/C3″/S′/R-TC.
## Do
- Re-check A1/A2 dry runs and the byte-identity of existing shapes; A6 (0 lines src/ data/; skytalix block keys unchanged); A7 gates; mutation spot-check.
- A3, A4, A5 real reads exactly as the page states (100 + 100 games at 100 ms, 10-game smoke at 0.5 s vs SF E1650), concurrency 1, one at a time; seal a PREREG first with the estimate. These counts are owner-set (100 per change, smoke 10 games) — no ask needed unless one single run is estimated > 60 min; then STOP and report.
- Report time losses, max overshoot, faults, games/hour, and the scores; A4 checks the identical pair sits near 50 %. Write the ## Reading section (A8) — you may edit only that section of the ABC-255 page.
- Host: log foreign CPU (a foreign vitest from projects/public/grugops recurs; count only real vitest, not flock waiter command lines — QE-249-c). Wait cap 20 min per block, then proceed flagged SHARED. Thermal stop Tctl median > 85 °C. Never kill foreign processes.
## Fences
Tests, tools/rating test rows only if a gap needs proof, the ABC-255 page's ## Reading section, your records. No src/, board, other plans/, memory-bank/. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Verdict PASS / PASS_WITH_GAPS / FAIL with gap ids; sealed notes (task qe-ABC-255, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.

## Result

**2026-11-01, QE/E2E. PASS_WITH_GAPS, with no gap blocking.** Branch `grugops/qe-ABC-255` (worktree `.claude/worktrees/qe-ABC-255`, from `grugops/ABC-255` `a08ba9be`): claim `de931c7c`, PREREG `28b800cc` (sealed before any game; note `…1a15c163`), PREREG note commit `73ec5545`, notes + raw + `## Reading` `72ab307e`. Every test, build, engine and cutechess run went under `flock host-test.lock`, one at a time at `--concurrency 1`. Nothing was pushed or merged. Nothing under `src/`, `tools/`, `data/`, the board, other `plans/` or `memory-bank/` was edited: QE touched only the ABC-255 page's `## Reading` and its own records. No UAT (tools only). This verdict closes the gate.

- **A1 / A2 MET (dry runs):**
  - 16 existing `d` / `r` / `rpair` shapes are byte-equal to base `8f2fc9b5`.
  - The new d@100 vectors (50 and 200 rounds) and the r@500 vector are exact.
  - `r --budget-ms` refuses 4000, 100, 1000, 0, 499, 501, −500 and abc with exit 1. `d` refuses 500, 50, 4000 and 200.
  - `rpair --budget-ms` exits 1 as before, and only the usage text gained the new line.
- **A6 MET:** 0 lines under `src/` and `data/`, and the control reaches skytalix only as `st=` / `timemargin=`.
- **A7 MET:**
  - lint, typecheck and build: rc 0.
  - `npm test`: 2 362/2 362, 0 skipped. skip-integrity and lane-inventory: "No findings."
  - pair-check: 32/32. Mutants M1–M7 are killed. M8 survives, as pre-registered (QE-255-a).
  - 0 new lane rows.
- **A3 (reported):** `d b5c67ab7 12270c02 --budget-ms 100 --rounds 50`.
  - 100/100 games, W/L/D 30/26/44, **52.0 of 100**, Elo **+13.9 ± 51.3**, draws 44 %. **The GAIN bar is met.**
  - 0 faults and 0 time losses. Max overshoot 5 ms on both sides. **334.0 games/h.** The host was ALONE.
- **A4:** `d becf571a becf571a --budget-ms 100 --rounds 50`.
  - **100/100 games, 0 faults, 0 time losses.**
  - The score is 29/38/33, **45.5 of 100**, −31.4 ± 56.3: near 50 %, and the interval covers 0.
  - Draws 33 %, **253.3 games/h**, max overshoot 4 / 5 ms. The host was SHARED by rule (15.5 % of samples saw a foreign vitest).
- **A5:** `r becf571a --budget-ms 500 --rounds 5`, E 1 650.
  - **10/10 games, 0 faults, 0 time losses.** W/L/D 9/1/0, **0.900**, **94.2 games/h**. Stockfish's depth per move has a median of 17 and a minimum of 12.
  - **skytalix's max overshoot over 500 ms is 3 ms**, under the 12 ms flag, so the margin stands.
  - The host was SHARED: the start came at the end of the 20 min wait cap, behind a foreign grugops vitest.
- **Host:**
  - Tctl medians were 76–77 °C, with a max of 87.1 °C in A5. There was no thermal stop.
  - load1 medians were 1.47–1.96.
  - QE killed no foreign process.
- **Gaps:**
  - **QE-255-a (LOW, SE or BA/PM):** no offline row holds the `machine.txt` `control:` line. It is present in all three reads.
  - **QE-255-b (INFO):** `--budget-ms` accepts `500.0` / `5e2` / `0x1F4` and `d 1e2`, with the same vector.
  - **QE-255-c (INFO, pre-existing):** the harness `host.log` vitest count matches flock waiter lines (cf. QE-249-c).
  - **QE-255-d (INFO, BA/PM and Architect):** the first S′ scored 0.900, above the 67–83 % estimate. It is one read, and no re-pin is triggered.
  - **QE-255-e (INFO):** the admissibility labels above.
- **Merge validity:** `tools/` and the package files are equal from `8f2fc9b5` to main `ab9f4803`, and `git merge-tree` is clean. main moved `becf571a` → `ab9f4803`, a change to `src/levels.test.ts` only.
- **Notes** (task `qe-ABC-255`, contextRoot = worktree; 8/8 sealed and read back): PREREG `20261101T170533Z-qe-e2e-decision-1a15c163`, verdict `20261101T184957Z-qe-e2e-decision-cc9d4bad`, static `…-observation-3d8f640a`, A5 `…-observation-06e00dd9`, A3 `…-observation-919fe884`, A4 `…-observation-78ea212c`, gaps `…-observation-f41a5b6e`, artifacts `20261101T185004Z-qe-e2e-observation-870e01e7`.
  - An `artifact-ref` was refused by admission: it needs a §14-gate run id, and this install has none. It was recorded as an observation instead.
- **No process left running.** The engine clones were removed. Scratch is `qe-255/`.

### Trace row (10 cells, header order)

| ABC-255 | The rating harness plays the owner's reads: d at 100 ms (C2′ 100 games, C3″ 400 games) and the r smoke at 0.5 s (S′), tools only | EPIC-011 | ADR-0056 C2′ / C3″ / S′ / R-TC | NFR-008: 0 new lane rows; A3 ALONE, A4/A5 SHARED by rule (foreign vitest < 20 % CPU); Tctl median ≤ 77 °C, no thermal stop | grugops/ABC-255 @ 78cd2415 (tip a08ba9be): tools/rating/rating.ts, tools/rating/pair-check.ts; 0 lines src/ data/ | QE PASS_WITH_GAPS: pair-check 32/32, M1–M7 killed (M8 survives, QE-255-a); npm test 2 362, 0 skipped; 16 dry shapes byte-equal; A3 52.0/100 +13.9 ± 51.3 GAIN met; A4 100/100, 0 faults, 0 time losses, 45.5/100, draws 33 %, 253 g/h; A5 10/10, 9/1/0, overshoot max 3 ms, 94 g/h | no UAT (tools only); QE verdict signs | — | QE PASS_WITH_GAPS (branch, not merged; to the Orchestrator for merge routing; QE-255-a LOW to SE/BA, b–e INFO) |
