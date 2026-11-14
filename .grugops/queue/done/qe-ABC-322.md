---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-14T04:41:30Z
subtask: qe-ABC-322
role: qe-e2e
ref: .grugops/context/qe-ABC-322/
branch: new grugops/qe-ABC-322 from main
width: stage C only — read L5 night 3 against PREREG …1d9e9a62. No game, no re-run, no engine start.
---
# ABC-322: QE stage C — read L5 night 3
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261113T215940Z-orchestrator-decision-dbb1a3ae.md`, the PREREG `.grugops/context/qe-ABC-320/notes/20261111T222707Z-qe-e2e-decision-1d9e9a62.md`, and night 2's stage C (the brief `.grugops/queue/done/qe-ABC-321.md` and its notes). Reuse qe-ABC-320's `raw/redact.sh` and the sealed `raw/scripts/` as they are.
- **The run:** `night.sh 2280 56 <scratch>/l5-e2280-n3 <repo>`, launched by the orchestrator under the host lock on W …dbb1a3ae. Start 2026-11-13T21:59:44Z, exit 0 at 2026-11-14T04:40:38Z (el 24 054 s): 6 clean chunks, 60 games, openings 56–85; the guard refused chunk 86; next start 86. Console `<scratch>/l5-n3.console`. A durable copy of nights 1–3 is in `<durable>/skytalix-ratings/` (the orchestrator checked it with `diff -r`).
- **Read night 3** exactly as nights 1 and 2 were read: every validity line, the night's own pooled figure, latency, FL by class and count only (SHARED label if it applies), and the walls against the estimate.
- **Then pool nights 1–3** with one `rsum` over the 17 chunk dirs (openings 1–85). The orchestrator's own run over the durable copies gave 109/57/4, 65.3 %, 2 389.8 ± 54.6; re-derive it, don't trust it. Report it as the interim (170 games, not L5's figure) and apply the band probe as sealed. State what night 4 runs (`night.sh 2280 86`, 3 chunks) and its expected wall.
- Commit redacted records under `raw/out/l5-e2280-n3/`. Keep the raw dirs. Publish an observation and a verdict note, or commit their bodies if you have no note tool. Add a `## Stage C` block here and move the brief and claim to done.
Every run goes as `flock <scratch>/host-test.lock <cmd>`. Records carry placeholders only. Never kill foreign processes. No src/, README, CHANGELOG, ADR, EPIC or board edit. Run records-path-check `--base main` before each commit. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## Stage C
*QE/E2E (claude-opus-5-5, qe-ABC-322), 2026-11-14, on `grugops/qe-ABC-322` from `main` `24d65ad1` (the brief's `ccdcf7b4` plus one board line). Read against PREREG `…1d9e9a62`. No game, no re-run, no engine start. Under `flock <scratch>/host-test.lock`, `rsum` and `read.mjs 5 2280 4000` were re-run over night 3's six chunk dirs, and both came out byte-equal to the session's own. Both were then run over the 17 chunk dirs of nights 1–3.*

**Result: PASS. Night 3 is VALID.**
- **Night 3 alone:** 41 / 17 / 2, 42.0 / 60 = 70.00 %, X = 2 427.2 ± 97.5.
- **Interim over nights 1–3:** **109 / 57 / 4, 111.0 / 170 = 65.29 %, X = 2 389.8 ± 54.6 (interim, 170 games, not L5's figure)**. The orchestrator's figure is re-derived and confirmed, over scratch and over the durable copy.
- The band probe is not triggered; no step. Night 4 runs `night.sh 2280 86` from opening 86 at E 2 280 on a new W: 3 chunks, 30 games, expected wall about 3 h 22 min.
- If night 4 runs clean, the sealed band rule cannot call a step at 200 games: the pooled score can only land in 55.5–70.5 % (arithmetic, not a reading).

The notes are NOT admitted: there is no `propose_note` in this session. The bodies are `.grugops/context/qe-ABC-322/raw/notes/note-c-night3.md` (observation) and `note-c-verdict.md` (decision), with kinds and refs in `raw/spec-c.json`. Records: `raw/out/l5-e2280-n3/` (with `pool-n1-n3/`). The raw chunk dirs stay in `<scratch>/l5-e2280-n3`.

- **Validity, all MET:**
  1. 6 / 6 chunks clean, with no VOID; RUNAWAY and THERMAL did not fire.
  2. skytalix lost 0 games on time. Terminations: 58 mates and 2 draws (one fifty-move, one insufficient material).
  3. `Skill Level 5` and `UCI_Elo 2280` reached 60 / 60 processes. Every `go` was `go movetime 4000`: skytalix 3 125, Stockfish 3 113.
  4. Depth guard 0 of 3 113 below 6. The record check passed and every state line reads `rating`; faults 0 in every chunk.
  5. `rsum` pooled 56–85 contiguously without a refusal.
  - Gates 1–3 passed at launch; the W-check was 0 / 0 / 0 / 0. The harness was `7469531f`, with `tools/` `2ae53ab1` and `src/` `b668b153`.
- **Pooled interim (openings 1–85):**
  - Colour split: White 53.0 / 85 (62.4 %), Black 58.0 / 85 (68.2 %).
  - Opening-cluster interval ± 52.6, against iid ± 54.3.
  - Pairs: 33 swept, 39 split, 4 at 1.5, 9 lost.
- **Band probe:** the pooled 95 % score interval is 58.2–72.4 %, not wholly outside 25–75 %. Night 3 alone is 58.5–81.5 %.
- **Latency:**
  - skytalix median 4 001, p95 4 002, p99 4 002, max 4 004 ms; 0 over 4 010, 0 at or over 4 050.
  - Stockfish max 4 002 ms (pooled 4 003).
- **FL:** 2 380 samples.
  - foreign vitest 0, cutechess-cli 0, stockfish 0;
  - node 6 samples (count 1), none at a game boundary.
  - Not SHARED (0 %). Tctl max 75.5 °C. load1 max 2.54, with every foreign class at 0.
- **Walls against the estimate:**
  - 60 games in 6 h 41 min (24 054 s), on the PREREG's 100-ply row.
  - Chunks ran 51.2–76.5 min, mean 66.8. Plies a game: mean 104.0, median 91, max 294. Seconds a ply: 3.842.
  - The worst chunk was 1 189 plies / 4 588 s, against the guard's 2 000 / 8 400.
  - Night 2's projection of 5–6 chunks was right; the cut note's 6–6.5 h end ran about 10 min over.
  - **Night 4 (estimate):** 3 chunks (c086, c091, c096), openings 86–100; all three launch even at the guard's worst case. About 3 h 22 min (2 h 34 min–4 h 20 min on the 17 chunk walls so far).
- **Gaps:**
  - **None blocking, none medium.** The durable copy of all three nights is byte-equal, and `rsum` over it gives the same pool.
  - **Low:** six single foreign node samples and a load1 peak of 2.54 with no foreign class (sources UNKNOWN - verify; they change nothing). C1 gaps 2 and 4 stand.
  - **Closed:** night 2's foreign vitest sample did not recur (0 of 2 380).
  - **Info:** `± nan` on c056, c076 and c081's own lines is a label only. The sealed `night.sh` labels its `next start` line `night 2:` every night. Night 3's console has no `copied to durable` tail. The Stockfish time scale is UNKNOWN - verify.
- **Fences held:** no game, no edit of the sealed scripts, nothing in scratch deleted, the durable copy only read. No `src/`, README, CHANGELOG, ADR, EPIC or board edit. No push, force, amend, rebase or merge.
