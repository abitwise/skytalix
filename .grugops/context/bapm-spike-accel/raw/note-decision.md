# bapm-spike-accel: ABC-263 SPIKE cut (records only, Architect; M, P2, DoR 10/10) into EPIC-011 row 15; ABC-251 page closed as dropped; ABC-262 A4 marked waived

**Source.** The owner's word, `orch-2026-10-30a` `…78c476bf` (verbatim there), and brief `bapm-spike-accel` at `main` `7c67d3ad`. The ticket page `plans/tickets/ABC-263-*.md` is authoritative for § Scope, § Out of scope and § Acceptance criteria. This note only states what was decided.

**ABC-263, the cut.**
- **Value:** the host's NPU, iGPU and most of its cores sit idle, and 3 000 is beyond the best public single-threaded TypeScript precedent (`RISK-EPIC011-01`). The spike records whether that hardware is a path worth opening, before any build is spent and before the owner is asked to change scope.
- **Scope:** four questions: Q1 accelerators with and without a net; Q2 threads (Lazy SMP, shared TT); Q3 shared or device memory on the APU; Q4 the owner's rules. One deliverable: a proposed ADR or a sealed analysis note.
- **Acceptance (measurable):** A1 one deliverable. A2 a fixed verdict set (`works-on-this-host-now` / `works-after-host-change` / `not-feasible` / `UNKNOWN - verify`), effort XS–XL with hours, effect labelled measured or estimate with a source, risks, an evidence class per claim; no empty field. A3 four named runtimes and five named workloads; a device dispatch's µs set beside about 1.1–1.6 µs a node. A4 scaling at 1/2/4/8/12 workers; Elo per doubling at 100 ms and at 40/15. A5 zero-copy yes/no, dispatch µs, and two shared-table verdicts. A6 a named rule list with an owner and a fair comparison for each; no other ADR, NFR or page changed. A7 a recommendation per strand from a fixed set, and owner questions. A8 the diff fence, ≤ 5 min a run under the lock, no sudo, > 1 h asked first.
- **NFR triggers:** ≤ 5 min a run (BA/PM's reading of "a few minutes"; the Orchestrator may correct it); > 1 h asked first (`…aab3b5f4`); scratch ≤ 2 GB (QE-262-c); native packages only in scratch. No product NFR is triggered.
- **Size M, P2** (the brief's), argued both ways on the page. Split line named: Q1+Q3 apart from Q2+Q4. Not split, because Q3 needs both.
- **Where it sits:** outside `EPIC-011` phases 0–5, any time, records only. No phase waits on it and it waits on none.
- **The scope tension, stated, not resolved:** `EPIC-011` § Out of scope keeps threads and any neural or learned runtime component out (`EPIC-004` non-goal; `ADR-0044` D5). The owner's word asks to investigate, not to build. Investigating is in scope as records. Any build it favours is a scope change, and that is the owner's (standing rulings, 2026-10-22). A6 and A7 make the spike say so.
- **Interpretations surfaced (rule 2):** Q-3K-3's *"Keep game on one core"* is read two ways in A6: one game at a time (the Orchestrator's reading at `…f7a50e95`), or a single-threaded engine. Test note 4 carries BA/PM's reading, that a ≤ 5 min scaling prototype is not a validation game; the Orchestrator confirms it at pull or rules the prototype out.
- **DoR 10/10.** Ready is the Orchestrator's move.

**Two small closes.**
- **ABC-251:** the page is `status: dropped`, `column: Done`, with a dated block, per the convention of `ABC-209`, `ABC-256` and `ABC-250`. "Nothing to cut", as `…1f6ed15a` and `se-ABC-251` `…4342e5b5` say. Not a graded miss; no failed-attempt owed. `EPIC-010` row 26 matches.
- **ABC-262:** A4 is struck through and marked WAIVED (Orchestrator), with a dated block citing `qe-ABC-262` `…ed4d02a5`, `…918ca02e` and `…064f5f07`. That closes QE-262-b. Front matter is left as is, matching the stale front matter of the other recently merged pages (`ABC-249`, `254`, `259`–`261`). The board is the state. `EPIC-011` row 14 moves to Done.

**For the Orchestrator (flag, not fixed):** the front matter of `ABC-249`, `ABC-254`, `ABC-259`, `ABC-260`, `ABC-261` and `ABC-262` still reads `backlog`/`ready`, though the board has them Done. Outside this brief's fence.
