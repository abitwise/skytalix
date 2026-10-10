---
id: 20261010T111610Z-ba-pm-observation-rebased-onto-75c106f-abc126-ready-for-uat-def9f86a
kind: observation
by: ba-pm
at: 2026-10-10T11:16:10Z
verified_by:
confidence: high
refs:
  - ABC-126
  - ABC-131
  - ABC-083
  - ADR-0035
  - NFR-003
  - .grugops/context/owner-adrs-followups/notes/20261010T111342Z-ba-pm-decision-owner-adrs-folded-five-ready-abc131-cut-epic003-amended-41693c28.md
  - .grugops/queue/pending/secnfr-catalog-2026-10-10.md
supersedes:
---

Addendum to `…41693c28`, same hop. The wave moved during the hop, from `246ddfc` to `75c106f`
(`ADR-0035` proposed, `ABC-058` pulled and built, `ABC-126` QE-passed, Security/NFR catalog task
enqueued). This branch was rebased onto `75c106f`. The only conflict was the append at the end of
`plans/traceability.md`; both row sets are kept, this hop's last.

What changed for this hop's pages, and what was done:

1. **`ABC-126` is `Ready for UAT`** (QE PASS_WITH_GAPS `b22f6e16`), and the Orchestrator ruled the
   owner's UAT word is owed because `src/puzzle-corpus.ts` is a non-test file. `ABC-131` and `ABC-083`
   now say so. `ABC-131` touches the same file and the baseline, so **its UAT also needs the owner's
   word**; its page now says that instead of "the Orchestrator's call". The DoR scores do not move:
   the ordering is a merge order on a built, QE-passed ticket, the same reading `rescore-batch-2` gave
   `ABC-059` behind `ABC-127` (then also `Ready for UAT`). If the Orchestrator wants `ABC-131` built
   before that word arrives, branch it from `grugops/ABC-126-corpus-repairs`.
2. **`RISK-003`'s 0.8x wording is already enqueued** for Security/NFR (`secnfr-catalog-2026-10-10`).
   That task does not list `NFR-003`'s catalog row, which still names tab-completion (`EPIC-003`
   amendment). **Suggest adding it to that task.**
3. **`ADR-0035` (proposed)** leaves `N8-LANE`'s 5 % / 650 ms unchanged, so no `N8-LANE` line on this
   hop's pages is stale.
4. None of the files cited by this hop's pages changed between `246ddfc` and `75c106f` except
   `plans/board.md`, `plans/traceability.md` and `ABC-126`'s page (status only).
