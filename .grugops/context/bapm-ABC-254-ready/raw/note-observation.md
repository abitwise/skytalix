# BA/PM, bapm-ABC-254-ready: the facts the DoR flip and the placement rest on

Read from files and git at `main` `039cb05e`. Nothing was run.

- **The owner's yes.** `orch-2026-10-30a/20261101T131000Z-orchestrator-decision-f7a50e95`, verbatim: "ABC-254: yes
  ; …". The Orchestrator reads it as Q-SP-3 = yes.
- **The amending ADR.** `ADR-0003` § Consequences "2026-11-01 (the amendment to clauses 1 and 3)": one ticket is owed,
  `ABC-254`, under (1-A), behind A1–A6, S2, no smoke; perft 32/32 stays the gate; the full filter stays in `src/` as the
  oracle. Decision note `arch-adr0003-amend/20261101T123526Z-architect-design-decision-c314772c`. Branch commit
  `8d38ff68`, merged to `main` by `89af8b56` (2026-11-01T12:36:40Z).
- **`ABC-250` has not entered development at `039cb05e`.** No queue file under `.grugops/queue/` names it; only
  `bapm-ABC-254-ready` and `qe-ABC-223` are claimed. No local branch matches `250`. Its page front matter reads
  `column: Backlog`, and the board lists it as Ready (DoR 10/10). The board's top line orders "… ABC-249 →
  **ABC-254** → ABC-250 …".
- **A timestamp oddity, not material.** Note `…f7a50e95` carries `at: 2026-11-01T13:10:00Z`, later than the merge
  commits that cite it (`89af8b56` 12:36:40Z, `039cb05e` 12:36:41Z). The placement does not depend on it: whatever
  the clock order, `ABC-250` is not in development at `039cb05e`, after both the yes and the merge.
- **`legalCapturesAndQueenPromotions`.** It is exported by `src/legal.ts` and called by `src/quiescence.ts` out of
  check when `rules.quietPromotions` is on (`ABC-229`, `ADR-0053` decision 5). It runs make/test/unmake on the
  captures and the quiet queen promotions. `src/` was read, not edited.
- **Perft count.** `ADR-0003` reads "32/32 exact across the six standard positions"; `src/perft.test.ts` registers its
  deep rows under `PERFT_DEEP=1`. The ticket's "6/6 positions" and the ADR's "32/32" describe the same suite.
