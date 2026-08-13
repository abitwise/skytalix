---
id: 20260813T221658Z-ba-pm-artifact-ref-four-tickets-cut-and-everything-this-hop-did-not-touch-50566edd
kind: artifact-ref
by: ba-pm
at: 2026-08-13T22:16:58Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - ABC-053
  - ABC-054
  - ABC-055
  - ABC-056
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# Four tickets CUT, none folded. The diff, the budget numbers, and the seven things this hop deliberately did not touch.

## Where the work is

**Branch `grugops/refinement-ABC-041-a4`**, worktree `../cli-chess-bapm041`, cut off the QE tip
`1d67f8f`. **Nothing merged, nothing deployed, nothing committed on `main` or on any other agent's
branch.** Queue claim taken by hand per `AGENTS.md`: `mkdir -p .grugops/queue/claimed` then a **bare**
`mkdir` (no `-p`) of `.grugops/queue/claimed/refinement-ABC-041-a4/` in the MAIN repo — exit 0, so the
claim was won; `EEXIST` would have meant it was lost and this hop would have stopped.
`scripts/claim.js` does not exist here.

## The diff

```
plans/tickets/ABC-041-render-seam-closure.md                    +115 / -21   the repair
plans/tickets/ABC-053-frame-path-probe-measures-load-time.md    +170        new
plans/tickets/ABC-054-import-guards-count-statements-not-consumers.md +147  new
plans/tickets/ABC-055-board-renders-ten-of-thirteen-columns.md  +148        new
plans/tickets/ABC-056-ar-1-accepted-risk-has-drifted.md         +152        new
plans/board.md                                                  +8 / -4     header + 4 Backlog rows
plans/tickets/history/ABC-041-board-history.md                  +6          the archived header
plans/traceability.md                                           +6          4 rows + 1 update header
.grugops/context/refinement-ABC-041-a4/notes/                   6 notes
git diff --numstat -- src/                                      EMPTY
```

**`src/` is byte-untouched — checked, not asserted.** Not the module, not the test file.

## The four, and why each is a ticket rather than a paragraph on `ABC-041`

| id | subject | owner named on the page | size | pri | DoR | new test files |
|---|---|---|---|---|---|---|
| `ABC-053` | the probe measures LOAD-time closure; `NFR-002`'s premise is the PER-FRAME path | **Architect/Design** (`ADR-0011`'s own words) | `S` | `P1` | 9/10 ⚠️×1 | 0 |
| `ABC-054` | two guards count import STATEMENTS not consumers — false GREEN on `A8`, false RED on the licence guard | **Architect/Design** | `S` | `P1` | 8/10 ⚠️×2 | 0 |
| `ABC-055` | the board defines 13 columns and renders 10 | BA/PM cut; board is the Orchestrator's | `S` | `P2` | **10/10** | 0 |
| `ABC-056` | `AR-1`'s override reason covers `brace-expansion` only | **Release Manager** (unchanged from `AR-1`) | `XS` | `P2` | 9/10 ⚠️×1 | 0 |

**Prose budget (`AGENTS.md` § Process rules, rule 2): 170 / 147 / 148 / 152 lines, median 150,
against ≤ 300.** `ABC-041` itself is **300** after the repair, up from 223 — at the budget, not over
it, and the measurements behind every added line are in these notes rather than on the page.

**Zero new test files across all four**, which matters: `EPIC-003` plans 7–8 and `EPIC-006` 3–4
against a post-`threads` planning number of ~10. `ABC-053` states that a genuinely new probe file is a
**re-size to `M`**, so the lane cost cannot be absorbed silently.

**The two Architect/Design rulings were cut APART on purpose.** They share a file
(`src/history-pane.nfr.test.ts`) and share no question — one is about *when* the guard measures, the
other about *what* it counts. `ABC-054` names the file conflict so whoever runs both sequences them.

## Deliberately NOT touched — stated rather than silently skipped

1. **`src/` — nothing.** The test rows that follow the new wording are the Engineer's next hop and
   must be written against this text, not ahead of it.
2. **`ABC-041`'s board column.** It stays `In Review` (1/3). **No ticket was moved by this hop**, and
   no WIP count changed except `Backlog`, which is unlimited.
3. **`ABC-041`'s Definition-of-Ready score.** Not re-scored — the ticket is in flight, not being
   pulled. The 10/10 table is left standing with a dated fence line naming items 4 and 6 as citing
   phrases this repair refuted. A 10/10 that survived a gate refutation is what a well-formed-but-
   wrong criterion looks like, and erasing it would corrupt rule 1's own control.
4. **`ABC-042`'s trigger section.** Flagged with ready-to-paste text in the sibling `decision`; owed
   to the Orchestrator to sequence before that pull.
5. **`agent-factory/…`.** Read-only KIT. The DoR line Security recommended could not be written there
   and is escalated to the owner instead.
6. **The queue `pending → done` move.** `.grugops/queue/pending/refinement-ABC-041-a4.md` is committed
   on `main`, which is ahead of this branch's base; completing the move means writing `main`'s tree.
   **Owed to the Orchestrator.** A `done.md` marker is written inside the claim directory so a later
   hop reads the claim as complete rather than stale (`queue.stale_ttl_minutes` is 30).
7. **`../cli-chess-qe041` and `../cli-chess-sec041`.** Never entered. No note written under any other
   subtask's folder.

## `node_modules`

The symlink into the main repo's `node_modules` was used for one `npx vitest run` (the stop-condition
check) and is **removed before this hop ends**, as the subtask requires.
