---
id: 20261010T080456Z-orchestrator-observation-445de55a
kind: observation
by: orchestrator (delegated board-audit hop)
at: 2026-10-10T08:04:56Z
verified_by: 
confidence: high
refs:
  - plans/board.md
  - ABC-127
  - ABC-074
  - ABC-055
  - .grugops/queue/claimed/qe-ABC-080
  - .grugops/queue/claimed/rescore-abc081
supersedes: 
---

Board audit of `plans/board.md` against the record (Workflow 09 reconciliation), subtask
`board-audit-2026-10-10`. Base: `grugops/wave-2026-09-25` @ `f9689e7` (moved forward from
`71be48b` before any edit so the `ABC-127` cut and pull are in the record; the pull commit says
"board row lands with the audit merge").

Counts after: Backlog 38 tickets + 4 epics; Ready 0/8; Ready for Dev 0/6; In Development 1/3;
In Review 0/3; In Security/NFR 0/2; Ready for UAT 0/4; In UAT 0/4; Ready to Release 0/4;
Done 77 tickets + 2 epics; Blocked 1. 117 ticket pages = 117 board ticket rows, no duplicates.

## Discrepancies and fixes

1. **One column per ticket; pages vs board ids.** No ticket was on two columns. Every
   `plans/tickets/` id was on the board and the other way round, **except `ABC-127`**: cut and
   merged (`ab87d8a`), pulled by the Orchestrator (`f9689e7`, `ticket-to-pr-ABC-127` enqueued)
   with no board row. FIXED: row added under `In Development` (pull = `In Development`, the
   precedent of `ABC-084`/`086`/`125`/`113`). Every Done row carries merge + owner-word, waiver
   or lean-merge evidence; no Backlog row's own text says Done/accepted for itself.
2. **WIP counts and limits.** Every rendered heading count equalled its rows (In Development
   0 → 1 with the `ABC-127` row). Every rendered limit equals `wip_limits`. NOT FIXED:
   `In Analysis` (2) and `In Design` (2) have no heading. That is Backlog ticket `ABC-055`'s
   scope (A1–A5, incl. a history-archive rule), so the audit did not do it; `ABC-055`'s row now
   says that `Ready for Dev` got its heading since it was cut.
3. **Rows touched 2026-10-09/10 and stale dependency text.** Dated annotations, append-only,
   no DoR re-scored:
   - `ABC-085`: "needs `ABC-087` + `ABC-125`" — `ABC-125` Done (`99fb7ad`).
   - `ABC-087`: "needs `ABC-084`; `ABC-125` should land first" — both Done; blunder ruling still owed.
   - `ABC-126`: "BA/PM re-score owed" — now dispatched (`rescore-batch-2026-10-10`); follows `ABC-127`.
   - `ABC-093`: "HARD-BLOCKED on ABC-092's ADR" — lifted 2026-09-19 (`ADR-0023` ratified, `ABC-092` Done).
   - `ABC-095`: "`ABC-078` is `In Review` and unmerged" — Done 2026-08-20.
   - `ABC-057`/`058`/`059`: "ordered behind `ABC-042`'s merge" — Done 2026-08-15, `src/cli.test.ts` exists.
   - `ABC-060`: "the only one … NOT blocked on `ABC-042`" — none is now.
   `ABC-083`, `ABC-036`, `ABC-038` already carried correct 2026-10-10 annotations; `ABC-104`
   already said "now unblocked". Left as they were.
4. **Blocked.** `ABC-074` is still blocked: no non-M3 machine; `plans/nfr-catalog.md` keeps
   "Any non-M3 machine … still open" and the 2026-09-26 depth-7 catalog update did not lift it.
   The row had no date. FIXED: blocked-by reason and date added (since 2026-08-16, the cut at
   `7e3ff54`; 55 days, past `blocked_escalation_days` = 2) and marked escalated to the owner.
   `checkpoint: escalate_stale_blocker` — a human must supply a machine or rule the spike out.
5. **Ticket frontmatter.** 34 pages disagreed, not 33: the 33 Done tickets the 2026-10-10 header
   counted, plus `ABC-074` (page `backlog`/`Backlog`, board `Blocked`). FIXED: all 34 synced
   (`status:` kebab-case of the column per the board's FORMAT block; only those two lines per
   page). Excluded as instructed and NOT touched: `ABC-126`, `ABC-083`, `ABC-036`, `ABC-038`,
   `ABC-010`, `ABC-087` (none of the six disagreed anyway) and the new `ABC-127`, which still
   reads `backlog`/`Backlog` against `In Development` — the one remaining disagreement.
6. **Stale queue claims (NOT changed, Orchestrator decides).** `claimed/qe-ABC-080/` and
   `claimed/rescore-abc081/` each hold ONLY a git-tracked `claim.md`. The subtask files were moved
   to `done/qe-ABC-080.md` (`add461f`, QE PASS WITH FINDINGS) and `done/rescore-abc081.md`
   (`92fb9a4`), but the claim records were never moved to `done/<task>.claim.md` as every other
   finished subtask's were, and the directories were never removed. Both tickets are Done
   (2026-09-25). They are ~15 days past `stale_ttl_minutes` = 30. A Workflow 17 `sweepStale` would
   "return the subtask to `pending/`", but there is no subtask file to return, and the work is
   finished — so reclaiming is the wrong fix. Suggested: move each `claim.md` to
   `done/<task>.claim.md` and drop the empty directory. Also: `qe-ABC-080`'s `at:` is
   `2026-09-25T00:00:00Z`, a placeholder rather than a real stamp (its claim commit `5ba83a8` is
   09:52Z).

## Observed, not in scope
- The board's own rule (above the FORMAT block) says to *replace* the `_Updated:` header and
  archive the outgoing line, but practice since then has been to prepend (140 headers now). The
  brief asked for one prepended line; done that way.
