---
subtask: bapm-ABC-228-merge-fold
role: ba-pm
ticket: ABC-228
ref: .grugops/context/bapm-ABC-228-merge-fold/
branch: new grugops/bapm-ABC-228-merge-fold from main e42b637b (worktree .claude/worktrees/bapm-ABC-228-merge-fold)
width: records only, no CPU
---
# BA/PM: ABC-228 merged under (ii) — fold the records the ticket owes at merge
## Read
ABC-228 ticket § Follow-ups (the table) and Result lines; qe-ABC-228-ii verdict `…e39d190c` and smokes `…2123617d`;
se-ABC-228-ii findings `…0f553b17`; EPIC-010 § The merge rule and its smoke ledger.
## Do
- Fold your rows of § Follow-ups: ADR-0045 fold (level 5 = 4 000 ms, the D2 equality), EPIC-008 text, ABC-231 A1, the
  smoke ledger (D 5.0/10, R 7.0/10 at 4 000 ms: recorded, not pooled with 3 000 ms readings; pool closes at this merge).
- Close ABC-228's front-matter (Done, merge e42b637b).
- Cut ONE XS test-only ticket for SE-228ii-a (LOW: the setoption-Hash row reads a bare `go`, expects 4 000) + QE-228ii-b
  (INFO: stale "1 s and a 3 s" title in the TT A7 test). Backlog, P3.
- Note on ABC-225: its rpair budget 3 000 → 4 000 follow-up applies when it rebases (dated line).
- Leave NFR-004/005 catalog text (Security/NFR), AGENTS.md (Scribe) and the ladder re-take (Orchestrator) alone.
## Fences
Records only: plans/, memory-bank/ ADR text as named. No src/, tools/, data/. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
## Publish
Sealed notes (task `bapm-ABC-228-merge-fold`), commit on the branch, `## Result` + trace row here, brief + claim to done/.

## Result

*BA/PM, 2026-10-30, task `bapm-ABC-228-merge-fold`; records only, at `main` `e42b637b`. Branch `grugops/bapm-ABC-228-merge-fold` @ `642953cc` (records); this brief move is on top.*

- **`ABC-228` closed:** front matter `done` / `Done` with `closed:` (merge `e42b637b`, QE PASS_WITH_GAPS `…e39d190c`, which signs UAT). A MERGED block, plus "State at the merge" under § Follow-ups (one state per row).
- **`ADR-0045`, dated in-place fold:** § Status block marked in force, plus a FOLDED block. Dated marks on D1's row 5, D2's equality (`{ 4000, 0 }`) and its ≤ 3 s bar, D4's bare `go`, A1's rows 1–5 and 6 (5 → 6 at 1.25×), A2's equality, A3's margin (1 000 at 5, ceiling 5 s), and § Consequences' `NFR-004` text and `NFR-005` referent. **`ADR-0044` D11 is recorded in that fold block.** `ADR-0044`'s own text is unedited (its D4.2 "3 000 ms" sentence is named there as stale).
- **`EPIC-008`:** dated header block, plus marks on `G5`, `G6`, `G9` and `G11`. No bound moves, and the 3 000 ms close readings stand.
- **`EPIC-010` § The smoke ledger:** rows `ABC-230` (never folded before) and `ABC-228` (R at 4 000 ms, recorded and not pooled). **The 3 000 ms pool closed at `e42b637b`:** 10 games, 8.0 / 10, flag never evaluable. Until milestone 1's batch sets the 4 000 ms reference, R rows wait, so **the trend layer cannot fire before that batch**. Further marks: the R row of the merge rule, the trend reference, the batch budget, § Out of scope's `G9` line and the NFR triggers. Tickets table: `ABC-228` Done, plus row 19 `ABC-243`.
- **`ABC-231` `A1`:** both sides at 4 000 ms. `ABC-205`'s 3 s reading is the motivation, not the comparison. DoR stays 9/10.
- **`ABC-225`:** dated line. (ii) is on `main`, so `rpair`'s budget goes 3 000 → 4 000 at its rebase (A1 requires it). Still Blocked.
- **`EPIC-009`:** no reading plays level 5 at its fixed budget. A dated line on § How today's engine handles time gives 4 000 ms, 160 s, 18 % (arithmetic).
- **`ABC-243` cut** (`plans/tickets/ABC-243-the-setoption-hash-row-reads-a-bare-go-at-level-5-and-the-tt-memory-row-names-the-budget-it-reads.md`): XS, P3, EPIC-010, test-only (SE-228ii-a + QE-228ii-b).
  - A1: bare `go` after `setoption Hash` reads 4 000–4 200 ms.
  - A2: plants at L = 4, 6, 7 are each red.
  - A3: TT title, comment and header name the `DEFAULT_BUDGET_MS` search.
  - A4: diff fenced to the two test files.
  - A5: gates.
  - No smoke, no UAT. **DoR 9/10, Backlog:** row 10 is the pull order after `ABC-241` (shared `src/uci-session.test.ts`).
- **Notes** (sealed via the plugin's `admitAndAppend`): `20261030T121003Z-ba-pm-decision-8b3061e6`, `20261030T121003Z-ba-pm-observation-9ed549b7`.
- **Seen, not acted on (outside the brief):** `ABC-229`'s wait ("`ABC-228` merged") is met and it owes a re-score. `ADR-0044` D4.2's text is stale. The `NFR-009` catalog phrase "a 1 s and a 3 s search" is stale (Security/NFR's).
- **Checks:** `reference-check` No findings. Host-path scan of the diff and notes found 0 hits. `git diff --check` is clean.
- **Not touched:** `src/`, `tools/`, `data/`, the board, NFR catalog, `AGENTS.md`. Nothing pushed or merged. Main checkout's `claimed/` copies untouched (tracked done/ copies on this branch).

### Trace row (10 cells, header order)

| ABC-228 (merge fold) + ABC-243 (cut) | ABC-228 Done at e42b637b under (ii); BA/PM follow-ups folded: ADR-0045 in-place (level 5 = 4 000 ms, D2 equality, A3 margin 1 000, ADR-0044 D11 recorded), EPIC-008 G5/G6/G9/G11, ABC-231 A1 at 4 000 ms, ABC-225 rpair 4 000 at rebase, EPIC-009 none found; smoke ledger ABC-230 + ABC-228, 3 000 ms pool closed; ABC-243 test-only follow-up for SE-228ii-a + QE-228ii-b | EPIC-010 | — | NFR-004 (≤ 4 s default, 5 s ceiling), NFR-005 (referent 4 s, floor 6), NFR-008 (ABC-243: 0 real-clock rows), NFR-009 (label only); ADR-0045 fold, ADR-0053 d10; notes …8b3061e6, …9ed549b7 | grugops/bapm-ABC-228-merge-fold @ 642953cc (records only): ADR-0045, EPIC-008, EPIC-009, EPIC-010, ABC-225, ABC-228, ABC-231, ABC-243 (new), .grugops/context/bapm-ABC-228-merge-fold/notes/ (2) | none run (records only); reference-check No findings | — (ABC-228 UAT signed by QE verdict …e39d190c; ABC-243 none owed, test-only) | — | ABC-228 Done; ABC-243 Backlog DoR 9/10 (after ABC-241) |
