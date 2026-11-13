---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-13T04:54:05Z
subtask: qe-ABC-321
role: qe-e2e
ref: .grugops/context/qe-ABC-321/
branch: new grugops/qe-ABC-321 from main
width: stage C only — read L5 night 2 against PREREG …1d9e9a62. No game, no re-run, no engine start.
---
# ABC-321: QE stage C — read L5 night 2
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261112T224805Z-orchestrator-decision-b354e881.md`, the PREREG `.grugops/context/qe-ABC-320/notes/20261111T222707Z-qe-e2e-decision-1d9e9a62.md`, and night 1's stage C (`qe-ABC-320` notes `…63e4517c` and `…b1a03872`, the brief `.grugops/queue/done/qe-ABC-320.md`). Reuse qe-ABC-320's `raw/redact.sh` and the sealed `raw/scripts/` as they are.
- **The run:** `night.sh 2280 31 <scratch>/l5-e2280-n2 <repo>`, launched by the orchestrator under the host lock on W …b354e881. Start 2026-11-12T22:48:44Z, exit 0 at 2026-11-13T04:53:35Z (el 21 891 s): 5 clean chunks, 50 games, openings 31–55; the guard refused chunk 56; next start 56. Console `<scratch>/l5-n2.console`. A durable copy of both nights is in `<durable>/skytalix-ratings/`.
- **Read night 2** exactly as night 1 was read: every validity line, the night's own pooled figure, latency, FL by class and count only (SHARED label if it applies), and the walls against the estimate.
- **Then pool nights 1 and 2** with one `rsum` over the 11 chunk dirs (openings 1–55). The orchestrator's own run of that gave 68/40/2, 62.7 %, 2 370.4 ± 67.4; re-derive it, don't trust it. Report it as the interim (110 games, not L5's figure) and apply the band probe as sealed.
- Commit redacted records under `raw/out/l5-e2280-n2/`. Keep the raw dirs. Publish an observation and a verdict note, or commit their bodies if you have no note tool. Add a `## Stage C` block here and move the brief and claim to done.
Every run goes as `flock <scratch>/host-test.lock <cmd>`. Records carry placeholders only. Never kill foreign processes. No src/, README, CHANGELOG, ADR, EPIC or board edit. Run records-path-check `--base main` before each commit. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## Stage C
*QE/E2E (claude-opus-5-5, qe-ABC-321), 2026-11-13, on `grugops/qe-ABC-321` from `main` `58f4a41a`. Read against PREREG `…1d9e9a62`. No game, no re-run, no engine start. Under `flock <scratch>/host-test.lock`, `rsum` and `read.mjs 5 2280 4000` were re-run over night 2's five chunk dirs, and both came out byte-equal to the session's own. Both were then run over the 11 chunk dirs of nights 1 and 2.*

**Result: PASS. Night 2 is VALID.**
- **Night 2 alone:** 29 / 20 / 1, 29.5 / 50 = 59.00 %, X = 2 343.2 ± 99.7.
- **Interim over nights 1 and 2:** **68 / 40 / 2, 69.0 / 110 = 62.73 %, X = 2 370.4 ± 67.4 (interim, 110 games, not L5's figure)**. The orchestrator's figure is re-derived and confirmed.
- The band probe is not triggered; no step. Night 3 runs from opening 56 at E 2 280 on a new W.

The notes are NOT admitted: there is no `propose_note` in this session. The bodies are `.grugops/context/qe-ABC-321/raw/notes/note-c-night2.md` (observation) and `note-c-verdict.md` (decision), with kinds and refs in `raw/spec-c.json`. Records: `raw/out/l5-e2280-n2/` (with `pool-n1-n2/`). The raw chunk dirs stay in `<scratch>/l5-e2280-n2`.

- **Validity, all MET:**
  1. 5 / 5 chunks clean, with no VOID; RUNAWAY and THERMAL did not fire.
  2. skytalix lost 0 games on time. Terminations: 49 mates and 1 draw by insufficient material.
  3. `Skill Level 5` and `UCI_Elo 2280` reached 50 / 50 processes. Every `go` was `go movetime 4000`: skytalix 2 844, Stockfish 2 840.
  4. Depth guard 0 of 2 840 below 6. The record check passed and every state line reads `rating`; faults 0 in every chunk.
  5. `rsum` pooled 31–55 contiguously without a refusal.
  - Gates 1–3 passed at launch; the W-check was 0 / 0 / 0 / 0. The harness was `7469531f`, with `tools/` `2ae53ab1` and `src/` `b668b153`.
- **Pooled interim (openings 1–55):**
  - Colour split: White 31.5 / 55 (57.3 %), Black 37.5 / 55 (68.2 %).
  - Opening-cluster interval ± 59.7, against iid ± 66.8.
  - Pairs: 18 swept, 30 split, 2 at 1.5, 5 lost.
- **Band probe:** the pooled 95 % score interval is 53.7–71.7 %, not wholly outside 25–75 %. Night 2 alone is 45.4–72.6 %.
- **Latency:**
  - skytalix median 4 001, p95 4 002, p99 4 002, max 4 004 ms; 0 over 4 010, 0 at or over 4 050.
  - Stockfish max 4 003 ms.
- **FL:** 2 166 samples.
  - foreign vitest 1 sample (count 1, mid-game in chunk 46);
  - cutechess-cli 0, stockfish 0;
  - node 5 samples (count 1).
  - Not SHARED (0.05 %). Tctl max 75.2 °C.
- **Walls against the estimate:**
  - 50 games in 6 h 05 min (21 891 s), on the PREREG's 110–130-ply row.
  - Chunks ran 55.9–86.7 min, mean 73.0. Plies a game: mean 113.7, median 96, max 302. Seconds a ply: 3.837.
  - The worst chunk was 1 349 plies / 5 204 s, against the guard's 2 000 / 8 400.
  - Night 1's projection of about 60 games missed by one chunk, because the games ran longer.
  - **Nights left (estimate):** 2, covering openings 56–100 in 9 chunks.
- **Gaps:**
  - **None blocking, none medium.** Night 1's medium gap is closed: the durable copy is byte-equal, and `rsum` over it gives the same pool.
  - **Low:** one foreign vitest sample inside the held-host window (source UNKNOWN - verify; it changes nothing). Five single foreign node samples. C1 gaps 2 and 4 stand.
  - **Info:** c036's per-chunk `± nan` (8 / 2 / 0) is a label only. The Stockfish time scale is UNKNOWN - verify.
- **Fences held:** no game, no edit of the sealed scripts, nothing in scratch deleted, the durable copy only read. No `src/`, README, CHANGELOG, ADR, EPIC or board edit. No push, force, amend, rebase or merge.
