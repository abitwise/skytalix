# qe-ABC-323 verdict: **PASS. Night 4 of L5 (ABC-323) is VALID, and so is the full reading.** Every PREREG validity line is MET on all 20 chunks. Night 4 alone reads 25.5 / 30 = 85.00 %, X = 2 581.3 ± 197.7. **L5's figure: 133 / 60 / 7, 136.5 / 200 = 68.25 %, X = 2 412.9 ± 51.1** at E 2 280. The band rule holds E (P = 136.5 within 50–150); no step. L5 − L4 = +318.6 ± 70.0, with the Stockfish time-scale caveat. One medium gap, for the README hop only: the L6 and L7 projections no longer sit above measured L5

QE/E2E, task `qe-ABC-323`, stage C, branch `grugops/qe-ABC-323` from `main` `44f27463`, 2026-11-15. The evidence is the stage C observation sealed just before this note; records are in `raw/out/l5-e2280-n4/` and `raw/out/l5-full/`. No game, no re-run, no engine start in this hop. This note is QE's reading and verdict. Merge and deploy stay with the humans.

## Against the cut note `…481f29ee` and the PREREG `…1d9e9a62`
- **Ran as sealed: MET.**
  - E 2 280 and first start 86: the `next start` that night 3 wrote.
  - The sealed scripts are unedited; `sha256sum -c` is OK in the session worktree.
  - The worktree's `tools/` is `2ae53ab1` and its `src/` `b668b153`, clean; gate 2 enforces both, and three chunks launched.
  - It ran on the owner's W for night 4, launched on the first quiet check (foreign vitest / cutechess-cli / stockfish 0, load1 0.85, lock free), as the cut note set out.
- **Night 4's validity: MET on every line.**
  1. 3 / 3 chunks clean, with no VOID.
  2. 0 skytalix time losses.
  3. `Skill Level 5`, `UCI_Elo 2280` and `go movetime 4000` reached 30 / 30 processes.
  4. Depth guard 0 of 1 524 below 6; record check and `state: rating` in every chunk.
  5. `rsum` without a refusal over openings 86–100.
  - The session's `rsum.txt` and `read.txt` are re-derived byte-equal.
- **The full reading's validity: MET.** 20 / 20 chunks clean over four nights, no VOID; 0 time losses in 200; options and `go` in 200 / 200 processes; depth guard 0 of 10 429; one `rsum` over the 20 chunk dirs pools openings 1–100 contiguously, state `rating`, no refusal. All 20 run one `dist/` tree and one `cmd.txt` but for `start=`, on two harness commits with the same `tools/` and `src/` trees.
- **No skytalix fault and no product finding on `cddd4df9`.**
- **Scope:** this branch adds records under `.grugops/` only. Its `src/` diff from `main` is empty.

## The final reading (the PREREG's lines)
- **L5's figure:** W / L / D 133 / 60 / 7, P = 136.5 / 200 = 68.25 %; `cutechess-cli` 1.5.1's Δ = +132.9 ± 51.1 against E; **X = 2 412.9 ± 51.1** (2 361.8–2 464.0). The orchestrator's 133 / 60 / 7, 68.2 %, 2 412.9 ± 51.1 is re-derived and confirmed, over scratch and over the durable copy.
- **The band rule, applied once, as sealed:** 50.0 ≤ 136.5 ≤ 150.0, so **E 2 280 is confirmed and X is L5's figure. No step.** The interval form, 61.9–74.6 %, is not wholly outside 25–75 % either.
- **Colour split:** as White 67.0 / 100 = 67.0 %, as Black 69.5 / 100 = 69.5 %; about 0.4 SE apart. Not significant.
- **Opening-cluster interval:** ± 49.6 Elo (100 clusters of 2, deff 0.953), beside the iid ± 50.8 and the tool's ± 51.1. The openings add no spread; the tool's ± stands.
- **L5 − L4:** 2 412.9 − 2 094.3 = **+318.6 ± 70.0** (both ± in quadrature: 51.1 and 47.9). Reported, not graded.
- **The Stockfish time-scale caveat:** Stockfish thinks 4 s a move against L5 and 1 s against L4. Its strength at a given `UCI_Elo` may move with time, and that was not measured (**UNKNOWN - verify**, the PREREG's named risk). So L5 − L4 mixes skytalix's gain with any change in Stockfish's.
- **Against the projection** (reported, not graded): L5 was projected at about 2 240–2 320. X is 93–173 above it; the projection's top lies below X's lower 95 % end (2 361.8). The projection added +50 to +75 a doubling from L4's blunder-free 2 144–2 164 at 1 s; X implies about +125 to +135 a doubling over those two doublings, or a Stockfish time-scale effect, or both. Which it is cannot be read from these games.
- The last 30 games moved the figure up 23.1 from the 170-game interim (2 389.8). Night 4 alone sits about 2.8 SE above nights 1–3 (post hoc), but the four nights together give χ² 6.1 on 3 df, p ≈ 0.11: no evidence they disagree.

## Recommended README and CHANGELOG (a recommendation only; the docs hop and the humans decide)
- **The figure:** **2413 ± 51**, at `UCI_Elo` 2280 (2 412.9 ± 51.1 rounded as L1–L4's cells are).
- **README Levels table**, level 5's Strength cell: `2413 ± 51, measured`, in place of `~2240–2320, projected`.
- **README Levels text:** "Levels 1 to 5 were measured. Each played 200 games against Stockfish 19 with `UCI_LimitStrength` on, against `UCI_Elo` 1320, 1720, 1890, 2040 and 2280 respectively. Both sides had the level's own time per move, and the level's blunder rate was on." Then: "Level 5 measured above its projection of about 2240 to 2320. Stockfish had 4 s a move against level 5 and 1 s against level 4. How that moves its strength at a given `UCI_Elo` was not measured, so part of the step from level 4 may be Stockfish's." "Levels 5 to 7 … projections" becomes "Levels 6 and 7 …".
- **README Strength section:** its last lines say level 5's strength at 4 s was not measured. That becomes stale; it would read "At 4 s a move, with Stockfish also at 4 s, it measured 2413 ± 51 (see Levels)."
- **CHANGELOG `[Unreleased]`:** "Strength, measured only: level 5 against Stockfish 19 with `UCI_LimitStrength`, 200 games, both sides at 4 s a move: 2413 ± 51, at `UCI_Elo` 2280. This figure is on the scale of the README's Strength section only. It is not a FIDE or online rating. Stockfish had 4 s a move here and 1 s at level 4; how that moves its strength at a given `UCI_Elo` was not measured."
- **L6 and L7:** see the medium gap. QE recommends the docs hop does not print the old L6 and L7 projections beside measured L5 without a word on it.

## Gaps, by severity
- **Blocking: none.**
- **Medium (the README hop, not the reading):** the table's L6 projection, ~2 310–2 420, would sit at or below measured L5 (2 413), and L7's ~2 380–2 540 overlaps it. Read as printed, level 6 would look no stronger than level 5. Both rest on the same model that put L5 93–173 too low. Whether to re-project L6 and L7 from L5's figure (an architect call), or to keep them and say they predate L5's reading, is the Orchestrator's to decide before README and CHANGELOG change.
- **Low (FL attribution):** one foreign `vitest` sample (count 1) at el 10 884 s in c096, 275 s from a game boundary. The owner named another session just before launch; whose it was is **UNKNOWN - verify**. 0.09 % of samples, far under SHARED's 20 %. It changes nothing.
- **Low (load):** load1 reached 3.17 at el 7 791 s in c096's second game, decaying over 2.5 min, with every foreign class at 0. Its source is **UNKNOWN - verify**. skytalix's latency held (max 4 003 ms, 0 over 4 010), so it changes no line.
- **Low (carried from C1, unchanged):** gap 2, `rsum` prints only the pooled state; gap 4, `rsum` needs `CUTECHESS_CLI` and `STOCKFISH` set, although it starts no engine. Gap 1 (harness tree not compared) is covered for this pool by QE's own `git rev-parse` check.
- **Closed:** night 3's six single foreign `node` samples did not recur (0 of 1 176).
- **Info:**
  - All three night-4 chunks read 8 / 1 / 1 and `± nan` on their own lines. QE checked they are three distinct chunks (different PGN sha256, plies and openings); the `± nan` is a chunk-level label only.
  - The sealed `night.sh` labels its `next start` line `night 2:` every night; tonight it names `night.sh 2280 101`, which is moot, as openings 1–100 are done.
  - Night 4's console is byte-equal to its `session.log`; the `night.sh exit=0` line is in the waiter's log, committed with the records.
  - This hop's claim file reads `at: 2026-11-15T01:48:40Z`, 30 s after its own commit time (01:48:10Z). It is a hand-written stamp and changes nothing.

## Next (not QE's to start)
- The docs hop: README Levels table and text, the Strength section's stale line and CHANGELOG `[Unreleased]`, with the figure above, after the Orchestrator settles the L6 and L7 projections (medium gap).
- L6 and L7 stay parked as planned (`memory-bank/60-progress.md` § Next action); nothing here starts them.

## Fences held
- No game, re-run or engine start. `rsum` and `read.mjs` ran under the host lock and read only.
- The sealed `raw/scripts/` and `raw/redact.sh` were used as they are, unedited.
- The raw chunk dirs were kept and nothing in scratch was deleted. The durable copy was read, not written.
- No `src/`, README, CHANGELOG, ADR, EPIC or board edit.
- No push, force, amend, rebase or merge.
- No foreign process was touched or recorded beyond class and count.
