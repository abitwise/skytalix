---
subtask: bapm-s1-ABC-207
role: ba-pm
ticket: plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
ref: .grugops/context/bapm-s1-ABC-207/
branch: new grugops/bapm-s1-ABC-207 from main, worktree ../wt-bapm-s1-ABC-207
width: 1 of 3 (records only — no npm, vitest or timing)
---

# ABC-207: S1 re-tune-or-close call after D LOSS

## Do
- Read Orchestrator `orch-2026-10-26a/…5c59d85e` and QE `qe-ABC-207/…cc744e8c`, `…243de4b1`, `…138c1740` (findings QE-207-a/-b/-c/-f).
- Make EPIC-008 S1's call for ABC-207. The delivery default is **close unmerged under S1**: a re-tune needs a second real-clock reading, which is beyond the owner's one-reading-per-ticket scope reading (`…4c3f7639`). If you judge a re-tune worth it, write it as a **question for the owner** (what would change, why it could reach GAIN, its cost of ~6–12 h), not as a decision.
- ABC-207 page: a dated close line (or a held-for-owner line); frontmatter per repo convention (as ABC-205). EPIC-008: dated lines (proposal 4 not shipped; M2/M3 effect; the remaining EPIC-008 tickets and whether any are pullable).
- Give the board card lines in your Result; don't edit the board.

## Fences
- Only your worktree and `<scratchpad>/bapm207s1/`. No `src/`. Do NOT run npm/vitest/timing. Never push, force, amend or rebase; never merge into main. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task bapm-s1-ABC-207). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-26T01:00Z): **ABC-207 closed unmerged under S1 (not delivered). S1's re-tune round is not taken, and no owner question is written. EPIC-008 dated. ABC-208 is the one pullable ticket, after a DoR re-score that is owed.**

Records only. Branch `grugops/bapm-s1-ABC-207` in `../wt-bapm-s1-ABC-207`, cut from `main` `23181cc2`. One commit,
**`2134adab`**, not merged and not pushed. No npm, vitest or timing. No `src/` edit. Scratch: `<scratchpad>/bapm207s1/`
(the note bodies and the seal script).

Notes are in `.grugops/context/bapm-s1-ABC-207/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`
(context root: the worktree's `.grugops/context`), and `readContext` read back 2 of 2:
- `20261026T005931Z-ba-pm-decision-f249ca34`: the call;
- `20261026T005931Z-ba-pm-observation-90fcb201`: the re-reads at `23181cc2`. `git diff 7020cca3 23181cc2 -- src data tools`
  is empty, and `main` has the scalar `MOBILITY_WEIGHT = 4`. `5477df21` is not on `main`. `ABC-206` merged as `0a9390e5`,
  and ABC-208's cite moved `:69-71` → `:73-74`.

| item | ruling |
|---|---|
| ABC-207 | **Closed unmerged under S1.** Frontmatter `status: dropped`, `column: Done` (the ABC-205 convention), a dated banner, and a `## Close` section. D pooled over 800 games read −18.26 ± 16.49, LOSS. Load-free it reads −18.1 ± 16.8, the same grade. `A1`–`A4` MET. Final under `…4c3f7639`. A delivery call under `…5aaf7cec`; the owner's veto is open |
| re-tune | **Not taken, and no owner question.** (1) GAIN needs X > about +16.5 over 800 games, a swing of about 35 Elo, on a `P3` proposal. (2) No variant is predicted to clear: the cause and the weights/term split were not measured. (3) `QE-207-f`: base already plays d3 before 4.Qa4, and head changed none of the five `G11` choices. (4) A second real-clock reading of 6–12 h, beyond `…4c3f7639` |
| kept / not owed | `grugops/ABC-207` `5477df21` and `grugops/qe-ABC-207` `ab39b73f`: unmerged, not deleted. Failed attempt `…243de4b1`. No revert owed. `QE-207-b`/`-c` not owed. Re-open: the owner's veto (one round on his word), or a re-cut from `5477df21`, read as a second reading until he says otherwise |
| EPIC-008 | Three dated lines. **§ Scope:** proposal 4 not shipped; four engine changes unbuilt (208–211). **§ Success measures:** `M1` baseline stands, proposal 4 is no longer a source for the +100; `M2`/`M3` untouched. **Under the tickets table:** row 4 closed, plus the remaining tickets and whether each is pullable. Gate rows, table cells and NFR-005 untouched |
| remaining | **`ABC-208`** (M, P2): trigger met since 2026-10-24 (`0a9390e5`) and never re-scored. **Pullable after a BA/PM DoR re-score (owed)**, then In Design first (new ADR + `ADR-0026` door). **`ABC-209`/`ABC-210`:** not pullable (chained behind 208, then 209). **`ABC-211`:** not pullable (Architect/Design source ruling, `ADR-0023` → owner; no hop routed; it could run beside the engine tickets). Closing `M1` R comes at the epic's close |

Files on the branch:
- `plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md` (+44/−2);
- `plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md` (+23);
- 2 notes (+94, +60).

Not touched: `src/`, `memory-bank/`, `plans/nfr-catalog.md`, the EPIC-008 gate rows and table cells, the ABC-208 page,
`plans/board.md`, `plans/traceability.md`, the config. In main's checkout, only this queue record and its claim moved,
uncommitted, for the Orchestrator.

### Board card lines (for the Orchestrator; Backlog → Done for ABC-207; no other column moves)

- **ABC-207, Backlog → Done**, appended to its card: `**2026-10-26: CLOSED UNMERGED under S1 — NOT DELIVERED (bapm-s1-ABC-207, …f249ca34; owner veto open). D pooled 800 −18.26 ± 16.49 LOSS (final under …4c3f7639); S1 re-tune round not taken (≈ 35 Elo short of GAIN, no variant predicted, QE-207-f: 4.Qa4 gone at base, a 2nd reading needs the owner's word); code kept on grugops/ABC-207 @ 5477df21 and grugops/qe-ABC-207 @ ab39b73f; main src unchanged, no revert owed. → Done (dropped).**`
- **ABC-208, stays in Backlog**, appended to its card: `2026-10-26 (bapm-s1-ABC-207, …f249ca34): Ready trigger met since 2026-10-24 (ABC-206 merged 0a9390e5); DoR re-score owed (BA/PM Ready hop; cite engine.ts:69-71 → :73-74), then pullable — In Design first.`
- **EPIC-008**, appended to its card: `2026-10-26 (bapm-s1-ABC-207): proposal 4 (ABC-207) not shipped — closed under S1, D LOSS; 4 engine changes unbuilt (208–211); M1 baseline stands; M2/M3 untouched.`

### Trace row (10 cells, header order)

| ABC-207 (bapm-s1-ABC-207) | Closed unmerged under S1, NOT DELIVERED: D pooled 800 −18.26 ± 16.49 LOSS (load-free −18.1 ± 16.8; final under …4c3f7639); S1 re-tune round not taken (≈ 35 Elo short; no variant predicted; QE-207-f motivating move gone at base; a 2nd reading needs the owner's word); re-open = owner veto or a re-cut from 5477df21 | EPIC-008 | per-piece mobility weights + early-queen term (not shipped) | G6 MET, G2 MET, no bound moved; NFR-005 and the EPIC-008 gate rows untouched (QE-205-c open); notes …cc744e8c, …243de4b1, …138c1740, …5c59d85e, …f249ca34, …90fcb201 | grugops/bapm-s1-ABC-207 @ 2134adab (records only)<br>code kept unmerged on grugops/ABC-207 @ 5477df21 and grugops/qe-ABC-207 @ ab39b73f; main src/data/tools = 7020cca3 (no revert owed) | — (records only; QE reading final, …243de4b1) | UAT not signed (QE FAIL; nothing ships) | BA/PM: ABC-208 DoR re-score (trigger met); QE-207-b/-c not owed | Done (dropped): closed unmerged under S1, 2026-10-26 |
