# qe-ABC-321 verdict: **PASS. Night 2 of L5 (ABC-321) is VALID.** Every PREREG validity line is MET. Night 2 alone reads 29.5 / 50 = 59.00 %, X = 2 343.2 ± 99.7. The interim over nights 1 and 2 is 69.0 / 110 = 62.73 %, X = 2 370.4 ± 67.4 (interim, 110 games, not L5's figure). The band probe is not triggered and no step is due. Night 3 continues from opening 56 at E 2 280, on a new W. No blocking or medium gap. Night 1's medium gap (raw `r.out` on tmpfs) is closed: the durable copy is byte-equal and `rsum` reads it

QE/E2E, task `qe-ABC-321`, stage C, branch `grugops/qe-ABC-321` from `main` `58f4a41a`, 2026-11-13. The evidence is the stage C observation sealed just before this note; records are in `raw/out/l5-e2280-n2/`. No game, no re-run, no engine start in this hop. This note is QE's reading and verdict. Merge and deploy stay with the humans.

## Against the cut note `…b354e881` and the PREREG `…1d9e9a62`
- **Ran as sealed: MET.**
  - E 2 280 and first start 31: the `next start` that night 1 wrote.
  - The sealed scripts are unedited; `sha256sum -c` is OK in the session worktree and on `main`.
  - The worktree's `tools/` is `2ae53ab1` and its `src/` `b668b153`, clean; gate 2 enforces both, and five chunks launched.
  - It ran on the owner's W for this one window.
- **Night 2's validity: MET on every line.**
  1. 5 / 5 chunks clean, with no VOID.
  2. 0 skytalix time losses.
  3. `Skill Level 5`, `UCI_Elo 2280` and `go movetime 4000` reached 50 / 50 processes.
  4. Depth guard 0 of 2 840 below 6; record check and `state: rating` in every chunk.
  5. `rsum` without a refusal over openings 31–55.
  - The session's `rsum.txt` and `read.txt` are re-derived byte-equal.
- **The pool: MET.** One `rsum` over the 11 chunk dirs (openings 1–55) pools without a refusal. All 11 run on one harness tree, one `dist/` tree and one `cmd.txt` but for `start=`, so carried C1 gap 1 does not bite here.
- **No skytalix fault and no product finding on `cddd4df9`.**
- **Scope:** this branch adds records under `.grugops/` only. Its `src/` diff from `main` is empty.

## What the reading says (reported, not graded)
- **The band rule:** the pooled 95 % score interval is 53.7–71.7 %, not wholly outside 25–75 %. **No step** (`ABC-204` A4, `ADR-0056` D5 item 4, as sealed).
- **Against the projection:** L5 was projected at about 2 240–2 320, an expected 44.3–55.7 % at E 2 280.
  - It reads 62.7 %, X = 2 370.4 ± 67.4. The centre is 50 above the projected top. E 2 280 still lies just below X's interval (2 303–2 438).
  - The interim moved down 23.5 from night 1's 2 393.9 as night 2 read lower (59.0 % against 65.8 %). The two nights differ by about 0.7 SE: no sign that they disagree.
  - If the score held at this mix over 200 games, its 95 % interval would be about 56–69 %: inside the band, so E 2 280 would stand. **This is an estimate, UNKNOWN - verify**; the full reading decides.
- **The colour split** is 57.3 % as White against 68.2 % as Black, 55 games each. The difference is about 1.2 SE, so it is not significant at 110 games. Night 1 leaned the same way.
- **Interim L5 − L4:** 2 370.4 − 2 094.3 ≈ +276, with about ± 83 in quadrature. Stockfish thinks 4 s here and 1 s at L4. Its strength at a given `UCI_Elo` may move with time (**UNKNOWN - verify**, the PREREG's named risk).

## Gaps, by severity
- **Blocking: none.**
- **Medium: none.**
  - Night 1's medium gap is closed. The owner's durable copy of both out-roots is byte-equal to scratch (77 and 65 files). `rsum` over the durable 11 chunk dirs gives the same pooled lines.
  - The durable night-2 console lacks only its final `copied to durable` line, written after the copy.
- **Low (W, FL):** one foreign `vitest` showed in one 10 s sample, count 1, mid-game in chunk 46, inside the held-host window. The harness's `host.log` saw it in the same minute.
  - Under FL it changes no line. It is 0.05 % of samples against the 20 % SHARED bar, and skytalix's latency held (max 4 004 ms).
  - A vitest during a held window means something ran tests outside the host lock. Its source is **UNKNOWN - verify** (class and count only were recorded).
  - **Recommend:** the Orchestrator reminds every lane that the lock is held during an L5 night.
- **Low (FL attribution):** five single foreign `node` samples, none at a game boundary. What they were is **UNKNOWN - verify**. They change nothing.
- **Low (carried from C1, unchanged):**
  - gap 2: `rsum` prints only the pooled state;
  - gap 4: `rsum` needs `CUTECHESS_CLI` and `STOCKFISH` set, although it starts no engine.
  - Gap 1 (harness tree not compared) is covered for this pool by QE's own check above.
- **Info:**
  - c036's per-chunk line reads `± nan` (8 / 2 / 0 in 10 games). It is a chunk-level label only: the sealed check reads `state: rating`, and the pooled figure is unaffected.
  - Night 1's QE projection of about 60 games for night 2 missed by one chunk, because the games ran longer. The PREREG's 110–130-ply row (50 games) was right.
  - The longest L5 game so far is 302 plies. The worst 10-game window is 1 446 plies, under the guard's 2 000.

## Next (not QE's to start)
- Night 3: `night.sh 2280 56 <new out-root> <repo>` from qe-ABC-320's worktree (`tools/` `2ae53ab1`, `src/` `b668b153`), after `sha256sum -c raw/scripts/SHA256SUMS`, on the Orchestrator's line citing a new W.
- **Estimate (UNKNOWN - verify):** two more nights cover openings 56–100. Night 3 should run 5–6 chunks, and night 4 the last 3–4, ending early when the openings are done.
- The 200-game reading then pools all clean chunks of every night in one `rsum`, and the band rule is applied once, as sealed. README and CHANGELOG wait for it.

## Fences held
- No game, re-run or engine start. `rsum` and `read.mjs` ran under the host lock and read only.
- The sealed `raw/scripts/` and `raw/redact.sh` were used as they are, unedited.
- The raw chunk dirs were kept and nothing in scratch was deleted. The durable copy was read, not written.
- No `src/`, README, CHANGELOG, ADR, EPIC or board edit.
- No push, force, amend, rebase or merge.
- No foreign process was touched or recorded beyond class and count.
