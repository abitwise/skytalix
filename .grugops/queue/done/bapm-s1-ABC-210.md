---
subtask: bapm-s1-ABC-210
role: ba-pm
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/bapm-s1-ABC-210/
branch: new grugops/bapm-s1-ABC-210 from main, worktree ../wt-bapm-s1-ABC-210
width: 1 of 2 — records only (no npm, vitest, build or timing)
---

# ABC-210: the S1 call after a NEUTRAL D (close or re-tune), and EPIC-008's close path

## Do
- Read Orchestrator `orch-2026-10-27k/…85e9c9b2` and QE `qe-ABC-210/…b953e670`, `…86b45c13`, `…e7597a78`. Use `bapm-s1-ABC-209` as the model.
- Make EPIC-008 S1's call for ABC-210. The delivery default is **close unmerged under S1**: a re-tune needs a second real-clock reading, beyond `…4c3f7639`. If you judge a re-tune worth it, write it as a **question for the owner** (what would change, why it could reach GAIN, ~6–12 h), not as a decision.
- **ABC-210 page:** a dated close line (or held-for-owner line), front-matter per the ABC-205/207/209 convention (this also clears the stale ready/Ready LOW). Note QE-210-b (LOW, closed as blind spot) for any re-cut.
- **EPIC-008:** dated lines for proposal (ABC-210) not shipped and the M2/M3 effect. ABC-210 was the last engine change: state the epic's **close path** — the closing M1 R reading (`ABC-204` A4 protocol, E 1 910 frozen, 200 games, ALONE), the M1 rule (≥ +100 and interval above 0, owner Q1), and the close item already on the card (full 30-architecture re-pass). Say which role owns each step and in what order. Don't run anything.
- Put the board card lines in your Result. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-s1-ABC-210`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-27T19:40Z): **ABC-210 closed unmerged under S1 (not delivered). S1's re-tune round is not taken, and no owner question is written. EPIC-008 dated: no engine change remains, and the epic's close path is stated (5 steps, owners named).**

Records only. Branch `grugops/bapm-s1-ABC-210` in `../wt-bapm-s1-ABC-210`, cut from `main` `06c1ecc8`. One commit,
**`f6b62f94`**, not merged and not pushed. No npm, vitest or timing. No `src/` edit and no ADR edit. Scratch:
`<scratchpad>/bapm210s1/` (the note bodies and the seal script).

Notes are in `.grugops/context/bapm-s1-ABC-210/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`
(context root: the worktree's `.grugops/context`; `at` 2026-10-27T19:40:08Z from `date -u`), and `readContext` read back 2 of 2:
- `20261027T194008Z-ba-pm-decision-ff16a93d`: the call and the close path;
- `20261027T194008Z-ba-pm-observation-967b3359`: the re-reads at `06c1ecc8`. `git diff a17d5945 06c1ecc8 -- src data
  tools` is empty. `grugops/ABC-210` `a96f36b0` and `grugops/qe-ABC-210` `16032408` are not on `main`. `checkExtension`
  0 hits on `main`. `zugzwang.005` is still at depth 12. `src/quiescence.ts:21-24` holds.

| item | ruling |
|---|---|
| ABC-210 | **Closed unmerged under S1.** Front-matter `status: dropped`, `column: Done` (the ABC-205/207/209 convention; this clears the stale `ready`/`Ready` LOW). `adr:` reads `ADR-0051` ACCEPTED (`…047d411f`, with P2), NOT in force on `main`, and P2 did not land (the ADR lines are the Architect's). A dated banner, a dated `A5` NOT MET line, and a `## Close`. D pooled over 800 games: −4.78 ± 16.21, NEUTRAL (X − Y = −20.98), the same overlap-free, load-free and by power. `A1`–`A4` and `A6` MET. Final under `…4c3f7639`. A delivery call under `…5aaf7cec`; the owner's veto is open |
| re-tune | **Not taken; no owner question.** (1) No variant is predicted to clear. The design probe already tried the knobs: the cap tunes nothing (1/2/3/none within 0.1 %), +2 plies fails `A2`, every node fails `A3` (1.69×) and `G1`, PV-only is close to a no-op, and form (b) reverses `ADR-0024` d4. (2) Re-reading is barred; at −4.8, a new 800-game reading shows GAIN about 1 time in 180. (3) Cost: about 11.5 h of D (12.7 h claim), plus a build, an ADR, a QE hop and a second reading. (4) `P3`, and it holds the epic's close |
| page lines | **`QE-210-b`** (LOW, closed as a blind spot) is in § Close, for any re-cut: the dead-position / 75-move line goes into its test notes, and whether to add a row or state the blind spot again is its design hop's call. `QE-210-a`/`-c` INFO; `-d` changes no grade; `QE-207-g` is the Orchestrator's |
| kept / not owed | `grugops/ABC-210` `a96f36b0` and `grugops/qe-ABC-210` `16032408`: unmerged, not deleted. Failed attempt `…86b45c13`. No revert owed. Re-open path: an owner veto (one round on his word, naming a form or bar the probe has not already failed; the closing R waits on its verdict), or a re-cut from `a96f36b0`, read as a second reading until he says otherwise |
| EPIC-008 | Three dated blocks. **§ Scope:** proposal 7 not shipped; no engine change remains. Shipped: `ABC-206`, `ABC-208`, and `ABC-215` (S3). **§ Success measures:** the `M1` baseline stands; the +100 rests only on what merged. A forecast (`UNKNOWN - verify`): the D estimates sum to about +54, and "≥ +100" looks unlikely; "above 0" needs about +71. No bar moves. `M2` and `M3` are untouched by 210. **Under the tickets table:** row 7 closed, and the close path (next row). Gate rows, table cells and NFR-005 untouched |
| close path | **1. Orchestrator:** merge this close and `arch-adr0051-not-in-force`; move `ABC-210` to Done (dropped); write the trace; tell the owner. Vetoes on 207/209/210 are open, and a veto that comes before step 3 holds step 3. **2. Architect/Design:** the full `30-architecture.md` re-pass (the card's close item, `…cdc1fb61`, including the `virtual-clock.ts` count). Records only, run before step 3. **3. QE/E2E:** the closing `M1` R on one `main` sha (`src/` and `data/` = `b5c67ab7`'s) by `ABC-204` `A4`'s frozen protocol: E 1 910 with no E step, 200 games, ALONE, AC, pre-registered, one run and final (`…4c3f7639`), about 4.4 h. Plus the `M3` gates `G1`, `G5`, `G6`, `G8` and `G9` on the same sha; `G6` "≥ base" is read against the `M1` baseline sha `3497aad2`. **4. BA/PM:** grade `M1` (≥ +100 AND interval √(50.3² + Y₂²) above 0, Q1), `M2` (206 read under its waiver `…cb10c36c`), `M3` and `M4`; write the epic's close; sync the stale front-matter on Done pages. A NOT MET `M1` still closes the epic, and more work is the owner's call. **5. Orchestrator:** board, trace, and the `M1` result to the owner |

Files on the branch:
- `plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md` (+66/−3);
- `plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md` (+57);
- 2 notes (+135, +97).

Not touched: `src/`, `memory-bank/` (the `ADR-0051` and `ADR-0050` d9 lines are `arch-adr0051-not-in-force`'s), `AGENTS.md`,
`plans/board.md`, `plans/traceability.md`, the config, and the EPIC-008 gate rows and table cells. In main's checkout, only
this queue record and its claim moved. They are uncommitted, for the Orchestrator.

Flag (LOW, not edited): the page front-matter of the Done tickets `ABC-204` and `ABC-206` (`in-review`) and `ABC-215` and
`ABC-217` (`ready`) is stale against the board. The fix is close-path step 4.

### Board card lines (for the Orchestrator; Backlog → Done for ABC-210; no other column moves)

- **ABC-210, Backlog → Done**, appended to its card: `**2026-10-27: CLOSED UNMERGED under S1 — NOT DELIVERED (bapm-s1-ABC-210, …ff16a93d; owner veto open). D pooled 800 NEUTRAL −4.78 ± 16.21 (final under …4c3f7639); S1 re-tune round not taken (no variant predicted: the cap tunes nothing, +2 plies fails A2, every-node fails A3 1.69× + G1 53/58, PV-only ~no-op, form (b) reverses ADR-0024 d4; a re-read shows GAIN ~1 in 180; ~11.5 h + a 2nd reading needs the owner's word); QE-210-b carried for any re-cut; ADR-0051 accepted, not in force on main, P2 not landed (Architect's lines); code kept on grugops/ABC-210 @ a96f36b0 and grugops/qe-ABC-210 @ 16032408; main src unchanged, no revert owed. → Done (dropped).**`
- **EPIC-008**, appended to its card: `2026-10-27 (bapm-s1-ABC-210, …ff16a93d): proposal 7 (ABC-210) not shipped — closed under S1, D NEUTRAL −4.78 ± 16.21; NO engine change remains (shipped: 206, 208; 215 under S3). M1 baseline stands; +100 forecast unlikely (D sum ~+54, UNKNOWN - verify; R decides); M2/M3 untouched by 210. **Close path:** (1) Orchestrator lands this close + arch-adr0051-not-in-force, tells the owner (a veto before step 3 holds it) → (2) Architect: 30-architecture re-pass (the close item above) → (3) QE: closing M1 R, ABC-204 A4 frozen protocol, E 1 910, 200 games, ALONE, one run final, + M3 gates on the same sha (G6 vs 3497aad2) → (4) BA/PM grades M1 (≥ +100 AND interval > 0) – M4, writes the epic close → (5) Orchestrator: EPIC-008 → Done, M1 to the owner.`

### Trace row (10 cells, header order)

| ABC-210 (bapm-s1-ABC-210) | Closed unmerged under S1, NOT DELIVERED: D pooled 800 NEUTRAL −4.78 ± 16.21 (d1 −1.7 ± 22.8, d2 −7.8 ± 23.0; final under …4c3f7639); S1 re-tune round not taken (no variant predicted by the design probe; a re-read shows GAIN ~1 in 180; a 2nd reading needs the owner's word); QE-210-b carried for any re-cut; re-open = owner veto or a re-cut from a96f36b0 | EPIC-008 | Check extension at the horizon, +1 ply, cap 1 per line, behind an ADR-0026 off-door pair (not shipped); ADR-0051 accepted, not in force on main; P2 (ADR-0050 d9) not landed | NFR-005 G6 MET (≥ base), G2 MET, NFR-004 G5 MET, NFR-009 G7 MET, NFR-008 G8 8.55 s; no bound moved; EPIC-008 gate rows untouched; notes …b953e670, …86b45c13, …e7597a78, …85e9c9b2, …ff16a93d, …967b3359 | grugops/bapm-s1-ABC-210 @ f6b62f94 (records only)<br>code kept unmerged on grugops/ABC-210 @ a96f36b0 and grugops/qe-ABC-210 @ 16032408; main src/data/tools = a17d5945 (no revert owed) | — (records only; QE reading final, …86b45c13) | UAT not signed (QE FAIL; nothing ships) | Orchestrator: land close + EPIC-008 close path (Architect 30-arch re-pass → QE closing M1 R ALONE + M3 gates → BA/PM grades M1–M4); Architect: ADR-0051 not-in-force + ADR-0050 d9 P2 lines | Done (dropped): closed unmerged under S1, 2026-10-27 |
