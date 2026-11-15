---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-15T01:48:30Z
subtask: qe-ABC-323
role: qe-e2e
ref: .grugops/context/qe-ABC-323/
branch: new grugops/qe-ABC-323 from main
width: stage C only — read L5 night 4 and the full 200-game reading against PREREG …1d9e9a62. No game, no re-run, no engine start.
---
# ABC-323: QE stage C — read L5 night 4 and the full L5 reading
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261114T222840Z-orchestrator-decision-481f29ee.md`, the PREREG `.grugops/context/qe-ABC-320/notes/20261111T222707Z-qe-e2e-decision-1d9e9a62.md`, and night 3's stage C (the brief `.grugops/queue/done/qe-ABC-322.md` and notes `qe-ABC-322/…3809c084`, `…a42953f6`). Reuse qe-ABC-320's `raw/redact.sh` and the sealed `raw/scripts/` as they are.
- **The run:** `night.sh 2280 86 <scratch>/l5-e2280-n4 <repo>`, launched under the host lock on W …481f29ee by an orchestrator waiter (`<scratch>/n4-waiter.sh`, log `<scratch>/n4-waiter.log`) on its first quiet check, 30 s after a check that saw foreign vitest 2. Start 2026-11-14T22:28:47Z, exit 0 at 2026-11-15T01:46:52Z (el 11 885 s): 3 clean chunks, 30 games, openings 86–100; next start 101. Console `<scratch>/l5-n4.console`. A durable copy of nights 1–4 is in `<durable>/skytalix-ratings/`.
- **Read night 4** exactly as nights 1–3 were read, including FL by class and count only (the owner said another session was running just before launch; report any foreign load in the window).
- **Then the full reading:** one `rsum` over all 20 chunk dirs (openings 1–100). The orchestrator's run over the durable copies gave 133/60/7, 68.2 %, 2 412.9 ± 51.1; re-derive it. This is L5's figure if every PREREG line holds; apply the band rule once, as sealed, and state the PREREG's final-reading lines (colour split, cluster interval, L5 − L4, the Stockfish time-scale caveat). State the figure and wording the README and CHANGELOG should carry, as a recommendation only.
- Commit redacted records under `raw/out/l5-e2280-n4/` and `raw/out/l5-full/`. Keep the raw dirs. Commit an observation and a verdict note body. Add a `## Stage C` block here and move the brief and claim to done.
Every run goes as `flock <scratch>/host-test.lock <cmd>`. Records carry placeholders only. Never kill foreign processes. No src/, README, CHANGELOG, ADR, EPIC or board edit. Run records-path-check `--base main` before each commit. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## Stage C
*QE/E2E (claude-opus-5-5, qe-ABC-323), 2026-11-15, on `grugops/qe-ABC-323` from `main` `44f27463`. Read against PREREG `…1d9e9a62`, with the band rule at 200 from ABC-317's `…e6cf1088`, which it adopts. No game, no re-run, no engine start. Under `flock <scratch>/host-test.lock`, `rsum` and `read.mjs 5 2280 4000` were re-run over night 4's three chunk dirs, and both came out byte-equal to the session's own. Both were then run over the 20 chunk dirs of nights 1–4, over scratch and over the durable copy.*

**Result: PASS. Night 4 is VALID, and so is the full reading.**
- **Night 4 alone:** 24 / 3 / 3, 25.5 / 30 = 85.00 %, X = 2 581.3 ± 197.7.
- **L5's figure, 200 games (openings 1–100):** **133 / 60 / 7, 136.5 / 200 = 68.25 %, X = 2 412.9 ± 51.1**. The orchestrator's figure is re-derived and confirmed, over scratch and over the durable copy.
- **Band rule, once, as sealed:** P = 136.5 lies in 50.0–150.0, so E 2 280 is confirmed and X is L5's figure. No step. The interval form, 61.9–74.6 %, is not triggered either.
- **Recommended for README and CHANGELOG (a recommendation only):** `2413 ± 51, measured`, at `UCI_Elo` 2280, with the Stockfish time-scale caveat. The wording is in the verdict body.

The notes are NOT admitted: there is no `propose_note` in this session. The bodies are `.grugops/context/qe-ABC-323/raw/notes/note-c-night4.md` (observation) and `note-c-verdict.md` (decision), with kinds and refs in `raw/spec-c.json`. Records: `raw/out/l5-e2280-n4/`, `raw/out/l5-full/` and `raw/out/README.txt`. The raw chunk dirs stay in `<scratch>/l5-e2280-n4`.

- **Validity, all MET (night 4, and all 20 chunks):**
  1. 3 / 3 chunks clean (20 / 20 over four nights), with no VOID; RUNAWAY and THERMAL did not fire.
  2. skytalix lost 0 games on time (0 of 200). Night 4's terminations: 27 mates and 3 draws (threefold, fifty-move, insufficient material).
  3. `Skill Level 5` and `UCI_Elo 2280` reached 30 / 30 processes (200 / 200). Every `go` was `go movetime 4000`: night 4 skytalix 1 535, Stockfish 1 524.
  4. Depth guard 0 of 1 524 below 6 (0 of 10 429 over all 20). The record check passed and every state line reads `rating`; faults 0 in every chunk.
  5. `rsum` pooled 86–100, and then 1–100, contiguously without a refusal.
  - Gates 1–3 passed at launch; the W-check was 0 / 0 / 0 / 0. The harness was `7469531f`, with `tools/` `2ae53ab1` and `src/` `b668b153`.
- **Final-reading lines:**
  - Colour split: White 67.0 / 100 (67.0 %), Black 69.5 / 100 (69.5 %), about 0.4 SE apart.
  - Opening-cluster interval ± 49.6, against iid ± 50.8 and the tool's ± 51.1.
  - L5 − L4: 2 412.9 − 2 094.3 = +318.6 ± 70.0 (quadrature).
  - Caveat: Stockfish thinks 4 s against L5 and 1 s against L4; its strength at a given `UCI_Elo` may move with time (UNKNOWN - verify).
  - Pairs: 42 swept, 42 split, 7 at 1.5, 9 lost.
- **Latency:**
  - Night 4, skytalix median 4 001, p95 4 002, p99 4 003, max 4 003 ms; over 200 games max 4 004 ms. 0 over 4 010, 0 at or over 4 050.
  - Stockfish max 4 002 ms (4 003 over 200).
- **FL:** 1 176 samples.
  - foreign vitest 1 sample (count 1, el 10 884 s, 275 s from a game boundary), cutechess-cli 0, stockfish 0, node 0.
  - Not SHARED (0.09 %). Tctl max 74.9 °C. load1 max 3.17, with every foreign class at 0.
  - Before launch, 22:28:16Z saw foreign vitest 2; the waiter's 22:28:46Z check and gate 3 saw 0.
- **Walls:**
  - Night 4: 30 games in 3 h 18 min (11 885 s), against the 3 h 22 min estimate (2 h 34 min–4 h 20 min). Chunks 52.6–74.8 min. Plies a game: mean 102.0, median 89, max 250. Seconds a ply: 3.871.
  - All 200: four nights, 80 711 s of session time (22 h 25 min). Plies mean 104.5, max 302; worst 10-game window 1 446, against the guard's 2 000.
- **Gaps:**
  - **None blocking.**
  - **Medium (the README hop, not the reading):** the L6 projection (~2 310–2 420) would sit at or below measured L5 (2 413), and L7's (~2 380–2 540) overlaps it. Both come from the model that put L5 93–173 too low. Re-project (an architect call) or say they predate L5's reading; the Orchestrator decides before README and CHANGELOG change.
  - **Low:** one foreign vitest sample, and a load1 peak of 3.17 with no foreign class (sources UNKNOWN - verify; they change nothing). C1 gaps 2 and 4 stand.
  - **Closed:** night 3's foreign node samples did not recur (0 of 1 176).
  - **Info:**
    - Three chunks each read 8 / 1 / 1; QE checked they are distinct.
    - `± nan` on the chunk lines is a label only.
    - The sealed `next start` line's `night 2:` label is fixed text.
    - The console has no exit tail; it is in the waiter's log.
    - The claim's `at` stamp reads 30 s after its commit.
    - Night 4 is 2.8 SE above nights 1–3 post hoc; across the four nights, χ² 6.1 on 3 df, p ≈ 0.11.
    - The Stockfish time scale is UNKNOWN - verify.
- **Fences held:** no game, no edit of the sealed scripts, nothing in scratch deleted, the durable copy only read. No `src/`, README, CHANGELOG, ADR, EPIC or board edit. No push, force, amend, rebase or merge.
