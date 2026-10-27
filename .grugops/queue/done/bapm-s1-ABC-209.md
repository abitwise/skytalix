---
subtask: bapm-s1-ABC-209
role: ba-pm
ticket: plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
ref: .grugops/context/bapm-s1-ABC-209/
branch: new grugops/bapm-s1-ABC-209 from main, worktree ../wt-bapm-s1-ABC-209
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# ABC-209: the S1 call after a NEUTRAL D (close or re-tune)

## Do
- Read Orchestrator `orch-2026-10-27a/…00f47145` and QE `qe-ABC-209/…e32e0ee4`, `…0932c037`, `…b3f525d2`. Use `bapm-s1-ABC-207` (`…f249ca34`) as the model.
- Make EPIC-008 S1's call for ABC-209. The delivery default is **close unmerged under S1**: a re-tune needs a second real-clock reading, beyond `…4c3f7639`. If you judge a re-tune worth it, write it as a **question for the owner** (what would change, why it could reach GAIN, ~6–12 h), not as a decision.
- **ABC-209 page:**
  - A dated close line (or a held-for-owner line), with front-matter per the ABC-205/207 convention.
  - The QE-209-c line: A6 says "one process across games", but the harness runs one per game. D still exercised the change, at ~98 %.
  - Sync the LOW carried in orch-2026-10-26x: A5's G6 sub-line and the DoR row-10 cells still read QE-205-c as open.
- **EPIC-008:** dated lines for proposal (ABC-209) not shipped, the M2/M3 effect, and whether **ABC-210** is pullable now. It was chained behind 209; say what its Ready trigger needs.
- Put the board card lines in your Result. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-s1-ABC-209`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-27T03:28Z): **ABC-209 closed unmerged under S1 (not delivered). S1's re-tune round is not taken, and no owner question is written. EPIC-008 dated. ABC-210's Ready trigger is met by this close; it is pullable after a DoR re-score that is owed.**

Records only. Branch `grugops/bapm-s1-ABC-209` in `../wt-bapm-s1-ABC-209`, cut from `main` `a5306773`. One commit,
**`d7384d32`**, not merged and not pushed. No npm, vitest or timing. No `src/` edit. Scratch:
`<scratchpad>/bapm209s1/` (the note bodies and the seal script).

Notes are in `.grugops/context/bapm-s1-ABC-209/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`
(context root: the worktree's `.grugops/context`; `at` 2026-10-27T03:28:00Z from `date -u`), and `readContext` read back 2 of 2:
- `20261027T032800Z-ba-pm-decision-492fb6ce`: the call;
- `20261027T032800Z-ba-pm-observation-5b15b48c`: the re-reads at `a5306773`. `git diff 64394974 a5306773 -- src data
  tools` is empty. `grugops/ABC-209` `bb6cf451` is not on `main`. `src/quiescence.ts:21-24` holds. `b5c67ab7` = ABC-208,
  D GAIN +38.4 ± 23.3 (`…0477ac64`).

| item | ruling |
|---|---|
| ABC-209 | **Closed unmerged under S1.** Frontmatter `status: dropped`, `column: Done` (ABC-205/207 convention). `adr:` now reads ACCEPTED, NOT in force on main (the ADR line is the Architect's). A dated banner and a `## Close`. D pooled over 800 games: +8.69 ± 18.25, NEUTRAL (X − Y = −9.56), the same load-free and by power. `A1`–`A5`, `A7` MET. Final under `…4c3f7639`. A delivery call under `…5aaf7cec`; the owner's veto is open |
| re-tune | **Not taken; no owner question.** (1) No variant is predicted to clear: the design ceiling was 0.94–0.97× nodes, and `T5` is a new design that changes `ADR-0025` again, with no measured effect. (2) Re-reading the build is barred; at +8.7, a new 800-game reading shows GAIN about 1 time in 7. (3) Cost: about 12.6 h ALONE, plus a build, an ADR and a QE hop; a second reading beyond `…4c3f7639`. (4) `P3`, and it holds `ABC-210` |
| page lines | **`QE-209-c`** under `A6`: one process per game (`restart=on`), not across games. The table persisted within each game, which D measured (98.2 % / 98.3 %). `ucinewgame` is `A2`'s, and the bar is unchanged. **The LOW from `orch-2026-10-26x` is synced:** `A5`'s `G6` sub-line and the two DoR row-10 cells now read `QE-205-c` closed (struck through, with a dated sync citing `…2ae5fc12` item 2) |
| kept / not owed | `grugops/ABC-209` `bb6cf451` and `grugops/qe-ABC-209` `694aa3af`: unmerged, not deleted. Failed attempt `…0932c037`. No revert owed. `QE-209-a`/`-b` travel with a re-open or re-cut only. Re-open path: the owner's veto (one round on his word, changing what is kept, e.g. `T5`), or a re-cut from `bb6cf451`, read as a second reading until he says otherwise |
| EPIC-008 | Three dated blocks. **§ Scope:** proposal 6 not shipped; one engine change unbuilt (`ABC-210`); `ABC-206` and `ABC-208` Done. **§ Success measures:** `M1` baseline stands, and proposal 6 is no longer a source; `M2`/`M3` untouched by 209; **`M2` line for `ABC-208` added** (none existed): `b5c67ab7`, GAIN +38.4 ± 23.3, S1 met. **Under the tickets table:** row 5 Done, row 6 closed, `ABC-210`'s needs. Gate rows, table cells and NFR-005 untouched |
| ABC-210 | **Ready trigger met by this close** ("`ABC-209` reaches Done, or BA/PM closes it under S1"), once it is on `main`. **Pullable after a BA/PM DoR re-score (owed).** The re-score clears row 10's hold, reads rows 3 and 5's dependency as met (the D base is its own merge-base, which carries 208 and not 209), and re-reads the cite `src/quiescence.ts:21-24` (it holds). It also adds the sibling reading lines (one final reading, frozen-clock pre-check, ALONE with `QE-207-g`/`QE-209-f`). Then In Design first (an ADR reversing `ABC-079`, plus an `ADR-0026` door; the owner's acceptance gates the reading and the merge). It is the epic's last engine change |

Files on the branch:
- `plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md` (+68/−9);
- `plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md` (+29);
- 2 notes (+112, +75).

Not touched: `src/`, `memory-bank/` (`ADR-0025`'s line is `arch-adr0025-not-in-force`'s), the ABC-210 and ABC-208 pages,
`plans/board.md`, `plans/traceability.md`, the config, and the EPIC-008 gate rows and table cells. In main's checkout,
only this queue record and its claim moved, uncommitted, for the Orchestrator.

Flag (LOW, not edited): the `ABC-208` page frontmatter still reads `status: ready` / `column: Ready`, but the board has it in
Done (merged `b5c67ab7`). It can be synced at the next BA/PM hop on that page, or with `ABC-210`'s re-score.

### Board card lines (for the Orchestrator; Backlog → Done for ABC-209; no other column moves)

- **ABC-209, Backlog → Done**, appended to its card: `**2026-10-27: CLOSED UNMERGED under S1 — NOT DELIVERED (bapm-s1-ABC-209, …492fb6ce; owner veto open). D pooled 800 NEUTRAL +8.69 ± 18.25 (final under …4c3f7639); S1 re-tune round not taken (no variant predicted: design ceiling 0.94–0.97× nodes, T5 is a new design; a re-read shows GAIN ~1 in 7; ~12.6 h + a 2nd reading needs the owner's word); QE-209-c page line placed; QE-205-c lines synced (orch-2026-10-26x LOW closed); ADR-0025 D4 accepted, not in force on main (Architect's line); code kept on grugops/ABC-209 @ bb6cf451 and grugops/qe-ABC-209 @ 694aa3af; main src unchanged, no revert owed. → Done (dropped).**`
- **ABC-210, stays in Backlog**, appended to its card: `2026-10-27 (bapm-s1-ABC-209, …492fb6ce): Ready trigger met (ABC-209 closed under S1); DoR re-score owed (BA/PM Ready hop: row 10 hold gone; D base = own merge-base, carries ABC-208; cite src/quiescence.ts:21-24 holds; one final reading, frozen-clock pre-check, ALONE), then pullable — In Design first (ADR reversing ABC-079 + ADR-0026 door → owner).`
- **EPIC-008**, appended to its card: `2026-10-27 (bapm-s1-ABC-209): proposal 6 (ABC-209) not shipped — closed under S1, D NEUTRAL +8.69 ± 18.25; 1 engine change unbuilt (ABC-210); M1 baseline stands; M2/M3 untouched by 209; M2 line for ABC-208 recorded (b5c67ab7, GAIN +38.4 ± 23.3, S1 met).`

### Trace row (10 cells, header order)

| ABC-209 (bapm-s1-ABC-209) | Closed unmerged under S1, NOT DELIVERED: D pooled 800 NEUTRAL +8.69 ± 18.25 (d1 −0.9 ± 25.3, d2 +18.3 ± 26.3; final under …4c3f7639); S1 re-tune round not taken (no variant predicted; T5 is a new design; a re-read shows GAIN ~1 in 7; a 2nd reading needs the owner's word); QE-209-c line placed; QE-205-c lines synced; re-open = owner veto or a re-cut from bb6cf451 | EPIC-008 | TT kept across the moves of one game behind a game token (not shipped); ADR-0025 D4 amendment accepted, not in force on main | NFR-005 G6 MET, G2 MET, NFR-009 A4 within 1 MiB; no bound moved; EPIC-008 gate rows untouched; notes …e32e0ee4, …0932c037, …b3f525d2, …00f47145, …492fb6ce, …5b15b48c | grugops/bapm-s1-ABC-209 @ d7384d32 (records only)<br>code kept unmerged on grugops/ABC-209 @ bb6cf451 and grugops/qe-ABC-209 @ 694aa3af; main src/data/tools = 64394974 (no revert owed) | — (records only; QE reading final, …0932c037) | UAT not signed (QE FAIL; nothing ships) | BA/PM: ABC-210 DoR re-score (trigger met); Architect: ADR-0025 not-in-force line; QE-209-a/-b not owed | Done (dropped): closed unmerged under S1, 2026-10-27 |
