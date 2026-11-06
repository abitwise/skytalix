---
id: 20261106T135321Z-ba-pm-observation-6bfb0356
kind: observation
by: ba-pm
at: 2026-11-06T13:53:21Z
verified_by: 
confidence: high that each item is open on the records read; nothing run
refs:
  - bapm-lines-1106
  - ABC-307
  - ABC-305
  - ABC-291
  - EPIC-011
  - ADR-0075
  - ADR-0046
  - NFR-008
  - R-N8H-1
  - R-CEN-1
  - R-307-b
  - QE-305-a
  - bce24018
  - d00164ce
  - orch-2026-10-30a/20261105T215707Z-orchestrator-decision-43e6d8fd
  - orch-2026-10-30a/20261105T152827Z-orchestrator-decision-b17275dd
  - qe-ABC-307/20261105T214717Z-qe-e2e-decision-bec57958
  - qe-ABC-307/20261105T214701Z-qe-e2e-observation-78d1f873
  - qe-ABC-305/20261106T132503Z-qe-e2e-decision-482f3e67
  - se-ABC-305/20261106T131126Z-software-engineer-observation-9c9e2a35
  - secnfr-ABC-307-a10/20261105T215450Z-security-nfr-decision-6c111277
  - arch-ABC-307-records/20261105T215607Z-architect-design-decision-7cb68537
  - arch-ABC-307-records/20261105T215607Z-architect-design-observation-c9edb1e2
supersedes: 
seal: sha256:4f1a031c10f5b00657da3d4277159d61faffb94f9d3a7491583e171f0cf6ec0b
---

# bapm-lines-1106: what this hop leaves open

BA/PM, records only. Nothing below is a reading, and none of it is ruled here.

1. **`ABC-307` A9's condition (the Orchestrator).** The page wrote "it reads `main`" and the read was on the arms. `…b17275dd` allows the branch "as the page allows", and QE says a read of `main` after the merge "is the page's and is not done here" (`…bec57958`). The dated line records what happened and closes no gap. Whether a read of `main` is still owed for A9 is not ruled on any note I read. `ABC-305`'s B arm, `a8594b50`, 9.24 s, is the nearest figure, and the page does not read it as A9's.
2. **`R-307-b` (the Orchestrator).** The page still reads LOW and 11 ms. The forecast and the read are at A9, unruled.
3. **d11 (d) on K5 (the owner may overrule).** It tightens what follows a miss, not the bar. `ADR-0075`'s d11 (d) list and its "What stays open" line still read as before the ruling; a dated ADR line would be the Architect's, and the fence kept this hop off it.
4. **"Second K5 miss" reads as F2's second miss.** The ADR's words make a clean run below depth 6 on the build the second miss, though it would be K5's first. The page says so, so the phrase is not read as needing two K5 misses.
5. **Stale, outside this brief:**
   - `ABC-291`'s page still has the build behind `ABC-305`, which merged, and the row census "gates the merge".
   - `ABC-307` § Open 4 and A8 read 22 lines; `ADR-0046` says the page is not re-read.
   - The board's `ABC-291` row still reads "Before K4's PREREG: rule K5's half of F2".
   - `R-CEN-1`'s acceptance on `…43e6d8fd` 4 is "for today", 2026-11-05. No later note renews it.
