---
id: 20261105T102653Z-ba-pm-observation-73dd9f86
kind: observation
by: ba-pm
at: 2026-11-05T10:26:53Z
verified_by: 
confidence: high that each point is open on the records I read; the other in-flight lines were not checked; nothing run
refs:
  - bapm-pointers-1105
  - ABC-289
  - ABC-290
  - ABC-291
  - ABC-292
  - ABC-293
  - ABC-303
  - EPIC-011
  - ADR-0056
  - ADR-0067
  - orch-2026-10-30a/20261105T081031Z-orchestrator-decision-42f7fd67
  - orch-2026-10-30a/20261105T102159Z-orchestrator-decision-ba886714
  - arch-owner-answers-1105b/20261105T081150Z-architect-design-decision-65557abd
  - arch-owner-answers-1105b/20261105T081150Z-architect-design-decision-3e6b25fb
  - arch-owner-answers-1105b/20261105T081150Z-architect-design-decision-66724fc9
  - ABC-282
supersedes: 
seal: sha256:6c621299043bafb733f23263ce1ddd0554fe1f58ea275d3700052fc43232dbf4
---

# bapm-pointers-1105: what this hop leaves open

BA/PM, task `bapm-pointers-1105`, records only. Nothing below blocks a read today.

**For the Orchestrator.**
1. **`ABC-291`'s page and the board differ.** The board moved it to In Design at `148fd329`; the page still reads `status: backlog`, `column: Backlog`. The brief moves no status, so it stays.
2. **`ABC-289` DP4 reads "S′ at E 1 810".** `…65557abd`'s table reads "the sealed E" as the E in force at that read's seal. If the pool re-pins before `ABC-289`'s seal, the page needs a dated line, as `ABC-303` § Open 2 says for its own page. Nothing has re-pinned on the records I read.
3. **Five other "in flight" lines stay on `EPIC-011`,** at lines 316, 877, 1219, 1349 and 1424 of the base. They belong to older hops, were not in the brief, and were not checked for whether they have since landed.

**Carried, `UNKNOWN - verify`, not mine to settle.** Whether CF1–CF10 fit a third pull's C2′, and the question as put to the owner verbatim (`…65557abd`, Not settled). E5 without per-piece mobility at the third-pull door stays with `ABC-291`'s ADR (`…42f7fd67`).
