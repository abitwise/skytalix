# qe-ABC-322 verdict: **PASS. Night 3 of L5 (ABC-322) is VALID.** Every PREREG validity line is MET. Night 3 alone reads 42.0 / 60 = 70.00 %, X = 2 427.2 ± 97.5. The interim over nights 1–3 is 111.0 / 170 = 65.29 %, X = 2 389.8 ± 54.6 (interim, 170 games, not L5's figure). The band probe is not triggered and no step is due. Night 4 runs `night.sh 2280 86` (3 chunks, openings 86–100, about 3 h 22 min) on a new W. No blocking or medium gap

QE/E2E, task `qe-ABC-322`, stage C, branch `grugops/qe-ABC-322` from `main` `24d65ad1`, 2026-11-14. The evidence is the stage C observation sealed just before this note; records are in `raw/out/l5-e2280-n3/`. No game, no re-run, no engine start in this hop. This note is QE's reading and verdict. Merge and deploy stay with the humans.

## Against the cut note `…dbb1a3ae` and the PREREG `…1d9e9a62`
- **Ran as sealed: MET.**
  - E 2 280 and first start 56: the `next start` that night 2 wrote.
  - The sealed scripts are unedited; `sha256sum -c` is OK in the session worktree.
  - The worktree's `tools/` is `2ae53ab1` and its `src/` `b668b153`, clean; gate 2 enforces both, and six chunks launched.
  - It ran on the owner's W for this one 8 h window.
- **Night 3's validity: MET on every line.**
  1. 6 / 6 chunks clean, with no VOID.
  2. 0 skytalix time losses.
  3. `Skill Level 5`, `UCI_Elo 2280` and `go movetime 4000` reached 60 / 60 processes.
  4. Depth guard 0 of 3 113 below 6; record check and `state: rating` in every chunk.
  5. `rsum` without a refusal over openings 56–85.
  - The session's `rsum.txt` and `read.txt` are re-derived byte-equal.
- **The pool: MET.** One `rsum` over the 17 chunk dirs (openings 1–85) pools without a refusal. All 17 run on one `dist/` tree and one `cmd.txt` but for `start=`. Their two harness commits (`740008a6` for night 1, `7469531f` for nights 2–3) carry the same trees, `tools/` `2ae53ab1` and `src/` `b668b153` (QE checked with `git rev-parse`), so carried C1 gap 1 does not bite here.
- **No skytalix fault and no product finding on `cddd4df9`.**
- **Scope:** this branch adds records under `.grugops/` only. Its `src/` diff from `main` is empty.

## What the reading says (reported, not graded)
- **The band rule:** the pooled 95 % score interval is 58.2–72.4 %, not wholly outside 25–75 %. **No step** (`ABC-204` A4, `ADR-0056` D5 item 4, as sealed).
- **The band rule at 200 games (arithmetic, not a reading):** whatever night 4's 30 games give, the pooled score lies between 111 / 200 = 55.5 % and 141 / 200 = 70.5 %. Its 95 % interval holds its own point, so it cannot lie wholly outside 25–75 %. **If night 4 runs clean, the sealed band rule cannot call a step at the full reading, and E 2 280 stands for L5's figure.**
- **Against the projection:** L5 was projected at about 2 240–2 320, an expected 44.3–55.7 % at E 2 280.
  - It reads 65.3 %, X = 2 389.8 ± 54.6. The centre is 70 above the projected top. E 2 280 lies below X's interval (2 335–2 444).
  - The interim moved up 19.4 from night 2's 2 370.4, as night 3 read higher (70.0 % against 62.7 %). That is about 1.0 SE of the difference: no sign that the nights disagree.
  - At 200 games the figure can only fall between about 2 318 (night 4 at 0 / 30) and 2 431 (30 / 30). **This bounds the arithmetic; it is not a forecast.**
- **The colour split** is 62.4 % as White against 68.2 % as Black, 85 games each. The difference is about 0.8 SE (1.2 SE at 110 games). Night 3 leaned the other way (71.7 % against 68.3 %). Not significant.
- **Interim L5 − L4:** 2 389.8 − 2 094.3 ≈ +296, with about ± 73 in quadrature (L4 ± 47.9). Stockfish thinks 4 s here and 1 s at L4. Its strength at a given `UCI_Elo` may move with time (**UNKNOWN - verify**, the PREREG's named risk).

## Gaps, by severity
- **Blocking: none.**
- **Medium: none.** The durable copy of all three nights is byte-equal to scratch, and `rsum` over its 17 chunk dirs gives the same pool.
- **Low (FL attribution):** six single foreign `node` samples, none at a game boundary (42–393 s away). What they were is **UNKNOWN - verify**. They change nothing.
- **Low (load):** load1 reached 2.54 for about 30 s in c081's first game, above night 2's max of 1.97, with every foreign class at 0. Its source is **UNKNOWN - verify** (class and count only were recorded). skytalix's latency held (max 4 004 ms, 0 over 4 010), so it changes no line.
- **Low (carried from C1, unchanged):**
  - gap 2: `rsum` prints only the pooled state;
  - gap 4: `rsum` needs `CUTECHESS_CLI` and `STOCKFISH` set, although it starts no engine.
  - Gap 1 (harness tree not compared) is covered for this pool by QE's own check above.
- **Closed:** night 2's low gap (one foreign `vitest` inside the held window) did not recur. Night 3 has 0 vitest samples and every `host.log` line reads 0.
- **Info:**
  - c056, c076 and c081 read `± nan` on their own chunk lines (8 / 1 / 1, 9 / 1 / 0, 8 / 2 / 0). These are chunk-level labels only: the sealed check reads `state: rating`, and the pooled figure is unaffected.
  - The sealed `night.sh` prints `(night 2: night.sh E S …)` on its `next start` line every night. On night 3 it reads `night 2: night.sh 2280 86`. The label is fixed text; the command it names is right. It is not edited (sealed).
  - Night 3's console is byte-equal to its `session.log`; unlike night 2's, it has no `night.sh exit` or `copied to durable` tail line. The durable copy exists and is byte-equal, so nothing is lost.
  - The cut note's 6–6.5 h end estimate missed by about 10 min (6.68 h), inside the 8 h window.

## Next (not QE's to start)
- Night 4: `night.sh 2280 86 <new out-root> <repo>` from qe-ABC-320's worktree (`tools/` `2ae53ab1`, `src/` `b668b153`), after `sha256sum -c raw/scripts/SHA256SUMS`, on the Orchestrator's line citing a new W.
- **Estimate (UNKNOWN - verify):** 3 chunks (c086, c091, c096), 30 games. All three launch even at the guard's worst case. Expected wall about 3 h 22 min (2 h 34 min–4 h 20 min on the observed chunk walls; 7 h at the guard's basis). The night ends on `next start: 101`, not on the guard.
- The 200-game reading then pools all 20 clean chunks of every night in one `rsum`, and the band rule is applied once, as sealed. README and CHANGELOG wait for it.

## Fences held
- No game, re-run or engine start. `rsum` and `read.mjs` ran under the host lock and read only.
- The sealed `raw/scripts/` and `raw/redact.sh` were used as they are, unedited.
- The raw chunk dirs were kept and nothing in scratch was deleted. The durable copy was read, not written.
- No `src/`, README, CHANGELOG, ADR, EPIC or board edit.
- No push, force, amend, rebase or merge.
- No foreign process was touched or recorded beyond class and count.
