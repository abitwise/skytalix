---
subtask: bapm-close-ABC-205
role: ba-pm
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/bapm-close-ABC-205/
branch: new grugops/bapm-close-ABC-205 from main, worktree ../wt-bapm-close-ABC-205
width: 1 of 3 (beside arch-adr0031-status; records only — no npm, vitest or timing)
---

# Close ABC-205 unmerged under S1; unblock ABC-207 / ABC-215

## Do
- Read Orchestrator `arch-rule-ABC-205-g6/…154f2ced`, Architect `…912bcb0d`, QE `qe-ABC-205/…234d9814`.
- ABC-205 page: dated close line (closed unmerged under S1: G6 "≥ base" missed on position-6; D not run, not owed; forms kept on `grugops/ABC-205-final`; re-open path). Frontmatter status → closed per repo convention.
- EPIC-008: dated lines (proposal 1 not shipped; M1 baseline stands; M2/M3 untouched).
- ABC-207 and ABC-215: check their "ABC-205 closed under S1" Ready trigger and DoR; move to Ready if met (say which), else name the missing input. Add to each a process line (no bound): before its one real-clock reading, QE reports frozen-clock nodes to depths 7 and 8 on kiwipete and position-6 for base and head.
- Do not touch NFR-005 or EPIC-008's G6 text (owner question open). Give the board card lines in your Result; don't edit the board.

## Fences
- Only your worktree and `<scratchpad>/bapm205close/`. No `src/`. Do NOT run npm/vitest. Never push, force, amend or rebase; never merge into main. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task bapm-close-ABC-205). `## Result` + 10-cell trace rows into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-25T04:40Z): **ABC-205 closed unmerged under S1 (not delivered). EPIC-008 dated. ABC-207 and ABC-215 → Ready (DoR 10/10 each), with the frozen-clock pre-check.**

Records only. Branch `grugops/bapm-close-ABC-205` in `../wt-bapm-close-ABC-205`, cut from `main` `bb9fd7ef`. One
commit, **`c92c079f`**, not merged and not pushed. No npm, vitest or timing was run. No `src/` edit. Scratch:
`<scratchpad>/bapm205close/` (the seal script only).

Notes are in `.grugops/context/bapm-close-ABC-205/notes/`. They were sealed with grugops 2.1.0 `context-io.js`
`admitAndAppend` (context root: the worktree's `.grugops/context`), and `readContext` read back 2 of 2:
- `20261025T043809Z-ba-pm-decision-84a05b3a`: the rulings;
- `20261025T043809Z-ba-pm-observation-2e070b37`: the re-reads at `bb9fd7ef`. They show:
  - `git diff d5690c5c bb9fd7ef -- src data tools` is empty;
  - the M1 baseline `3497aad2` carries none of ABC-205's code;
  - the ABC-215 `A1` counts are 1 and 1;
  - ABC-207's line cites shifted by +2;
  - the `dropped` convention.

| item | ruling |
|---|---|
| ABC-205 | **Closed unmerged under S1** ("closes or re-cuts it"). The frontmatter is `status: dropped`, `column: Done`. That is the repo convention for a close without delivery (6 pages); no page uses `closed`. There is a dated banner under the title and a `## Close` section at the end. G6 "≥ base" missed on position-6 (head 7, base 8). S1's one re-tune round is not taken: no counted variant clears, and a new reading needs the owner's word. D was not run and is not owed. The forms stay on `grugops/ABC-205-final` `b5d5cea5`. No revert of `7c9cd9b9` is owed. **Re-open path:** the owner's veto sends it back to In Review (Blocked), with Architect options 1 or 3 on his word. Otherwise a new BA/PM cut from `b5d5cea5` owes its own G6 and D, the pre-check, and option 1's owner words |
| EPIC-008 | Three dated lines. **§ Scope:** proposal 1 is not shipped. **§ Success measures** (after the M1 box): the M1 baseline stands, and proposal 1 is no longer a source for the +100; M2 and M3 are untouched. **Under the tickets table:** ABC-207's and ABC-215's ABC-205 dependency is met by the close; each one's D base is its own merge-base; the two run one at a time and the Orchestrator orders them; the pre-check is noted. **G6 row, NFR-005 and the table cells are untouched** |
| ABC-207 | **→ Ready, DoR 10/10.** Its trigger, "ABC-205 reaches Done, or BA/PM closes it under S1", is met, and ABC-204 is Done (`7f94e4cc`). Rows 3, 5, 7 and 10 were re-scored. Test note 4 is the pre-check. The Problem cites were re-read: they are now `:201` and `:357-358`. **Risk, not a blocker:** the Architect expects its eval cost to be above ABC-205's (`UNKNOWN - verify`), so a "≥ base" miss is likely, and the pre-check is there to catch it |
| ABC-215 | **→ Ready, DoR 10/10** (In Design first: the rules and the moved-pin probe). Its trigger is met: ABC-214 merged (`59f50717`; `A1` counts 1 and 1 at `bb9fd7ef`), ABC-205 closed, ABC-204 Done. Rows 5, 7 and 10 were re-scored. Test note 6 is the pre-check. Dated scope lines: the same 7 arrays, `KING_TABLE` untapered, and none of ABC-205's constants on main. § Size's "split before Ready" now reads "returns from In Design and is split before Ready for Dev" |
| pre-check (both) | **A process step, no bound.** Before the ticket's real-clock G6 reading, QE reports the frozen-clock nodes needed to complete depths 7 and 8 (`chooseMove`, `now: () => 0`, `maxDepth: k`) on kiwipete and position-6, for base and head (8 counts). A head count above base's, at a depth that a value-identical base straddled at 3 s (today: position-6 d8, 3 of 5), predicts a miss. QE then stops to Architect/Design before the run, with no re-level. With no such base reading, QE gives the counts without a prediction. G6 is still read as written |
| owner question QE-205-c | **Open, not touched.** The default keeps "≥ base" graded as written, so it blocks neither Ready move. If he changes it, BA/PM re-words the tickets' G6 rows on his word |

Files on the branch:
- `plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md` (+37/−2);
- `plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md` (+20);
- `plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md` (+36/−2);
- `plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md` (+38/−2);
- 2 notes.

Not touched: `src/`, `memory-bank/` (ADRs included: the `arch-adr0031-status` hop owns ADR-0031), `plans/nfr-catalog.md`
(NFR-005), EPIC-008's G6 row, `plans/board.md`, `plans/traceability.md`, the config, and git config. In main's
checkout, only this queue record and its claim moved, uncommitted, for the Orchestrator.

### Board card lines (for the Orchestrator; Ready WIP 0/8 → 2/8, In Review 1/3 → 0/3)

- **ABC-205, In Review → Done**, appended to its card: `**2026-10-25: CLOSED UNMERGED under S1 — NOT DELIVERED (`bapm-close-ABC-205`, `…84a05b3a`; delivery call `…154f2ced`, owner veto open). G6 "≥ base" missed on position-6 (head 7 < base 8, final under …4c3f7639); D not run, not owed; forms kept on grugops/ABC-205-final @ b5d5cea5; no revert of 7c9cd9b9 owed. → Done (dropped).**`
- **ABC-207, Backlog → Ready**, replacing the tail of its card: `DoR 10/10 — Ready 2026-10-25 (`bapm-close-ABC-205`, `…84a05b3a`): trigger met (ABC-205 closed under S1; ABC-204 Done); D base = own merge-base on main; one at a time with ABC-215 (default ABC-215 first); frozen-clock d7/d8 pre-check before the real-clock G6 reading (process, no bound). ADR only if the ADR-0031 form changes; ±100 cp cap, ≤ 1 100 ns; D: S1`
- **ABC-215, Backlog → Ready**, replacing `DoR 9/10 — Backlog until …`: `DoR 10/10 — Ready 2026-10-25 (`bapm-close-ABC-205`, `…84a05b3a`), In Design first (rules + moved-pin probe): trigger met (ABC-214 merged 59f50717, A1 counts 1/1; ABC-205 closed under S1; ABC-204 Done); D base = own merge-base on main; one at a time with ABC-207; frozen-clock d7/d8 pre-check before the real-clock G6 reading (process, no bound)` (the rest of the card is unchanged)

### Trace rows (10 cells, header order)

| ABC-205 (bapm-close-ABC-205) | Closed unmerged under S1, NOT DELIVERED: G6 "≥ base" missed on position-6 (head median 7 < base 8; final under …4c3f7639); S1 re-tune round not taken (no counted variant predicted to clear, …00c6a18d); D not run, not owed; re-open = owner veto (Architect options 1/3) or a new BA/PM cut from b5d5cea5 | EPIC-008 | king safety: queen scale ×3, tapered gated king square (not shipped) | NFR-005 G6 ≥ base: no bound moved, G6 text untouched (owner question QE-205-c open); notes …234d9814, …912bcb0d, …154f2ced, …84a05b3a, …2e070b37 | grugops/bapm-close-ABC-205 @ c92c079f (records only)<br>forms kept unmerged on grugops/ABC-205-final @ b5d5cea5; main src/data/tools = d5690c5c (no revert of 7c9cd9b9 owed) | — (records only; QE reading final, …a44d9079) | UAT not signed (QE FAIL; nothing ships) | — | Done (dropped): closed unmerged under S1, 2026-10-25 |
| ABC-207 (bapm-close-ABC-205) | Ready trigger met (ABC-205 closed under S1; ABC-204 Done); DoR 10/10; frozen-clock d7/d8 pre-check before the real-clock G6 reading added (Test note 4; process, no bound); D base = own merge-base | EPIC-008 | per-piece mobility weights + early-queen term | G2 ≤ 1 100 ns; NFR-005 G6 depth ≥ 6 and ≥ base (as written; QE-205-c open); NFR-004, NFR-008 re-read; risk: eval cost above ABC-205's expected (UNKNOWN - verify) | grugops/bapm-close-ABC-205 @ c92c079f (page only) | — | owed (QE signs) | — | Ready (Backlog → Ready, BA/PM 2026-10-25) |
| ABC-215 (bapm-close-ABC-205) | Ready trigger met (ABC-214 merged 59f50717, A1 counts 1/1 at bb9fd7ef; ABC-205 closed under S1; ABC-204 Done); DoR 10/10, In Design first; frozen-clock d7/d8 pre-check added (Test note 6; process, no bound); scope re-read: same 7 arrays, KING_TABLE untapered | EPIC-008 | own evaluation values by rule; CC BY-SA carve-out removed | G2 ≤ 1 100 ns; NFR-005 G6 depth ≥ 6 and ≥ base (as written; QE-205-c open); G5, G8, G9; D: S3 | grugops/bapm-close-ABC-205 @ c92c079f (page only) | — | owed (QE signs) | — | Ready (Backlog → Ready, BA/PM 2026-10-25) |
