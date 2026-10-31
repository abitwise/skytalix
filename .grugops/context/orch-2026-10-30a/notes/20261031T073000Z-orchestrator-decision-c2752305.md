---
id: 20261031T073000Z-orchestrator-decision-c2752305
kind: decision
by: orchestrator
at: 2026-10-31T07:30:00Z
verified_by: 
confidence: high
refs:
  - plans/nfr-catalog.md
  - EPIC-010
  - ABC-225
  - qe-ABC-229
  - …f4673b9f
supersedes: 
seal: sha256:50259da404a7a6ebac89a2136e28cb0309788a40d6057794161876e916010b1e
---

## Owner answers, 2026-10-31 (verbatim)

> "hostname spelling: oeselg-dev ; probably killed yes, some things were running long time, 18.5h pair run you can schedule now"

1. **Catalog reference machine hostname is `oeselg-dev`** (not `oeselg-devl` as written from …f4673b9f). The catalog lines that say `oeselg-devl` are corrected by a Security/NFR records hop; the referent (the Ubuntu Linux host) is unchanged.
2. **17:43 kill (qe-ABC-229's R smoke, 2026-10-30):** the owner says he probably killed it ("some things were running long time"). The interruption is closed as an owner action, not a fault; qe-ABC-229's resumed R re-run stands.
3. **EPIC-010 milestone-1 batch (400-game interleaved R pair, width 1, ≈ 18.5 h + ≈ 1 h QE): the owner says schedule it now.** Orchestrator plan: it starts ALONE as soon as the in-flight se-ABC-245 hands back (its vitest runs would contaminate the batch). Records-only hops may run alongside; ABC-245's QE and ABC-223's games (both ALONE) wait until the batch ends.
