# PREREG shape for bundle 1's read, sealed before any build and before any run. QE fills the blanks marked `<…>` and seals its own PREREG before any game. QE adds no bar and drops none, and it changes no line outside a blank. Nothing here was run

Architect/Design, task `arch-owner-answers-1104b`, records only, on `grugops/arch-owner-answers-1104b` from `main` `65e28f95`. Sources: the owner's word `orch-2026-10-30a` `…3e73f9f9`; `ADR-0056` § the bundle read (B1–B7) and its dated block of this task; `ADR-0072` d7–d11; `ADR-0073` d8–d12; PREREG `…aa5c4dc1`; the form `qe-ABC-283` `…f774e6d9` used. Every row and bar below is `ADR-0056`'s dated block, by reference. If this note and that block differ, the block governs and QE reports the difference.

## 1. The parts (fixed; no blank)
- `ABC-286`, P4, `ADR-0072`, form **M3**: T = 4 / 7 / 12, d ≤ 3, key-0 quiets only, three non-pawn pieces.
- `ABC-288`, O2c, `ADR-0073`, form **C1**: the countermove alone. Continuation history is not in the bundle.
- `ABC-289` is not a part.
- The relation (B1): (a) a shared file; (b) P4 reads the order O2c moves; (c) P4 is held and O2c is marginal.
- The premises are not met. They were overridden by the owner's word (L2's drift and audit rows; CH3). This is stated in the PREREG's first line.

## 2. The builds (blanks)
- Bundle ticket: `<ABC-nnn>`, on branch `<branch>`.
- Candidate: `<sha>`, the last code and test commit; `src/` tree `<tree>`.
- Base: the merge-base `<sha>`; `src/` tree `<tree>`. Value-changing merges on `main` since `0cc9afd1`: `<list, or none>`.
- Production diff, base to candidate: `<files>`. UAT is not waived; QE's verdict signs it.
- Harness: `tools/rating/` tree `<tree>`; the `cutechess-cli` and `stockfish` sha256 values checked against the pins in `rating.ts`: `<yes>`.
- Arms, out of tree in `<scratch>`: B = `git archive <base>`, H = `git archive <candidate>`, H2 = a copy of H for the `NFR-008` twin.

## 3. The control and the intent (fixed)
- Control: 100 ms a move on both sides (`st=0.1`), `timemargin` 50 ms, level 5, self-play, openings 1–50 with both colours, one game at a time.
- Intent: **GAIN**. Both parts fire at 100 ms (`ADR-0072` d10, `ADR-0073` d11). The NEUTRAL line (43.0) does not apply.
- R-TC: the rules read no budget, deadline or environment.

## 4. The offline rows, before any game (QE's own driver, each row in its own process)
Copy `ADR-0056`'s dated block, tables 1 and 2, row by row. For each row QE writes the bar, the door, the figure read on `0cc9afd1`, and `<read>`.
- Base production `src/` equal to `0cc9afd1`'s: `<yes / no>`. If no, the door's counts are re-read on `<sha>`, both sets are listed, and no bar moves.
- The read does not start until every row of tables 1 and 2 is met (B6). A red there is a defect or a STOP, not a miss.

## 5. The reported rows (table 3 of that block)
Read with the offline rows. Each is printed with the figure on `0cc9afd1` beside it, and no verdict rides on it. The rule for a differing count is in that block. QE does not grade them and does not hold the read for them.

## 6. The read: once, in this order, each in one `flock <scratch>/host-test.lock` hold with nothing else in it
1. **C2′:** `node tools/rating/rating.ts d <candidate> <base> <out> --budget-ms 100 --rounds 50 --concurrency 1`.
   - **MET:** 100 of 100 games complete, 0 candidate faults, 0 losses on time, and a score **≥ 50.0 of 100**. The harness's `state:` label is not the verdict.
   - **Below 50.0:** NOT MET, final. Nothing merges, QE records a `failed-attempt` naming the bundle, and both parts return by B6. No re-play, no margin, no change of form, no subset.
   - **A base fault:** UNRESOLVED, re-run once.
   - **A harness or launch error before the first game** is not a read. It is recorded and the same command runs once more. Once a game has started, the read is the read.
2. **S′, a bar:** `node tools/rating/rating.ts r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`. E as pinned at the PREREG: `<1810, or the re-pinned value and its record>`.
   - **MET:** 10 of 10 complete, 0 faults, 0 losses on time, score ≥ 3.0 of 10. Below 3.0: 10 more games, and ≥ 7.0 of 20.
   - A collapse miss is NOT MET. A fault or a loss on time is a defect, back to the Software Engineer.
3. **The Levels deep lane, a bar:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose` on H, alone. MET at exit 0 with every test passed. A failure is a defect.

Reported with the read: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`, the largest overshoot. The credit is the bundle's (B5): no per-part Elo is stated or inferred.

## 7. Before the merge (B4)
`main` is merged into the branch, with no rewrite. Tables 1 and 2 are read again on the merged tree, with no games. Games run again only under C2′'s stale rule: a value-changing merge has moved the base.

## 8. The forecast (estimates, from `ADR-0072` § Consequences)
C2′ about 0.4 h, S′ about 10 min, the Levels deep lane about 10 min. Each is under 1 h. QE's forecast for the offline rows and the twin: `<minutes>`. Any single run forecast over 1 h goes to the Orchestrator first.

## 9. The verdict
- **MET:** every row of tables 1 and 2, C2′, S′ and the Levels lane. QE's verdict signs UAT. The reported rows go in the report with the gaps.
- **On MET and the merge:** `ADR-0072` and `ADR-0073` are in force, and a dated line names the ticket and the read (B5).
- **NOT MET:** B6. `ADR-0072` and `ADR-0073` return to PROPOSED, premise not met, and the pages to held.
